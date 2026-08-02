import { tournaments, type ExhibitionMatch } from "./tournaments";

/**
 * TOP の NEXT MATCH ブロックの表示状態。
 *
 * - `scheduled` : 次戦の日時が確定している。カウントダウン＋試合カードを表示
 * - `tba`       : 次大会は見込まれるが日程・開催地が未発表。カウントダウンは出さず待機表示
 * - `none`      : 次の予定なし。ブロックごと非表示
 *
 * 日程が発表されたら `state` を `scheduled` に変え、`matches` を埋めるだけで
 * カウントダウンが復活する。**未確定の日付を仮に入れてカウントダウンを動かさないこと。**
 */
export type NextMatchState = "scheduled" | "tba" | "none";

export interface NextMatchTbaInfo {
  label: string;
  title: string;
  subtitle: string;
  /** 「開催地・日程 未発表」など、確定していないことを明示する一言 */
  status: string;
  /** 過去の実績にもとづく補足。予想ではなく実績として書くこと */
  note: string;
  /** 誤解を避けるための注意書き */
  caution: string;
}

/** 直前に戦い終えた大会のサマリー（tba 状態でカウントダウンの代わりに主役となる） */
export interface LastTournamentSummary {
  /** 例：「KWCC2026 ITALY」 */
  label: string;
  /** 例：「4戦4勝」 */
  record: string;
  /** 各試合のスコア。例：["9-2", "7-0", "8-1", "6-2"] */
  scores: string[];
  href: string;
}

export interface NextMatchConfig {
  state: NextMatchState;
  /** state === "scheduled" のときだけ使う。カウントダウンの対象 */
  matches: ExhibitionMatch[];
  /** 見出しに使う大会名・開催地（state === "scheduled" のとき表示） */
  scheduled?: {
    name: string;
    location: string;
    dateLabel: string;
    detailUrl: string;
  };
  /** state === "tba" のときに表示する内容 */
  tba: NextMatchTbaInfo;
  /** 直前大会の結果サマリー */
  lastTournament: LastTournamentSummary;
}

const CLUBS_2026 = tournaments.find((t) => t.slug === "clubs2026");

export const nextMatch: NextMatchConfig = {
  // KWCC2026 のエキシビション全4戦が終了。次のネーションズは開催・日程とも未発表。
  state: "tba",

  matches: [],

  tba: {
    label: "NEXT TOURNAMENT",
    title: "キングス・ワールドカップ・ネイションズ",
    subtitle: "国別対抗戦",
    status: "開催地・日程 未発表",
    note: "過去2大会はいずれも年始に開催されました。次回大会の開催・日程・出場国は、いずれも未発表です。",
    caution:
      "日本の参戦は決定していません。発表があり次第、このページを更新します。",
  },

  lastTournament: {
    label: "KWCC2026 ITALY",
    record: "4戦4勝",
    scores: (CLUBS_2026?.exhibitionMatches ?? [])
      .map((m) => m.result?.score)
      .filter((s): s is string => !!s),
    href: `/tournaments/${CLUBS_2026?.urlSlug ?? "kings-world-cup-clubs-2026"}`,
  },
};
