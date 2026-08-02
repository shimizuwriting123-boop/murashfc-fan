import { players } from "./players";

/**
 * ファンが選ぶ イタリア大会MVP（KWCC2026・エキシビション全4戦）の設定。
 *
 * 候補・理由タグ・閾値・締切はすべてここで一元管理する。
 * API ルートとフロントの両方がこのファイルだけを参照するため、
 * 候補を足す／締切を延ばす等の変更はここ1か所で完結する。
 */

/** 投票の識別子。DB の poll_id と一致させる */
export const POLL_ID = "kwcc2026-italy";

/** 総投票数がこの数に達するまで、％と票数を公開しない */
export const REVEAL_THRESHOLD = 20;

/** 受付期限（JST）。これを過ぎたら投票UIを出さず結果のみ表示する */
export const VOTE_DEADLINE_ISO = "2026-08-31T23:59:59+09:00";

/** 結果に出す上位の人数。6位以下は個別に出さない */
export const TOP_N = 5;

/** 理由タグは最大この数まで選べる */
export const MAX_REASON_TAGS = 3;

export function isVotingOpen(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(VOTE_DEADLINE_ISO).getTime();
}

// ============================================================
// 理由タグ
// ============================================================

export interface ReasonTag {
  /** DB に保存されるのはこの id。表示名を変えてもデータが壊れないようにする */
  id: string;
  label: string;
}

export const REASON_TAGS: ReasonTag[] = [
  { id: "decisiveness", label: "決定力がえぐい" },
  { id: "guardian", label: "守護神だった" },
  { id: "presence", label: "全4戦で存在感があった" },
  { id: "impact", label: "一発の衝撃度がすごい" },
  { id: "gamechanger", label: "試合の流れを変えた" },
  { id: "unsung", label: "地味だけど効いていた" },
  { id: "entertaining", label: "見ていて一番楽しい" },
  { id: "growth", label: "成長を感じた" },
  { id: "management", label: "采配・マネジメントが光った" },
];

const REASON_TAG_IDS = new Set(REASON_TAGS.map((t) => t.id));

export function isValidReasonTag(id: string): boolean {
  return REASON_TAG_IDS.has(id);
}

export function reasonLabel(id: string): string {
  return REASON_TAGS.find((t) => t.id === id)?.label ?? id;
}

// ============================================================
// 候補者
// ============================================================

export interface MvpCandidate {
  slug: string;
  name: string;
  /** カード上のイニシャル表示に使う */
  nameEn: string;
  /** 選手はポジション（GK/DF/MF/FW）、首脳陣は役職名 */
  label: string;
  /** 首脳陣は true。カードで役職を出し分けるため */
  isStaff: boolean;
  /** 選手名鑑に個別ページがある場合のみ */
  href?: string;
}

/**
 * 選手16名は players.ts の status="confirmed" から生成する。
 * 名前・背番号・ポジションをここで二重管理しないため。
 */
const currentPlayers: MvpCandidate[] = players
  .filter((p) => p.status === "confirmed")
  // 並びは選手名鑑と同じ背番号順（カード上に番号は出さない）
  .sort((a, b) => (a.number ?? 999) - (b.number ?? 999))
  .map((p) => ({
    slug: p.slug,
    name: p.name,
    nameEn: p.nameEn,
    label: p.position,
    isStaff: false,
    href: `/players/${p.slug}`,
  }));

/**
 * 首脳陣。players.ts に居る人は slug で引いて名前を再利用し、
 * 居ない人（加藤純一）だけここで明示的に定義する。
 */
const STAFF_CANDIDATES: { slug: string; role: string; fallback?: { name: string; nameEn: string } }[] =
  [
    {
      slug: "kato-junichi",
      role: "プレジデント",
      // 加藤純一は選手名鑑（players.ts）に登録がないため、ここで定義する
      fallback: { name: "加藤純一", nameEn: "KATO" },
    },
    { slug: "kakitani", role: "共同オーナー" },
    { slug: "ota", role: "監督" },
    { slug: "hasegawa", role: "コーチ" },
    { slug: "yamada", role: "コーチ" },
  ];

const staffCandidates: MvpCandidate[] = STAFF_CANDIDATES.map((s) => {
  const p = players.find((x) => x.slug === s.slug);
  if (p) {
    return {
      slug: p.slug,
      name: p.name,
      nameEn: p.nameEn,
      label: s.role,
      isStaff: true,
      href: `/players/${p.slug}`,
    };
  }
  return {
    slug: s.slug,
    name: s.fallback!.name,
    nameEn: s.fallback!.nameEn,
    label: s.role,
    isStaff: true,
  };
});

/**
 * 候補一覧：選手16名 → 首脳陣5名の順。
 * 選手側（status="confirmed"）と首脳陣側（status="staff"）は players.ts 上で
 * 排他なため重複しないが、念のためここでも slug で重複を除去している。
 */
export const MVP_CANDIDATES: MvpCandidate[] = (() => {
  const out: MvpCandidate[] = [];
  const seen = new Set<string>();
  for (const c of [...currentPlayers, ...staffCandidates]) {
    if (seen.has(c.slug)) continue;
    seen.add(c.slug);
    out.push(c);
  }
  return out;
})();

// 候補は最初から全員を表示する。
// 折りたたむと、開かないと見えない候補だけが不利になり票が偏るため。

const CANDIDATE_BY_SLUG = new Map(MVP_CANDIDATES.map((c) => [c.slug, c]));

export function getCandidate(slug: string): MvpCandidate | undefined {
  return CANDIDATE_BY_SLUG.get(slug);
}

export function isValidCandidate(slug: string): boolean {
  return CANDIDATE_BY_SLUG.has(slug);
}

// ============================================================
// API のレスポンス形状（フロントと共有）
// ============================================================

export interface MvpResultReason {
  id: string;
  label: string;
  pct: number;
}

export interface MvpResultEntry {
  slug: string;
  name: string;
  /** 首脳陣なら役職名、選手なら null */
  role: string | null;
  votes: number;
  pct: number;
  reasons: MvpResultReason[];
}

export interface MvpResults {
  total: number;
  threshold: number;
  revealed: boolean;
  /** 上位 TOP_N 件のみ。6位以下は一切含めない */
  top: MvpResultEntry[];
  othersPct: number;
  yourVote: { slug: string; name: string; inTop: boolean } | null;
  votingOpen: boolean;
}
