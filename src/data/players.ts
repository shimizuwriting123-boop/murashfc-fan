export type Position = "GK" | "DF" | "MF" | "FW";
export type PlayerStatus = "confirmed" | "pending" | "past";
export type TournamentSlug = "mexico" | "italy" | "france" | "brazil";

export interface Player {
  slug: string;
  name: string;
  nameEn: string;
  position: Position;
  /** 過去メンバーは背番号なし */
  number?: number;
  status: PlayerStatus;
  /** 出場した大会の slug 配列 */
  tournaments?: TournamentSlug[];
  nickname?: string;
  birthdate?: string;
  height?: string;
  weight?: string;
  hometown?: string;
  career?: string[];
  feature?: string;
}

export const players: Player[] = [
  // ============================================================
  // 現メンバー（背番号1〜16）
  // ============================================================
  {
    slug: "kodama",
    name: "児玉剛",
    nameEn: "KODAMA",
    position: "FW",
    number: 1,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "miyauchi",
    name: "宮内俊輔",
    nameEn: "MIYAUCHI",
    position: "DF",
    number: 2,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "kido",
    name: "木戸皓貴",
    nameEn: "KIDO",
    position: "DF",
    number: 3,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "hako",
    name: "箱崎裕也",
    nameEn: "HAKO",
    position: "DF",
    number: 4,
    status: "pending",
    tournaments: ["brazil"],
  },
  {
    slug: "nakamura",
    name: "中村駿介",
    nameEn: "NAKAMURA",
    position: "MF",
    number: 5,
    status: "pending",
    tournaments: ["italy", "france", "brazil"],
  },
  {
    slug: "agata",
    name: "縣翔平",
    nameEn: "AGATA",
    position: "DF",
    number: 6,
    status: "confirmed",
    tournaments: ["italy", "france", "brazil"],
    nickname: "あがちゃん・あがた",
    birthdate: "1994年5月25日",
    height: "184cm",
    weight: "78kg",
    career: [
      "青森山田高校（国体選抜）",
      "中央大学（関東選抜）",
      "プラムワン（ソサイチ日本代表）",
      "キングスリーグ（イタリア大会・フランス大会）",
    ],
    feature:
      "背負った相手に対しての守備の強度が高い。落ち着いてボールを持てる、パスもできる。前もできる。",
  },
  {
    slug: "yokoyama",
    name: "横山航河",
    nameEn: "YOKOYAMA",
    position: "DF",
    number: 7,
    status: "confirmed",
    tournaments: ["brazil"],
    nickname: "コウガ",
    birthdate: "1996年5月26日",
    height: "174cm",
    weight: "72kg",
    career: [
      "サンフレッチェ広島ユース",
      "近畿大学",
      "FC LAZO",
      "VOLVER OSAKA（2025ソサイチブラジルW杯メンバー）",
      "MIKIHOUSE FC（フットサル）",
    ],
    feature:
      "守備の強度が高く何度も球に行ける、戦える。自身で運ぶドリブルもそつなくできる。キック精度もある。",
  },
  {
    slug: "umezu",
    name: "梅津怜央",
    nameEn: "UMEZU",
    position: "MF",
    number: 8,
    status: "pending",
    tournaments: ["brazil"],
  },
  {
    slug: "oda",
    name: "小田崚平",
    nameEn: "ODA",
    position: "MF",
    number: 9,
    status: "pending",
    tournaments: ["mexico", "italy", "france"],
  },
  {
    slug: "egawa",
    name: "江川雅信",
    nameEn: "EGAWA",
    position: "FW",
    number: 10,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "miyashita",
    name: "宮下豪也",
    nameEn: "MIYASHITA",
    position: "FW",
    number: 11,
    status: "confirmed",
    tournaments: ["italy", "france", "brazil"],
    birthdate: "2003年2月22日",
    height: "188cm",
    weight: "76kg",
    hometown: "長野県松本市",
    career: [
      "日本ウェルネス長野高校",
      "フウガドールすみだバッファローズ",
      "フウガドールすみだ",
      "バサジィ大分",
      "FC.vinculo futsal",
    ],
    feature:
      "2022年U-20日本代表（フットサル）。ピヴォ／アラのフットサル選手。サッカーからフットサルに転向し、現在のキャプテン候補。",
  },
  {
    slug: "hayashida",
    name: "林田大和",
    nameEn: "HAYASHIDA",
    position: "FW",
    number: 12,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "shiraishi",
    name: "白石郁哉",
    nameEn: "SHIRAISHI",
    position: "FW",
    number: 13,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "shigenobu",
    name: "重信圭佑",
    nameEn: "SHIGENOBU",
    position: "MF",
    number: 14,
    status: "pending",
    tournaments: ["brazil"],
  },
  {
    slug: "tanida",
    name: "谷田光",
    nameEn: "TANIDA",
    position: "MF",
    number: 15,
    status: "pending",
    tournaments: [],
  },
  {
    slug: "fukaya",
    name: "深谷圭佑",
    nameEn: "FUKAYA",
    position: "GK",
    number: 16,
    status: "confirmed",
    tournaments: ["mexico", "italy", "france", "brazil"],
    nickname: "けーすけ",
    birthdate: "1998年6月20日",
    height: "184cm",
    hometown: "愛知県",
    career: [
      "帝京長岡高校(全国高校選手権優秀選手)",
      "立正大学",
      "品川CC",
      "WINNER'S",
      "サガン鳥栖（元Jリーガー）",
      "SC豊橋アゼリア",
    ],
    feature:
      "「日本の壁」と称される絶対的GK。第1回メキシコ大会MVP受賞。第2回イタリア大会では日本代表キャプテン。",
  },

  // ============================================================
  // 歴代メンバー（背番号なし / status: past）
  // ----- メキシコ大会出場者 -----
  // ============================================================
  {
    slug: "nasu",
    name: "那須大亮",
    nameEn: "NASU",
    position: "MF",
    status: "past",
    tournaments: ["mexico"],
    nickname: "監督役",
    career: ["元Jリーガー（横浜FM・浦和レッズ）", "元U-23日本代表DF"],
  },
  {
    slug: "kanetake",
    name: "金武航二朗",
    nameEn: "KANETAKE",
    position: "DF",
    status: "past",
    tournaments: ["mexico", "italy"],
    nickname: "こじろう／こーじろう",
    feature:
      "メキシコ大会のヘイトタンク。USスチール戦で神シュートを決めて会場を沸かせた。",
  },
  {
    slug: "nuno",
    name: "布尾航誠",
    nameEn: "NUNO",
    position: "DF",
    status: "past",
    tournaments: ["mexico"],
  },
  {
    slug: "kiyokawa",
    name: "清川大輝",
    nameEn: "KIYOKAWA",
    position: "MF",
    status: "past",
    tournaments: ["mexico"],
  },
  {
    slug: "enjo",
    name: "圓乘健介",
    nameEn: "ENJO",
    position: "MF",
    status: "past",
    tournaments: ["mexico", "italy", "france"],
    nickname: "エンケン",
    career: [
      "野洲高校",
      "大阪経済大学",
      "WINNER'S",
      "プラムワン（ソサイチ日本代表）",
    ],
  },
  {
    slug: "waragai",
    name: "藁谷尚紀",
    nameEn: "WARAGAI",
    position: "MF",
    status: "past",
    tournaments: ["mexico"],
  },
  {
    slug: "kobayashi",
    name: "小林謙太",
    nameEn: "KOBAYASHI",
    position: "FW",
    status: "past",
    tournaments: ["mexico"],
  },
  {
    slug: "hirai",
    name: "平井達也",
    nameEn: "HIRAI",
    position: "FW",
    status: "past",
    tournaments: ["mexico"],
  },
  {
    slug: "morihasu",
    name: "森保翔平",
    nameEn: "MORIYASU",
    position: "DF",
    status: "past",
    tournaments: ["mexico", "italy", "france"],
    feature:
      "サンフレッチェ広島ユース・元カマタマーレ讃岐。フランス大会でキャプテンに就任。日本代表森保一監督の長男。",
  },
  {
    slug: "yamada",
    name: "山田樹",
    nameEn: "YAMADA",
    position: "DF",
    status: "past",
    tournaments: ["mexico", "italy"],
    nickname: "いつき",
    feature:
      "元ソサイチ日本代表、プラムワン所属、元ブラウブリッツ秋田。フランス大会ではコーチに就任。",
  },
  {
    slug: "yuseiNarita",
    name: "成田雄聖",
    nameEn: "NARITA",
    position: "GK",
    status: "past",
    tournaments: ["mexico", "italy"],
    nickname: "ゆーせい",
  },

  // ----- イタリア大会出場者 -----
  {
    slug: "umetani",
    name: "梅谷堅人",
    nameEn: "UMETANI",
    position: "DF",
    status: "past",
    tournaments: ["italy"],
    nickname: "梅ちゃん",
    feature: "元ソサイチ日本代表、プラムワン発起人。",
  },
  {
    slug: "kishimoto",
    name: "岸本青空",
    nameEn: "KISHIMOTO",
    position: "MF",
    status: "past",
    tournaments: ["italy"],
    nickname: "あおぞら",
    feature:
      "スペインキングスリーガー（Rayo de Barcelona所属）。青髪がトレードマーク。",
  },
  {
    slug: "fukuhara",
    name: "福原涼太",
    nameEn: "FUKUHARA",
    position: "FW",
    status: "past",
    tournaments: ["italy"],
  },
  {
    slug: "nakagawa",
    name: "中川貴晴",
    nameEn: "NAKAGAWA",
    position: "FW",
    status: "past",
    tournaments: ["italy"],
    nickname: "たか",
    feature: "元ソサイチ日本代表、LFYR SC。",
  },

  // ----- フランス大会出場者 -----
  {
    slug: "rikiyaNarita",
    name: "成田力哉",
    nameEn: "NARITA",
    position: "GK",
    status: "past",
    tournaments: ["france", "brazil"],
    nickname: "リッキー",
    feature:
      "ブラジル大会の3連敗が決まった瞬間「次なんてねえんだよ！」と号泣しながら激怒した熱血漢。",
  },
  {
    slug: "masuda",
    name: "増田丈偉",
    nameEn: "MASUDA",
    position: "DF",
    status: "past",
    tournaments: ["france"],
    feature: "メキシコ大会ではコーチとして帯同。",
  },
  {
    slug: "tamura",
    name: "田村佳翔",
    nameEn: "TAMURA",
    position: "MF",
    status: "past",
    tournaments: ["france"],
  },
  {
    slug: "sugimoto",
    name: "杉本竜士",
    nameEn: "SUGIMOTO",
    position: "MF",
    status: "past",
    tournaments: ["france"],
    feature:
      "元Jリーガー（東京ヴェルディ・FC町田ゼルビア・名古屋グランパス・徳島ヴォルティス・横浜FM・横浜FC・ザスパ群馬）。宮島事件の主人公。",
  },
  {
    slug: "hamamoto",
    name: "濱本和希",
    nameEn: "HAMAMOTO",
    position: "FW",
    status: "past",
    tournaments: ["france", "brazil"],
  },
  {
    slug: "ujihashi",
    name: "氏橋寛",
    nameEn: "UJIHASHI",
    position: "FW",
    status: "past",
    tournaments: ["france"],
    feature: "フランス大会で柿谷の代替として、トライアウト参加者から選出。",
  },
  {
    slug: "kakitani",
    name: "柿谷曜一朗",
    nameEn: "KAKITANI",
    position: "FW",
    status: "past",
    tournaments: ["france"],
    feature:
      "元日本代表FW（2014年ワールドカップ出場）。セレッソ大阪・徳島ヴォルティス・名古屋グランパス。MURASH FCにフランス大会で参加予定だったが、アキレス腱痛再発でアドバイザーに変更、日本から帯同せずサポート。",
  },

  // ----- ブラジル大会出場者 -----
  {
    slug: "nozaki",
    name: "野崎雅也",
    nameEn: "NOZAKI",
    position: "DF",
    status: "past",
    tournaments: ["brazil"],
    feature:
      "浦和レッズユース、浦和レッズ、アビスパ福岡、ガイナーレ鳥取などJリーグ複数クラブを経験。",
  },
  {
    slug: "tanabe",
    name: "田邉隆平",
    nameEn: "TANABE",
    position: "MF",
    status: "past",
    tournaments: ["brazil"],
    nickname: "金ガム",
    feature:
      "ブラジルで金髪に染め、国歌斉唱中にガムを噛んでいたことで「金ガム」と呼ばれた。その後キーマンに成長。",
  },
  {
    slug: "matsumori",
    name: "松森堅誠",
    nameEn: "MATSUMORI",
    position: "FW",
    status: "past",
    tournaments: ["brazil"],
  },
  {
    slug: "pablo",
    name: "三浦パブロ",
    nameEn: "MIURA",
    position: "FW",
    status: "past",
    tournaments: ["brazil"],
  },
];

export function getPlayerBySlug(slug: string): Player | undefined {
  return players.find((p) => p.slug === slug);
}

// ============================================================
// 大会の表示用ラベル
// ============================================================
export const TOURNAMENTS: Record<
  TournamentSlug,
  { no: string; short: string; label: string }
> = {
  mexico: { no: "第1回", short: "メキシコ", label: "第1回 メキシコ大会" },
  italy: { no: "第2回", short: "イタリア", label: "第2回 イタリア大会" },
  france: { no: "第3回", short: "フランス", label: "第3回 フランス大会" },
  brazil: { no: "第4回", short: "ブラジル", label: "第4回 ブラジル大会" },
};
