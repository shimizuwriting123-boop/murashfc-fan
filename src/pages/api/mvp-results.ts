import type { APIRoute } from "astro";
import { buildResults, jsonResponse } from "../../lib/mvp-vote-server";

// このルートだけサーバー実行にする（他のページは静的生成のまま）
export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // このレスポンスはエッジで共有キャッシュに載るため、
    // 投票者ごとに異なる情報（yourVote）は **含めない**。
    // 自分の投票はブラウザ側（localStorage）と POST のレスポンスで扱う。
    const results = await buildResults(null);
    return jsonResponse(results, {
      headers: {
        "cache-control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    });
  } catch (e) {
    console.error("[mvp-results]", e);
    return jsonResponse({ error: "集計を取得できませんでした" }, { status: 500 });
  }
};
