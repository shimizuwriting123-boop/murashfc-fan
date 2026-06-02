// サイト内の人名・大会名・Wiki 用語を自動的に該当ページへリンクするユーティリティ。
//
// 設計のポイント:
// - `src/data/players.ts` / `src/data/wiki.ts` から動的に候補を生成（メンテ不要）
// - HTML 文字列ベースで動作、既存の `<a>` / `<code>` / `<pre>` 内部はスキップ
// - 長い名前を優先（「中村駿介」 > 「中村」）、wiki > tournament > player の順
// - excludeUrl で自リンク回避、seenTerms で同セクション内の重複抑止

import { players } from "../data/players";
import { wikiEntries } from "../data/wiki";

export type AutoLinkType = "player" | "tournament" | "wiki";

export interface AutoLinkOptions {
  /** 現在ページの URL。マッチが同じ URL に飛ぶ場合はリンクを貼らない（自リンク回避） */
  excludeUrl?: string;
  /** 有効にするタイプ。省略時は全種類 */
  enabledTypes?: AutoLinkType[];
  /**
   * 渡された場合、既出の用語はリンク化されず、新規リンク化された用語が追加される。
   * 呼び出し側で同セクション内の段落をループする場合、共有 Set を渡せば重複抑止できる。
   */
  seenTerms?: Set<string>;
}

interface Candidate {
  term: string;
  url: string;
  type: AutoLinkType;
}

// ============================================================
// 候補ビルダー（公開 API：将来の拡張やテストで使う）
// ============================================================

/** 人名 → /players/{slug} のマップ。nickname も分割して登録。 */
export function buildPlayerLinkMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const p of players) {
    map[p.name] = `/players/${p.slug}`;
    if (p.nickname) {
      // 「あがちゃん・あがた」のように区切り文字でつながる愛称を分解
      for (const nick of p.nickname.split(/[・／/、,\s]+/).filter(Boolean)) {
        // 短すぎる/長すぎる/特殊記号入りはスキップ（誤マッチ・複雑な表記を避ける）
        if (nick.length < 2 || nick.length > 14) continue;
        if (/[（）()「」『』:：（）]/.test(nick)) continue;
        // 既に同名の登録があれば最初の人物にマッチさせる（後勝ちしない）
        if (!(nick in map)) map[nick] = `/players/${p.slug}`;
      }
    }
  }
  return map;
}

/** 大会名 → /tournaments/{urlSlug} のマップ。長い表記も短い表記も含む。 */
export function buildTournamentLinkMap(): Record<string, string> {
  return {
    メキシコ大会: "/tournaments/mexico-2024",
    イタリア大会: "/tournaments/italy-2025",
    フランス大会: "/tournaments/france-2025",
    ブラジル大会: "/tournaments/brazil-2026",
    再スタート編: "/rebirth",
  };
}

/** Wiki 用語 → /wiki/{slug}。公開ステータスのみ含まれる前提（wikiEntries が既にフィルタ済み） */
export function buildWikiLinkMap(): Record<string, string> {
  const map: Record<string, string> = {};
  for (const w of wikiEntries) {
    map[w.title] = `/wiki/${w.slug}`;
  }
  return map;
}

// ============================================================
// 候補リスト：優先度（wiki > tournament > player）× 長さ降順でソート
// ============================================================
function buildCandidates(types: Set<AutoLinkType>): Candidate[] {
  const out: Candidate[] = [];
  if (types.has("wiki")) {
    for (const [term, url] of Object.entries(buildWikiLinkMap())) {
      out.push({ term, url, type: "wiki" });
    }
  }
  if (types.has("tournament")) {
    for (const [term, url] of Object.entries(buildTournamentLinkMap())) {
      out.push({ term, url, type: "tournament" });
    }
  }
  if (types.has("player")) {
    for (const [term, url] of Object.entries(buildPlayerLinkMap())) {
      out.push({ term, url, type: "player" });
    }
  }
  // 長い term を優先（「中村駿介」 > 「中村」）。同長なら wiki > tournament > player の挿入順を維持。
  const TYPE_PRIORITY: Record<AutoLinkType, number> = {
    wiki: 0,
    tournament: 1,
    player: 2,
  };
  out.sort((a, b) => {
    if (b.term.length !== a.term.length) return b.term.length - a.term.length;
    return TYPE_PRIORITY[a.type] - TYPE_PRIORITY[b.type];
  });
  return out;
}

