import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "node:crypto";
import {
  POLL_ID,
  REVEAL_THRESHOLD,
  TOP_N,
  getCandidate,
  isVotingOpen,
  reasonLabel,
  type MvpResultEntry,
  type MvpResults,
} from "../data/mvp-poll";

/**
 * MVP投票のサーバー側処理。
 * API ルート（/api/mvp-vote, /api/mvp-results）からのみ import すること。
 * Service Role キーを使うため、クライアントへバンドルされる場所では使わない。
 */

interface VoteRow {
  candidate_slug: string;
  reason_tags: string[];
  voter_hash: string;
}

let cached: SupabaseClient | null = null;

/**
 * 環境変数が揃っていない場合は null を返す（500 ではなく「集計中」として扱えるように）。
 *
 * `import.meta.env` はビルド時に値がバンドルへ埋め込まれるため、
 * 実行時に読む `process.env` を先に見る。ローカル開発（.env）向けに
 * `import.meta.env` へのフォールバックだけ残している。
 */
export function getSupabase(): SupabaseClient | null {
  if (cached) return cached;
  const url = process.env.SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

/**
 * 投票者の識別子。
 * IPアドレスと User-Agent は **生のまま保存せず**、ソルト付き sha256 のみを保存する。
 */
export function voterHash(request: Request): string {
  const salt =
    process.env.VOTE_HASH_SALT ?? import.meta.env.VOTE_HASH_SALT ?? "";
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") ?? "";
  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex");
}

export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

// ------------------------------------------------------------
// 簡易レート制限（同一IPからの連続リクエストを抑える）
// サーバーレスではインスタンスごとのメモリなので厳密ではない。
// 仕様どおり「気軽な連投」を止める程度の位置づけ。
// ------------------------------------------------------------
const RATE_LIMIT_MS = 10_000;
const lastSeen = new Map<string, number>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  const prev = lastSeen.get(ip);
  if (prev !== undefined && now - prev < RATE_LIMIT_MS) return true;
  lastSeen.set(ip, now);
  // メモリが際限なく増えないよう、古いエントリを間引く
  if (lastSeen.size > 5000) {
    for (const [k, t] of lastSeen) {
      if (now - t > RATE_LIMIT_MS) lastSeen.delete(k);
    }
  }
  return false;
}

// ------------------------------------------------------------
// 集計
// ------------------------------------------------------------

/**
 * 集計して上位 TOP_N 件だけを返す。
 * **6位以下の候補ごとの票数はレスポンスに含めない**（開発者ツールから見えないように、
 * サーバー側で絞り込んでから返す）。
 */
export async function buildResults(hash: string | null): Promise<MvpResults> {
  const supabase = getSupabase();
  const votingOpen = isVotingOpen();

  if (!supabase) {
    // 未設定時は「まだ集計が公開されていない」状態として扱う
    return {
      total: 0,
      threshold: REVEAL_THRESHOLD,
      revealed: false,
      top: [],
      othersPct: 0,
      yourVote: null,
      votingOpen,
    };
  }

  const { data, error } = await supabase
    .from("mvp_votes")
    .select("candidate_slug, reason_tags, voter_hash")
    .eq("poll_id", POLL_ID);

  if (error) throw error;

  const rows = (data ?? []) as VoteRow[];
  const total = rows.length;

  // 自分の投票（自分自身の情報なので返してよい）
  const mine = hash ? rows.find((r) => r.voter_hash === hash) : undefined;

  // 閾値未満のあいだは、票数・％を一切返さない
  if (total < REVEAL_THRESHOLD) {
    return {
      total,
      threshold: REVEAL_THRESHOLD,
      revealed: false,
      top: [],
      othersPct: 0,
      yourVote: mine
        ? {
            slug: mine.candidate_slug,
            name: getCandidate(mine.candidate_slug)?.name ?? mine.candidate_slug,
            inTop: false,
          }
        : null,
      votingOpen,
    };
  }

  // 候補ごとの集計
  const tally = new Map<string, { votes: number; tags: Map<string, number> }>();
  for (const r of rows) {
    let e = tally.get(r.candidate_slug);
    if (!e) {
      e = { votes: 0, tags: new Map() };
      tally.set(r.candidate_slug, e);
    }
    e.votes++;
    // 同じ投票内でのタグ重複は1回として数える
    for (const t of new Set(r.reason_tags ?? [])) {
      e.tags.set(t, (e.tags.get(t) ?? 0) + 1);
    }
  }

  const ranked = [...tally.entries()].sort((a, b) => {
    if (b[1].votes !== a[1].votes) return b[1].votes - a[1].votes;
    return a[0].localeCompare(b[0]); // 同数は slug 順で安定させる
  });

  const topSlugs = ranked.slice(0, TOP_N);

  const top: MvpResultEntry[] = topSlugs.map(([slug, e]) => {
    const c = getCandidate(slug);
    const reasons = [...e.tags.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]);
      })
      .slice(0, 3)
      .map(([id, n]) => ({
        id,
        label: reasonLabel(id),
        // その候補に投票した人のうち、何％がそのタグを選んだか
        pct: Math.round((n / e.votes) * 100),
      }));

    return {
      slug,
      name: c?.name ?? slug,
      role: c?.isStaff ? c.label : null,
      votes: e.votes,
      pct: Math.round((e.votes / total) * 100),
      reasons,
    };
  });

  const topVotes = topSlugs.reduce((s, [, e]) => s + e.votes, 0);
  const othersPct = Math.round(((total - topVotes) / total) * 100);

  const inTop = mine ? topSlugs.some(([slug]) => slug === mine.candidate_slug) : false;

  return {
    total,
    threshold: REVEAL_THRESHOLD,
    revealed: true,
    top,
    othersPct,
    yourVote: mine
      ? {
          slug: mine.candidate_slug,
          name: getCandidate(mine.candidate_slug)?.name ?? mine.candidate_slug,
          inTop,
        }
      : null,
    votingOpen,
  };
}

export function jsonResponse(body: unknown, init?: ResponseInit): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers ?? {}),
    },
  });
}
