// YouTube oEmbed メタデータをビルド時に取得して JSON にキャッシュするスクリプト。
// src/data/videos.csv に書かれた全 URL のうち、キャッシュ未取得分だけ API を叩く。
// 再ビルド時は src/data/videos-cache.json がそのまま使われ、ネットワーク呼び出しは発生しない。

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = resolve(__dirname, "../src/data/videos.csv");
const CACHE_PATH = resolve(__dirname, "../src/data/videos-cache.json");

// ---- RFC4180 準拠の最小 CSV パーサ ----
function parseCSV(text) {
  const rows = [];
  let row = [];
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

function extractVideoId(url) {
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

async function fetchOembed(url) {
  const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  const res = await fetch(endpoint, {
    headers: { "User-Agent": "murashfc-fan-build/1.0" },
  });
  if (!res.ok) throw new Error(`oEmbed ${res.status}`);
  return await res.json();
}

// ---- 本処理 ----
if (!existsSync(CSV_PATH)) {
  console.error(`[videos] CSV not found: ${CSV_PATH}`);
  process.exit(1);
}

const csv = readFileSync(CSV_PATH, "utf8");
const rows = parseCSV(csv);
const header = rows[0];

const urls = new Set();
for (let r = 1; r < rows.length; r++) {
  for (let c = 1; c < header.length; c++) {
    const url = (rows[r][c] ?? "").trim();
    if (url) urls.add(url);
  }
}

mkdirSync(dirname(CACHE_PATH), { recursive: true });
const cache = existsSync(CACHE_PATH)
  ? JSON.parse(readFileSync(CACHE_PATH, "utf8"))
  : {};

let hits = 0;
let fetched = 0;
let failed = 0;
const startedAt = Date.now();

for (const url of urls) {
  const existing = cache[url];
  // 既存キャッシュがあり、かつ failed フラグが立っていなければ再利用
  if (existing && !existing.failed && existing.title) {
    hits++;
    continue;
  }
  const videoId = extractVideoId(url);
  try {
    const data = await fetchOembed(url);
    cache[url] = {
      videoId,
      title: data.title ?? "動画タイトル取得中",
      thumbnail:
        data.thumbnail_url ??
        (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : ""),
    };
    fetched++;
    process.stdout.write(".");
    // YouTube に礼儀のスロットリング
    await new Promise((r) => setTimeout(r, 120));
  } catch (err) {
    cache[url] = {
      videoId,
      title: existing?.title ?? "動画タイトル取得中",
      thumbnail:
        existing?.thumbnail ??
        (videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : ""),
      failed: true,
    };
    failed++;
    process.stdout.write("x");
  }
}

writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + "\n");

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log(
  `\n[videos] cache hits: ${hits}, fetched: ${fetched}, failed: ${failed}, total: ${urls.size} (${elapsed}s)`,
);