// ============================================================
// HTML エスケープ＆Markdown 風記法のパーサ
// ============================================================

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * `**bold**` と `[text](url)` を HTML に変換する。
 * 「**」を含まない素直なテキストはエスケープのみ。
 * 生成される `<strong>` と `<a>` には class が付くため、global.css のスタイルが適用される：
 * - `.rich-strong` : 太字＋白強調
 * - `.rich-link`   : 赤＋下線（明示的なリンク。自動リンクの控えめスタイルとは区別）
 */
export function markdownToHtml(text: string): string {
  // まず HTML 特殊文字をエスケープ
  let html = escapeHtml(text);
  // [text](url) → <a class="rich-link" href="url">text</a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => {
    return `<a class="rich-link" href="${escapeAttr(u)}">${t}</a>`;
  });
  // **bold** → <strong class="rich-strong">bold</strong>
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="rich-strong">$1</strong>');
  return html;
}

// ============================================================
// 自動リンクの本体
// ============================================================

/** 自動リンクをスキップすべき要素タグ（中身を変更しない） */
const SKIP_TAGS = new Set(["a", "code", "pre", "script", "style", "kbd", "samp"]);

/**
 * HTML 文字列を走査し、候補語を `<a class="auto-link">...</a>` に置換する。
 * 既存の `<a>` 等のスキップ対象タグの内部は変更しない。
 */
export function autoLink(html: string, opts: AutoLinkOptions = {}): string {
  const types = new Set<AutoLinkType>(
    opts.enabledTypes ?? ["player", "tournament", "wiki"],
  );
  const candidates = buildCandidates(types).filter(
    (c) => !opts.excludeUrl || c.url !== opts.excludeUrl,
  );

  const seen = opts.seenTerms;
  let out = "";
  let i = 0;
  const skipStack: string[] = [];

  while (i < html.length) {
    const c = html[i];

    if (c === "<") {
      // タグを丸ごとパース（属性内の > を避けるため、属性値の中の引用符を尊重）
      let end = i + 1;
      let inQuote: string | null = null;
      while (end < html.length) {
        const ch = html[end];
        if (inQuote) {
          if (ch === inQuote) inQuote = null;
        } else {
          if (ch === '"' || ch === "'") inQuote = ch;
          else if (ch === ">") break;
        }
        end++;
      }
      if (end >= html.length) {
        out += html.slice(i);
        break;
      }
      const tagStr = html.slice(i, end + 1);
      const isClosing = tagStr.startsWith("</");
      const isSelfClosing = tagStr.endsWith("/>");
      const tagNameMatch = tagStr.match(/^<\/?([a-zA-Z][a-zA-Z0-9]*)/);
      const tagName = (tagNameMatch?.[1] ?? "").toLowerCase();

      if (SKIP_TAGS.has(tagName)) {
        if (isClosing) {
          const idx = skipStack.lastIndexOf(tagName);
          if (idx !== -1) skipStack.splice(idx, 1);
        } else if (!isSelfClosing) {
          skipStack.push(tagName);
        }
      }
      out += tagStr;
      i = end + 1;
    } else if (skipStack.length > 0) {
      out += c;
      i++;
    } else {
      // 候補のいずれかが i 位置から一致するか
      let matched = false;
      for (const cand of candidates) {
        if (seen?.has(cand.term)) continue;
        if (html.startsWith(cand.term, i)) {
          out += `<a class="auto-link" href="${escapeAttr(cand.url)}">${cand.term}</a>`;
          seen?.add(cand.term);
          i += cand.term.length;
          matched = true;
          break;
        }
      }
      if (!matched) {
        out += c;
        i++;
      }
    }
  }

  return out;
}

/**
 * Markdown 風記法（`**bold**` / `[text](url)`）をHTMLに変換し、その後自動リンクをかける。
 * `<p set:html={renderRichText(paragraph, { excludeUrl })} />` の形で利用する。
 */
export function renderRichText(
  text: string,
  opts?: AutoLinkOptions,
): string {
  return autoLink(markdownToHtml(text), opts);
}
