// Vite の ?raw 取り込みで CSV をビルド時にバンドル
import csvRaw from "./wiki.csv?raw";
import { players } from "./players";

export type WikiCategory = "あだ名" | "セリフ" | "事件・出来事";
export type WikiStatus = "公開" | "下書き";

export interface WikiEntry {
  slug: string;
  title: string;
  reading: string;
  category: WikiCategory;
  relatedPeople: string[];
  /** "-" は null として扱う */
  tournament: string | null;
  summary: string;
  /** 改行を含む本文。`**強調**` と `[text](url)` をサポート */
  content: string;
  tags: string[];
  status: WikiStatus;
}

// ============================================================
// CSV パーサ：RFC4180 に準拠（"..." ダブルクォート + "" エスケープ）
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
  // 完全な空行は捨てる
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

const rows = parseCSV(csvRaw);
const header = rows[0].map((h) => h.trim());
const dicts = rows.slice(1).map((r) => {
  const o: Record<string, string> = {};
  header.forEach((h, i) => (o[h] = r[i] ?? ""));
  return o;
});

function splitList(v: string): string[] {
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export const wikiEntries: WikiEntry[] = dicts
  .filter((r) => r.status.trim() === "公開")
  .map((r) => ({
    slug: r.slug.trim(),
    title: r.title.trim(),
    reading: r.reading.trim(),
    category: r.category.trim() as WikiCategory,
    relatedPeople: splitList(r.related_people),
    tournament: r.tournament.trim() === "-" ? null : r.tournament.trim(),
    summary: r.summary.trim(),
    content: r.content,
    tags: splitList(r.tags),
    status: r.status.trim() as WikiStatus,
  }));

export function getWikiBySlug(slug: string): WikiEntry | undefined {
  return wikiEntries.find((e) => e.slug === slug);
}

/** 名前 → 選手詳細ページの slug（存在する場合のみ） */
export function getPlayerSlugByName(name: string): string | null {
  // 完全一致 or 「(あだ名)」付き表記対応
  const stripped = name.replace(/[（(].*?[)）]\s*$/, "").trim();
  const p = players.find((p) => p.name === stripped || p.name === name);
  return p ? p.slug : null;
}

// ============================================================
// カテゴリ表示用スタイル
// ============================================================
export const CATEGORY_STYLE: Record<
  WikiCategory,
  { badge: string; dot: string; hover: string }
> = {
  // 事件・出来事 → 赤
  "事件・出来事": {
    badge:
      "border-murash-red/40 bg-murash-red/10 text-murash-red-light",
    dot: "bg-murash-red",
    hover: "hover:border-murash-red/60",
  },
  // あだ名 → 青
  "あだ名": {
    badge: "border-blue-400/40 bg-blue-400/10 text-blue-300",
    dot: "bg-blue-400",
    hover: "hover:border-blue-400/60",
  },
  // セリフ → 黄
  "セリフ": {
    badge: "border-yellow-400/40 bg-yellow-400/10 text-yellow-300",
    dot: "bg-yellow-400",
    hover: "hover:border-yellow-400/60",
  },
};

export const CATEGORY_ORDER: WikiCategory[] = [
  "あだ名",
  "セリフ",
  "事件・出来事",
];

// ============================================================
// 本文セグメント変換：**bold** と [text](url) を扱う
// ============================================================
export interface Segment {
  text: string;
  bold?: boolean;
  href?: string;
}

export function segmentMarkup(text: string): Segment[] {
  const re = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  const parts = text.split(re).filter((p) => p !== "");
  return parts.map<Segment>((p) => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return { text: p.slice(2, -2), bold: true };
    }
    const m = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) return { text: m[1], href: m[2] };
    return { text: p };
  });
}
