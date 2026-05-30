// Vite の ?raw 取り込みで CSV をビルド時にバンドル
import csvRaw from "./videos.csv?raw";
import cacheJson from "./videos-cache.json";

export type VideoCategory = "mexico" | "italy" | "france" | "brazil" | "tryout";

export interface VideoCard {
  url: string;
  videoId: string | null;
  title: string;
  thumbnail: string;
}

interface CacheEntry {
  videoId: string | null;
  title: string;
  thumbnail: string;
  failed?: boolean;
}

const cache = cacheJson as Record<string, CacheEntry>;

// CSV のヘッダー列 → 内部カテゴリ
const COLUMN_TO_CATEGORY: Record<string, VideoCategory> = {
  メキシコ大会: "mexico",
  イタリア大会: "italy",
  フランス大会: "france",
  ブラジル大会: "brazil",
  トライアウト: "tryout",
};

// ============================================================
// CSV パーサ：RFC4180 準拠（"..." ダブルクォート + "" エスケープ）
// ============================================================
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else {
      if (c === '"') {
        inQuotes = true;
      } else if (c === ",") {
        row.push(field);
        field = "";
      } else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field);
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += c;
      }
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

function extractVideoId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") return u.pathname.slice(1) || null;
    if (u.pathname.startsWith("/live/")) return u.pathname.slice(6) || null;
    if (u.pathname.startsWith("/shorts/")) return u.pathname.slice(8) || null;
    if (u.pathname.startsWith("/embed/")) return u.pathname.slice(7) || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    return null;
  } catch {
    return null;
  }
}

// ============================================================
// CSV → カテゴリ別カード配列
// ============================================================
const rows = parseCSV(csvRaw);
const header = rows[0].map((h) => h.trim());

const byCategory: Record<VideoCategory, VideoCard[]> = {
  mexico: [],
  italy: [],
  france: [],
  brazil: [],
  tryout: [],
};

for (let r = 1; r < rows.length; r++) {
  for (let c = 1; c < header.length; c++) {
    const url = (rows[r][c] ?? "").trim();
    if (!url) continue;
    const category = COLUMN_TO_CATEGORY[header[c]];
    if (!category) continue;

    const meta = cache[url];
    const videoId = meta?.videoId ?? extractVideoId(url);
    const fallbackThumb = videoId
      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      : "";

    byCategory[category].push({
      url,
      videoId,
      title: meta?.title ?? "動画タイトル取得中",
      thumbnail: meta?.thumbnail || fallbackThumb,
    });
  }
}

export function getVideosFor(category: VideoCategory): VideoCard[] {
  return byCategory[category];
}

// tournaments.ts の urlSlug → videos.ts のカテゴリ
export const TOURNAMENT_URLSLUG_TO_VIDEO_CATEGORY: Record<string, VideoCategory> = {
  "mexico-2024": "mexico",
  "italy-2025": "italy",
  "france-2025": "france",
  "brazil-2026": "brazil",
};
