// 画像を WebP に変換しサイズを最適化するスクリプト。
// - 表示サイズに合わせて長辺をリサイズ
// - WebP は q=82-85 でバランス重視
// - OGP 用の JPEG フォールバックも生成（hero-banner-og.jpg）

import { readFile, writeFile, stat } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = resolve(__dirname, "../public/images");

// 変換タスク：{src, out, resize?, quality?, format}
const TASKS = [
  // ロゴ：表示は 40×40px なので Retina 2倍の 80×80 で十分
  {
    src: "emblem.png",
    out: "emblem.webp",
    resize: { width: 96, height: 96, fit: "contain" },
    quality: 90,
    format: "webp",
  },
  // LCP 画像（TOP ヒーロー）。元 1672×941 を維持しつつ WebP
  {
    src: "hero-banner.png",
    out: "hero-banner.webp",
    quality: 82,
    format: "webp",
  },
  // OGP / SNS シェア用 JPEG（WebP 未対応スクレイパー向け）
  {
    src: "hero-banner.png",
    out: "hero-banner-og.jpg",
    resize: { width: 1200 },
    quality: 82,
    format: "jpeg",
  },
  // /about の章ヒーロー 5枚
  ...["01-kings-league", "02-murash-fc", "03-kato-owner", "04-tournaments", "05-new-murash"].map(
    (n) => ({
      src: `about/${n}.png`,
      out: `about/${n}.webp`,
      quality: 82,
      format: "webp",
    }),
  ),
  // インフォグラフィック 5枚
  ...["mexico-2024", "italy-2025", "france-2025", "brazil-2026", "rebirth"].map((n) => ({
    src: `infographics/${n}.png`,
    out: `infographics/${n}.webp`,
    quality: 82,
    format: "webp",
  })),
];

const fmt = (b) => (b / 1024).toFixed(1) + " KB";

let totalIn = 0;
let totalOut = 0;
console.log("Converting images...");
for (const t of TASKS) {
  const srcPath = resolve(PUB, t.src);
  const outPath = resolve(PUB, t.out);
  const inBuf = await readFile(srcPath);
  let pipe = sharp(inBuf);
  if (t.resize) pipe = pipe.resize(t.resize);
  if (t.format === "webp") {
    pipe = pipe.webp({ quality: t.quality, effort: 6 });
  } else if (t.format === "jpeg") {
    pipe = pipe.jpeg({ quality: t.quality, progressive: true, mozjpeg: true });
  }
  const outBuf = await pipe.toBuffer();
  await writeFile(outPath, outBuf);
  const inSize = inBuf.length;
  const outSize = outBuf.length;
  totalIn += inSize;
  totalOut += outSize;
  const saved = ((1 - outSize / inSize) * 100).toFixed(1);
  console.log(
    `  ${t.src.padEnd(34)} ${fmt(inSize).padStart(10)} → ${t.out.padEnd(34)} ${fmt(outSize).padStart(10)}  (-${saved}%)`,
  );
}
console.log(
  `\nTOTAL: ${fmt(totalIn)} → ${fmt(totalOut)}  (saved ${fmt(totalIn - totalOut)}, -${((1 - totalOut / totalIn) * 100).toFixed(1)}%)`,
);
