import type { APIRoute } from "astro";
import {
  MAX_REASON_TAGS,
  POLL_ID,
  isValidCandidate,
  isValidReasonTag,
  isVotingOpen,
} from "../../data/mvp-poll";
import {
  buildResults,
  clientIp,
  getSupabase,
  jsonResponse,
  rateLimited,
  voterHash,
} from "../../lib/mvp-vote-server";

// このルートだけサーバー実行にする（他のページは静的生成のまま）
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // 投票直後のレスポンスは利用者ごとに異なるため、共有キャッシュに載せない
  const noStore = { "cache-control": "no-store" };

  try {
    if (!isVotingOpen()) {
      return jsonResponse(
        { error: "投票は締め切りました" },
        { status: 403, headers: noStore },
      );
    }

    const ip = clientIp(request);
    if (rateLimited(ip)) {
      return jsonResponse(
        { error: "少し時間をおいてからお試しください" },
        { status: 429, headers: noStore },
      );
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse(
        { error: "リクエストの形式が不正です" },
        { status: 400, headers: noStore },
      );
    }

    const body = payload as { candidateSlug?: unknown; reasonTags?: unknown };

    // --- 候補の検証 ---
    const candidateSlug = body.candidateSlug;
    if (typeof candidateSlug !== "string" || !isValidCandidate(candidateSlug)) {
      return jsonResponse(
        { error: "候補が正しくありません" },
        { status: 400, headers: noStore },
      );
    }

    // --- 理由タグの検証（未定義タグ・上限超過は 400。黙って捨てない） ---
    const rawTags = body.reasonTags ?? [];
    if (!Array.isArray(rawTags)) {
      return jsonResponse(
        { error: "理由タグの形式が不正です" },
        { status: 400, headers: noStore },
      );
    }
    const reasonTags = [...new Set(rawTags.map(String))];
    if (reasonTags.length > MAX_REASON_TAGS) {
      return jsonResponse(
        { error: `理由タグは${MAX_REASON_TAGS}つまでです` },
        { status: 400, headers: noStore },
      );
    }
    if (reasonTags.some((t) => !isValidReasonTag(t))) {
      return jsonResponse(
        { error: "理由タグが正しくありません" },
        { status: 400, headers: noStore },
      );
    }

    const supabase = getSupabase();
    if (!supabase) {
      console.error("[mvp-vote] Supabase の環境変数が未設定です");
      return jsonResponse(
        { error: "投票を受け付けられませんでした" },
        { status: 503, headers: noStore },
      );
    }

    const hash = voterHash(request);

    // --- 二重投票の判定 ---
    // ユニーク制約（poll_id, voter_hash）があるので、競合したら 23505 が返る。
    // その場合も新規作成はせず、現在の集計だけを返す。
    const { error } = await supabase.from("mvp_votes").insert({
      poll_id: POLL_ID,
      candidate_slug: candidateSlug,
      reason_tags: reasonTags,
      voter_hash: hash,
    });

    if (error && error.code !== "23505") {
      console.error("[mvp-vote] insert failed", error);
      return jsonResponse(
        { error: "投票を保存できませんでした" },
        { status: 500, headers: noStore },
      );
    }

    const results = await buildResults(hash);
    return jsonResponse(
      { ...results, duplicate: error?.code === "23505" },
      { headers: noStore },
    );
  } catch (e) {
    console.error("[mvp-vote]", e);
    return jsonResponse(
      { error: "投票を受け付けられませんでした" },
      { status: 500, headers: noStore },
    );
  }
};
