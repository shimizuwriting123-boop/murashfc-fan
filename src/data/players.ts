export type Position = "GK" | "DF" | "MF" | "FW";
export type PlayerStatus = "confirmed" | "pending" | "past" | "staff";
export type TournamentSlug = "mexico" | "italy" | "france" | "brazil";
export type DominantFoot = "right" | "left" | "both";

/** 大会フェーズ。4大会 + 再スタート編（新体制）。 */
export type ParticipationPhase = TournamentSlug | "rebirth";

/** 大会ごとの参加形態。 */
export type PlayerRole =
  | "player"
  | "manager"
  | "coach"
  | "trainer"
  | "advisor"
  | "staff"
  | "president";

export interface TournamentParticipation {
  /** 4大会 + 新体制（rebirth）のいずれか */
  tournament: ParticipationPhase;
  role: PlayerRole;
  /** 補助情報。例：「1st Coach」「GK Coach」「強化責任者」「ダブルオーナー」「レベナンツ監督」「選手復帰（背番号未定）」など */
  subRole?: string;
  /** 背番号（選手のみ） */
  jerseyNumber?: number;
  /** ポジション（選手のみ。大会ごとに変わる場合があるためここに保持） */
  position?: Position;
}

export interface Player {
  slug: string;
  name: string;
  nameEn: string;
  /** ふりがな（あれば） */
  nameKana?: string;
  position: Position;
  /** 過去メンバーは背番号なし */
  number?: number;
  status: PlayerStatus;
  /**
   * 出場した大会の slug 配列（後方互換のため維持）。
   * 詳細表示は tournamentHistory を優先するが、フィルター・既存リストは tournaments を使う。
   */
  tournaments?: TournamentSlug[];
  /** 大会ごとの詳細な参加履歴（役割・背番号・ポジション変動） */
  tournamentHistory?: TournamentParticipation[];
  nickname?: string;
  birthdate?: string;
  height?: string;
  weight?: string;
  hometown?: string;
  /** 利き足 */
  dominantFoot?: DominantFoot;
  career?: string[];
  feature?: string;
  /** 柿谷曜一朗（ダブルオーナー）からの選手評コメント */
  kakitaniComment?: string;
  /** 本人からのメッセージ */
  playerMessage?: string;
  instagramUrl?: string;
  xUrl?: string;
  /** スタッフ用の現在の役職（監督 / コーチ / マネージャー など）。staff バッジに表示される */
  role?: string;
  /**
   * 公式サイトではなく、本人公開情報・各クラブ公式発表・Wikipedia 等から
   * リサーチして集めたプロフィール。詳細ページのフッター注記の出し分けに使う。
   */
  researchedProfile?: boolean;
}

/** PlayerRole → 表示用ラベル */
export const ROLE_LABEL: Record<PlayerRole, string> = {
  player: "選手",
  manager: "監督",
  coach: "コーチ",
  trainer: "トレーナー",
  advisor: "アドバイザー",
  staff: "スタッフ",
  president: "プレジデント",
};

/** ParticipationPhase → 短い表示ラベル */
export const PHASE_SHORT_LABEL: Record<ParticipationPhase, string> = {
  mexico: "メキシコ",
  italy: "イタリア",
  france: "フランス",
  brazil: "ブラジル",
  rebirth: "新体制",
};

/** ParticipationPhase → フル表示ラベル */
export const PHASE_FULL_LABEL: Record<ParticipationPhase, string> = {
  mexico: "第1回 メキシコ大会（2024年5〜6月）",
  italy: "第2回 イタリア大会（2025年1月）",
  france: "第3回 フランス大会（2025年6月）",
  brazil: "第4回 ブラジル大会（2026年1月）",
  rebirth: "再スタート編・新体制（2026年〜）",
};

export const players: Player[] = [
  // ============================================================
  // 現メンバー（背番号1〜16）
  // ============================================================
  {
    slug: "kodama",
    name: "児玉剛",
    nameEn: "KODAMA",
    position: "GK",
    number: 1,
    status: "confirmed",
    tournaments: [],
    nickname: "つよし",
    birthdate: "1987年12月28日",
    hometown: "大阪府吹田市",
    career: [
      "ガンバ大阪下部組織",
      "吹田クラブ",
      "京都パープルサンガユース（2種登録）",
      "関西大学（関西選抜・2009デンソーカップ優勝主将）",
      "京都サンガF.C.（2010〜2013）",
      "愛媛FC（2014〜2016）",
      "モンテディオ山形（2017〜2018）",
      "FC東京（2019〜2024）",
      "名古屋グランパス（2025〜）",
    ],
    feature:
      "Jリーグ通算200試合以上出場のベテラン守護神。FC東京で5年間正GKを務めた。足元・1対1の強さ・コーチングが武器で、YouTubeチャンネル登録者は2万人超。GKスクール「Kodama Academy」代表も務める実業家・教育者でもある。",
  },
  {
    slug: "miyauchi",
    name: "宮内俊輔",
    nameEn: "MIYAUCHI",
    position: "MF",
    number: 2,
    status: "confirmed",
    tournaments: [],
    birthdate: "2003年7月14日",
    height: "172cm",
    weight: "60kg",
    career: ["フォルトゥナU-15", "帝京大可児高校"],
    feature:
      "2003年生まれの若手MF。フォルトゥナU-15から帝京大可児高校でプレー。",
    researchedProfile: true,
  },
  {
    slug: "kido",
    name: "木戸皓貴",
    nameEn: "KIDO",
    position: "FW",
    number: 3,
    status: "confirmed",
    tournaments: [],
    birthdate: "1995年6月28日",
    height: "176cm",
    weight: "75kg",
    hometown: "熊本県益城町",
    dominantFoot: "right",
    career: [
      "熊本ユナイテッドSC",
      "東福岡高校",
      "明治大学",
      "アビスパ福岡（2018-2020）",
      "モンテディオ山形（2021-2022）",
      "ラインメール青森FC（2023）",
      "ヴィアティン三重（2024）",
    ],
    feature:
      "J2リーグ通算105試合6得点を記録した元プロサッカー選手。東福岡高校時代には全国高校サッカー選手権大会の優秀選手に選出。明治大学時代にはユニバーシアード日本代表にも選出された実力派FW。",
    researchedProfile: true,
  },
  {
    slug: "hako",
    name: "箱﨑裕也",
    nameEn: "HAKO",
    position: "MF",
    number: 4,
    status: "confirmed",
    tournaments: ["brazil"],
    nickname: "はこ",
    birthdate: "1994年9月16日",
    height: "172cm",
    weight: "66kg",
    career: [
      "香川西高校（国体）",
      "大阪学院大学（関西選抜）",
      "ルート11",
      "RAPAZ FUTSAL CLUB",
      "VOLVER OSAKA",
      "ソサイチ日本代表（2024アジアカップ、2025ブラジルW杯）",
    ],
    kakitaniComment:
      "パスを出すタイミング、出すところのセンスがある。全てにおいて能力が高い。",
    playerMessage:
      "箱﨑裕也です！新たに発足するチームで皆さんとコミュニケーションをいっぱい取っていきたいと思っています。今まで築き上げてこられたムラッシュFCの歴史をより良くできるように、世界一だけを目指して魂で闘います。よろしくお願いします。",
    instagramUrl: "https://instagram.com/yuya.hakozaki",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "MF", jerseyNumber: 8 },
    ],
  },
  {
    slug: "nakamura",
    name: "中村駿介",
    nameEn: "NAKAMURA",
    position: "MF",
    number: 5,
    status: "confirmed",
    tournaments: ["italy", "france", "brazil"],
    nickname: "なかしゅん",
    tournamentHistory: [
      { tournament: "italy", role: "player", position: "MF", jerseyNumber: 74 },
      { tournament: "france", role: "player", position: "MF", jerseyNumber: 14 },
      { tournament: "brazil", role: "manager", subRole: "監督" },
      { tournament: "rebirth", role: "player", subRole: "選手復帰（背番号未定）" },
    ],
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
    kakitaniComment:
      "背負った相手に対しての守備の強度が高い。落ち着いてボールを持てる、パスもできる。前もできる。",
    playerMessage: "勝とう",
    instagramUrl: "https://instagram.com/shohei_agata",
    tournamentHistory: [
      { tournament: "italy", role: "player", position: "MF", jerseyNumber: 7 },
      { tournament: "france", role: "player", position: "FW", jerseyNumber: 5 },
      { tournament: "brazil", role: "player", position: "DF", jerseyNumber: 6 },
    ],
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
      "サンフレッチェ広島ユース（Jリーグ選抜）",
      "近畿大学（新人賞、DENSO関西選抜）",
      "FC LAZO（大阪府プラチナリーグ）",
      "VOLVER OSAKA（ソサイチ関西1部、2025ソサイチブラジルW杯メンバー）",
      "MIKIHOUSE FC（フットサル）",
    ],
    feature:
      "守備の強度が高く何度も球に行ける、戦える。自身で運ぶドリブルもそつなくできる。キック精度もある。",
    kakitaniComment:
      "守備の強度が高く何度も球に行ける、戦える。自身で運ぶドリブルもそつなくできる。キック精度もある。",
    playerMessage:
      "初めまして、コウガです。見た目はちょっとあれですがめちゃめちゃ気さくなんで仲良くして下さい。皆さんと世界一獲れる様にチームの為にガンガン走って闘うんでよろしくお願いします",
    instagramUrl: "https://instagram.com/kouga_960526",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "DF", jerseyNumber: 7 },
    ],
  },
  {
    slug: "umezu",
    name: "梅津怜央",
    nameEn: "UMEZU",
    position: "FW",
    number: 8,
    status: "confirmed",
    tournaments: ["brazil"],
    nickname: "れお",
    birthdate: "1999年11月7日",
    height: "165cm",
    weight: "58kg",
    career: [
      "ベガルタ仙台ユースU-18（国体選抜）",
      "東北学院大学",
      "intel biloba tokyo",
      "東京蹴球団（東京都社会人サッカーリーグ1部）",
      "てくてくキッカーズ（ソサイチ関東リーグ1部）",
    ],
    kakitaniComment:
      "1vs1で何度も相手を剥がしているシーンが見られた。取られない持ち方もできる。左利きも特徴。",
    playerMessage:
      "はじめまして！梅津怜央です。へいへい、漢の分も魂燃やして必死こいて頑張ります。よろしくお願いします！",
    instagramUrl: "https://instagram.com/reeo1107",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "FW", jerseyNumber: 14 },
    ],
  },
  {
    slug: "oda",
    name: "小田崚平",
    nameEn: "ODA",
    position: "MF",
    number: 9,
    status: "confirmed",
    tournaments: ["mexico", "italy", "france"],
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "MF", jerseyNumber: 8 },
      { tournament: "italy", role: "player", position: "MF", jerseyNumber: 8 },
      { tournament: "france", role: "player", position: "DF", jerseyNumber: 6 },
    ],
  },
  {
    slug: "egawa",
    name: "江川雅信",
    nameEn: "EGAWA",
    position: "FW",
    number: 10,
    status: "confirmed",
    tournaments: [],
    birthdate: "1996年8月29日",
    height: "172cm",
    weight: "68kg",
    hometown: "神奈川県",
    dominantFoot: "left",
    career: [
      "FCトッカーノ",
      "湘南ベルマーレ小田原",
      "桐蔭学園高等学校",
      "FKスティエスカ・ニクシッチ（モンテネグロ1部 / 2016年7月〜）",
      "IFKヴェルナモ（スウェーデン）",
      "エリース東京",
      "厚木はやぶさFC",
    ],
    feature:
      "モンテネグロ・スウェーデンと欧州キャリアを持つ左利きアタッカー。モンテネグロ・プルヴァで6試合出場、スウェーデン・スーペルエッタンで6試合出場1得点の記録を残している。",
    researchedProfile: true,
  },
  {
    slug: "miyashita",
    name: "宮下豪也",
    nameEn: "MIYASHITA",
    position: "MF",
    number: 11,
    status: "confirmed",
    tournaments: ["italy", "france", "brazil"],
    nickname: "としや",
    birthdate: "2003年2月22日",
    height: "188cm",
    weight: "78kg",
    hometown: "長野県松本市",
    career: [
      "日本ウェルネス長野高校",
      "フウガドールすみだバッファローズ（2020年）",
      "フウガドールすみだU20（2021年）",
      "フットサル日本代表",
      "バサジィ大分（2022年）",
      "fc vinculo（フットサル）",
      "N（ソサイチ）",
    ],
    feature:
      "2022年U-20日本代表（フットサル）。ピヴォ／アラのフットサル選手。サッカーからフットサルに転向し、現在のキャプテン候補。",
    kakitaniComment:
      "ドリブルの1vs1の能力はダントツで1番。世界を相手にも通用する1vs1の強さがある。後ろからのビルドアップもできるし1番前で背負ったプレーもできる。",
    playerMessage:
      "MURASHファミリー全員でキングスリーグを盛り上げていきましょう！僕も世界一を掴むために全力でチームに貢献します！よろしくお願いします！",
    instagramUrl: "https://instagram.com/toshiya2003",
    xUrl: "https://x.com/tosiya58",
    tournamentHistory: [
      { tournament: "france", role: "player", position: "FW", jerseyNumber: 12 },
      { tournament: "brazil", role: "player", position: "MF", jerseyNumber: 10 },
    ],
  },
  {
    slug: "hayashida",
    name: "林田大和",
    nameEn: "HAYASHIDA",
    position: "FW",
    number: 12,
    status: "confirmed",
    tournaments: [],
    feature: "現時点で公開されている情報が少ない選手。今後の活躍に期待。",
  },
  {
    slug: "shiraishi",
    name: "白石郁哉",
    nameEn: "SHIRAISHI",
    position: "MF",
    number: 13,
    status: "confirmed",
    tournaments: [],
    birthdate: "2001年8月30日",
    height: "174cm",
    weight: "63kg",
    career: [
      "FC東京U-15むさし",
      "前橋育英高校",
      "フロリダ国際大学",
      "ミズーリ州立大学（NCAA D1）",
    ],
    feature:
      "アメリカNCAA D1屈指の強豪・ミズーリ州立大学でプレー中の現役大学生プレーヤー。シーズン開幕戦で4ゴールを記録し、MVCカンファレンス週間最優秀選手・週間ベストイレブンに選出されたチーム攻撃の核。卒業後のプロ入りを目指している。",
    researchedProfile: true,
  },
  {
    slug: "shigenobu",
    name: "重信圭佑",
    nameEn: "SHIGENOBU",
    position: "MF",
    number: 14,
    status: "confirmed",
    tournaments: ["brazil"],
    nickname: "シゲ",
    career: ["浦和西高校"],
    kakitaniComment:
      "なかしゅんが連れてきた、無名枠。左足のシュートが武器で、シュートレンジ（シュートが決めれる範囲）が広い。",
    instagramUrl: "https://instagram.com/keisukeshige0901",
    xUrl: "https://x.com/Shigesuke0901",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "MF", jerseyNumber: 74 },
    ],
  },
  {
    slug: "tanida",
    name: "谷田光",
    nameEn: "TANIDA",
    position: "MF",
    number: 15,
    status: "confirmed",
    tournaments: [],
    birthdate: "1997年4月17日",
    height: "168cm",
    weight: "60kg",
    career: [
      "聖和学園高校",
      "新潟医療福祉大学",
      "Musan Salama（フィンランド・プロ）",
      "FCカラスト埼玉南西（社会人・背番号10）",
    ],
    feature:
      "フィンランドのプロチーム「Musan Salama」でプレーした経験を持つ攻撃的MF。前十字靭帯断裂を機にプロサッカーから一度離れ、IT企業「株式会社ソシアス」にエンジニアとして就職。現在はエンジニアとして働きながら、社会人チーム「FCカラスト埼玉南西」で背番号10を背負いプレーするユニークなキャリアの持ち主。",
    researchedProfile: true,
  },
  {
    slug: "fukaya",
    name: "深谷圭佑",
    nameEn: "FUKAYA",
    position: "GK",
    number: 16,
    status: "confirmed",
    tournaments: ["mexico", "italy", "france"],
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
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "GK", jerseyNumber: 1 },
      { tournament: "italy", role: "player", position: "GK", jerseyNumber: 1 },
      { tournament: "france", role: "player", position: "GK", jerseyNumber: 1 },
    ],
  },

  // ============================================================
  // 歴代メンバー（背番号なし / status: past）
  // ----- メキシコ大会出場者 -----
  // ============================================================
  {
    slug: "nasu",
    name: "那須大亮",
    nameEn: "NASU",
    nameKana: "なすだいすけ",
    position: "DF",
    status: "past",
    tournaments: ["mexico"],
    nickname: "監督役",
    career: ["元Jリーガー（横浜FM・浦和レッズ）", "元U-23日本代表DF"],
    feature: "元日本代表DF。複数のJリーグクラブで活躍したベテラン。",
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "DF", jerseyNumber: 4 },
    ],
  },
  {
    slug: "kanetake",
    name: "金武航二朗",
    nameEn: "KANETAKE",
    position: "DF",
    status: "past",
    tournaments: ["mexico", "italy", "france"],
    nickname: "こじろう／こーじろう",
    feature:
      "メキシコ大会のヘイトタンク。USスチール戦で神シュートを決めて会場を沸かせた。フランス大会ではチームスタッフとして帯同。",
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "DF", jerseyNumber: 10 },
      { tournament: "italy", role: "player", position: "DF", jerseyNumber: 10 },
      { tournament: "france", role: "staff", subRole: "チームスタッフ" },
    ],
  },
  {
    slug: "nuno",
    name: "布尾航誠",
    nameEn: "NUNO",
    nameKana: "ぬのおこうせい",
    position: "DF",
    status: "past",
    tournaments: ["mexico"],
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "DF", jerseyNumber: 13 },
    ],
  },
  {
    slug: "kiyokawa",
    name: "清川大輝",
    nameEn: "KIYOKAWA",
    nameKana: "きよかわだいき",
    position: "MF",
    status: "past",
    tournaments: ["mexico"],
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "MF", jerseyNumber: 7 },
    ],
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
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "MF", jerseyNumber: 5 },
      { tournament: "italy", role: "player", position: "MF", jerseyNumber: 26 },
      { tournament: "france", role: "player", position: "FW", jerseyNumber: 7 },
    ],
  },
  {
    slug: "waragai",
    name: "藁谷尚紀",
    nameEn: "WARAGAI",
    nameKana: "わらがいなおき",
    position: "MF",
    status: "past",
    tournaments: ["mexico"],
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "MF", jerseyNumber: 11 },
    ],
  },
  {
    slug: "kobayashi",
    name: "小林謙太",
    nameEn: "KOBAYASHI",
    nameKana: "こばやしけんた",
    position: "FW",
    status: "past",
    tournaments: ["mexico"],
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "FW", jerseyNumber: 9 },
    ],
  },
  {
    slug: "hirai",
    name: "平井達也",
    nameEn: "HIRAI",
    nameKana: "ひらいたつや",
    position: "FW",
    status: "past",
    tournaments: ["mexico"],
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "FW", jerseyNumber: 16 },
    ],
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
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "MF", jerseyNumber: 17 },
      { tournament: "italy", role: "player", position: "MF", jerseyNumber: 17 },
      { tournament: "france", role: "player", position: "DF", jerseyNumber: 3 },
    ],
  },
  {
    slug: "yamada",
    name: "山田樹",
    nameEn: "YAMADA",
    nameKana: "やまだいつき",
    position: "DF",
    status: "past",
    tournaments: ["mexico", "italy", "france"],
    nickname: "いつき",
    feature:
      "元ソサイチ日本代表、プラムワン所属、元ブラウブリッツ秋田。フランス大会ではコーチに就任。",
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "DF", jerseyNumber: 14 },
      { tournament: "italy", role: "player", position: "DF", jerseyNumber: 14 },
      { tournament: "france", role: "coach", subRole: "コーチ" },
    ],
  },
  {
    slug: "yuseiNarita",
    name: "成田雄聖",
    nameEn: "NARITA",
    position: "GK",
    status: "past",
    tournaments: ["mexico", "italy", "brazil"],
    nickname: "ゆうせい、なり",
    birthdate: "1999年12月29日",
    height: "188cm",
    weight: "83kg",
    career: [
      "JACPA東京FC",
      "実践学園高校",
      "國學院大學蹴球部",
      "ラインメール青森FC",
      "FC刈谷",
      "品川CC",
    ],
    kakitaniComment: "左足のキック力、ビルドアップ能力",
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "GK", jerseyNumber: 29 },
      { tournament: "italy", role: "player", position: "GK", jerseyNumber: 22 },
      { tournament: "brazil", role: "player", position: "GK", jerseyNumber: 29 },
    ],
  },

  // ----- イタリア大会出場者 -----
  {
    slug: "umetani",
    name: "梅谷堅人",
    nameEn: "UMETANI",
    nameKana: "うめたにけんと",
    position: "DF",
    status: "past",
    tournaments: ["italy"],
    nickname: "梅ちゃん",
    feature: "元ソサイチ日本代表、プラムワン発起人。",
    tournamentHistory: [
      { tournament: "italy", role: "player", position: "DF", jerseyNumber: 2 },
    ],
  },
  {
    slug: "kishimoto",
    name: "岸本青空",
    nameEn: "KISHIMOTO",
    nameKana: "きしもとそら",
    position: "MF",
    status: "past",
    tournaments: ["italy"],
    nickname: "あおぞら",
    feature:
      "スペインキングスリーガー（Rayo de Barcelona所属）。青髪がトレードマーク。",
    tournamentHistory: [
      { tournament: "italy", role: "player", position: "MF", jerseyNumber: 18 },
    ],
  },
  {
    slug: "fukuhara",
    name: "福原涼太",
    nameEn: "FUKUHARA",
    nameKana: "ふくはらりょうた",
    position: "FW",
    status: "past",
    tournaments: ["italy"],
    tournamentHistory: [
      { tournament: "italy", role: "player", position: "FW", jerseyNumber: 9 },
    ],
  },
  {
    slug: "nakagawa",
    name: "中川貴晴",
    nameEn: "NAKAGAWA",
    nameKana: "なかがわたかはる",
    position: "FW",
    status: "past",
    tournaments: ["italy"],
    nickname: "たか",
    feature: "元ソサイチ日本代表、LFYR SC。",
    tournamentHistory: [
      { tournament: "italy", role: "player", position: "FW", jerseyNumber: 19 },
    ],
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
    birthdate: "1987年10月2日",
    height: "186cm",
    weight: "85kg",
    career: [
      "明秀学園日立高等学校",
      "亜細亜大学",
      "マルバFC（フットサル）",
      "LAZO YOKOHAMA（ソサイチ）",
      "ソサイチ日本代表（2017〜現在）",
    ],
    feature:
      "ブラジル大会の3連敗が決まった瞬間「次なんてねえんだよ！」と号泣しながら激怒した熱血漢。",
    kakitaniComment:
      "ソサイチ歴がとても長くあのコートの大きさでのやり方を知り尽くしている。落ち着いたプレーができ、ベテランとしてチームの雰囲気にも貢献できる。",
    playerMessage:
      "日本代表するチームとして誇りとプライドを胸に闘いたいと思います。宜しく御願いいたします。",
    instagramUrl: "https://instagram.com/rikiya_narita",
    tournamentHistory: [
      { tournament: "france", role: "player", position: "GK", jerseyNumber: 13 },
      { tournament: "brazil", role: "player", position: "GK", jerseyNumber: 1 },
    ],
  },
  {
    slug: "masuda",
    name: "増田丈偉",
    nameEn: "MASUDA",
    nameKana: "ますだじょうい",
    position: "DF",
    status: "past",
    tournaments: ["mexico", "france"],
    feature:
      "メキシコ大会では2ndコーチ、フランス大会では選手として出場というユニークな経歴。",
    tournamentHistory: [
      { tournament: "mexico", role: "coach", subRole: "2nd Coach" },
      { tournament: "france", role: "player", position: "DF", jerseyNumber: 2 },
    ],
  },
  {
    slug: "tamura",
    name: "田村佳翔",
    nameEn: "TAMURA",
    nameKana: "たむらけいしょう",
    position: "MF",
    status: "past",
    tournaments: ["france"],
    tournamentHistory: [
      { tournament: "france", role: "player", position: "MF", jerseyNumber: 4 },
    ],
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
    tournamentHistory: [
      { tournament: "france", role: "player", position: "MF", jerseyNumber: 11 },
    ],
  },
  {
    slug: "hamamoto",
    name: "濱本和希",
    nameEn: "HAMAMOTO",
    position: "MF",
    status: "past",
    tournaments: ["france", "brazil"],
    nickname: "ハマ",
    birthdate: "1998年5月30日",
    height: "184cm",
    weight: "80kg",
    career: [
      "京都橘高校",
      "京都橘大学",
      "リンドバロッサ京都（フットサル）",
      "ヴィアベンテン滋賀（サッカー）",
      "VOLVER大阪（ソサイチ）",
      "日本代表（2025ブラジルW杯）",
      "キングスリーグ 2025フランスW杯メンバー",
    ],
    kakitaniComment:
      "相手を背負った時のボールを収める能力が高く、そこからの足裏を使ったパス、ドリブルもできる。",
    playerMessage:
      "よろしくお願いします！キングスを盛り上げていろんな人にもっと知ってもらいたいです。勝ちましょう！！",
    instagramUrl: "https://instagram.com/ka5zu3ki0",
    xUrl: "https://x.com/ka5zu3ki0",
    tournamentHistory: [
      { tournament: "france", role: "player", position: "FW", jerseyNumber: 9 },
      { tournament: "brazil", role: "player", position: "MF", jerseyNumber: 9 },
    ],
  },
  {
    slug: "ujihashi",
    name: "氏橋寛",
    nameEn: "UJIHASHI",
    nameKana: "うじはしひろし",
    position: "FW",
    status: "past",
    tournaments: ["france"],
    feature: "フランス大会で柿谷の代替として、トライアウト参加者から選出。",
    tournamentHistory: [
      { tournament: "france", role: "player", position: "FW", jerseyNumber: 15 },
    ],
  },
  {
    slug: "kakitani",
    name: "柿谷曜一朗",
    nameEn: "KAKITANI",
    position: "FW",
    status: "staff",
    tournaments: ["france", "brazil"],
    role: "ダブルオーナー",
    feature:
      "元日本代表FW（2014年ワールドカップ出場）。セレッソ大阪・徳島ヴォルティス・名古屋グランパス。MURASH FCにフランス大会で参加予定だったが、アキレス腱痛再発でアドバイザーに変更、日本から帯同せずサポート。再スタート編からはダブルオーナーに昇格し、加藤純一と並んでチームを率いる。",
    tournamentHistory: [
      {
        tournament: "france",
        role: "player",
        position: "FW",
        jerseyNumber: 8,
        subRole: "途中でアドバイザーに転身",
      },
      { tournament: "brazil", role: "advisor", subRole: "強化責任者" },
      { tournament: "rebirth", role: "president", subRole: "ダブルオーナー" },
    ],
  },

  // ----- ブラジル大会出場者 -----
  {
    slug: "nozaki",
    name: "野崎雅也",
    nameEn: "NOZAKI",
    position: "DF",
    status: "staff",
    tournaments: ["brazil"],
    role: "マネージャー",
    nickname: "ノザキ",
    career: [
      "浦和レッズユース",
      "浦和レッズ",
      "アビスパ福岡",
      "ガイナーレ鳥取",
      "スペインのチーム",
    ],
    feature:
      "浦和レッズユース、浦和レッズ、アビスパ福岡、ガイナーレ鳥取などJリーグ複数クラブを経験。第4回ブラジル大会では選手として出場し、再スタート編からはマネージャーに転身。",
    kakitaniComment:
      "Jの複数クラブとスペインのチームを経験した、プロを知るベテラン。浦和レッズユースではなかしゅんの1つ上の先輩。",
    instagramUrl: "https://instagram.com/nooooooza24",
    xUrl: "https://x.com/pepyan23",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "DF", jerseyNumber: 83 },
      { tournament: "rebirth", role: "manager", subRole: "マネージャー" },
    ],
  },
  {
    slug: "tanabe",
    name: "田邉隆平",
    nameEn: "TANABE",
    position: "FW",
    status: "past",
    tournaments: ["brazil"],
    nickname: "たなべ・りゅうへい（通称：金ガム）",
    birthdate: "1999年10月30日",
    height: "165cm",
    weight: "65kg",
    career: [
      "中京大中京高校",
      "中京大学",
      "東京23FC",
      "TOKYO2020FC",
      "FC.DIORIA",
    ],
    feature:
      "ブラジルで金髪に染め、国歌斉唱中にガムを噛んでいたことで「金ガム」と呼ばれた。その後キーマンに成長。",
    kakitaniComment:
      "中盤でのターンなど細かい動きができる。また出した後の動きなど連動して動く事ができる。",
    playerMessage:
      "こんにちは！田邉隆平です！！！チームの勝利のために全力で戦います！！！！よろしくお願いします！！！！！！！！！！",
    instagramUrl: "https://instagram.com/tanachan.gram_1030",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "FW", jerseyNumber: 13 },
    ],
  },
  {
    slug: "matsumori",
    name: "松森堅誠",
    nameEn: "MATSUMORI",
    position: "FW",
    status: "past",
    tournaments: ["brazil"],
    nickname: "ケンセイ",
    career: ["産業能率大学（関東2部リーグ）", "U-20関東大学選抜"],
    kakitaniComment:
      "得点能力に長け、強さと賢さを備え、両足も蹴れる。大学生ならではのアグレッシブさもある。チーム内得点王で10番を背負う。",
    instagramUrl: "https://instagram.com/kensei_matsumori",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "FW", jerseyNumber: 46 },
    ],
  },
  {
    slug: "pablo",
    name: "三浦パブロ",
    nameEn: "MIURA",
    position: "FW",
    status: "past",
    tournaments: ["brazil"],
    nickname: "パブロ",
    birthdate: "1999年11月10日",
    height: "171cm",
    weight: "72kg",
    career: [
      "トナン前橋",
      "栃木シティ",
      "鴻巣シティ",
      "BR7",
      "FC DIORIA",
      "TOMOSHIBI（2025クラブワールドカップ）",
    ],
    kakitaniComment:
      "攻撃の1vs1の強さがありスピードもある。ズラした後の左足のシュートもパンチがある。",
    playerMessage: "三浦パブロです！キングスリーグ世界一位を取りに行きます！！",
    instagramUrl: "https://instagram.com/pablomiura_p7",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "FW", jerseyNumber: 77 },
    ],
  },

  // ============================================================
  // スタッフ（再スタート編から発足）
  // ============================================================
  {
    slug: "ota",
    name: "太田宏介",
    nameEn: "OTA",
    position: "DF",
    status: "staff",
    tournaments: [],
    role: "監督",
    birthdate: "1987年7月23日",
    height: "179cm",
    weight: "78kg",
    hometown: "東京都町田市",
    dominantFoot: "left",
    career: [
      "麻布大学附属渕野辺高校",
      "横浜FC",
      "清水エスパルス",
      "FC東京",
      "フィテッセ（オランダ1部）",
      "名古屋グランパス",
      "パース・グローリーFC（オーストラリア）",
      "FC町田ゼルビア",
      "2023年限りで現役引退",
      "2024年〜 FC町田ゼルビア アンバサダー",
      "2026年〜 ムラッシュFC 監督就任",
    ],
    feature:
      "左足からの高精度クロスとフリーキックを武器とする元日本代表DF。2014年・2015年にJリーグベストイレブンを受賞、日本代表として国際Aマッチ7試合に出場した実績を持つ。座右の銘は「自信と過信は紙一重」── これは横浜FC退団時に三浦淳寛から贈られた言葉。プロデビュー戦では経験のない右サイドバックで出場し、極度の緊張に襲われたという逸話も。2023年限りで現役を引退し、2026年よりムラッシュFCの新監督に就任。",
    researchedProfile: true,
    tournamentHistory: [
      { tournament: "rebirth", role: "manager", subRole: "監督" },
    ],
  },
  {
    slug: "hasegawa",
    name: "長谷川アーリアジャスール",
    nameEn: "HASEGAWA",
    position: "MF",
    status: "staff",
    tournaments: [],
    role: "コーチ",
    birthdate: "1988年10月29日",
    height: "186cm",
    weight: "74kg",
    hometown: "埼玉県鶴ヶ島市",
    dominantFoot: "right",
    career: [
      "横浜F・マリノスユース",
      "横浜F・マリノス",
      "FC東京",
      "セレッソ大阪",
      "レアル・サラゴサ（スペイン2部）",
      "湘南ベルマーレ",
      "大宮アルディージャ",
      "名古屋グランパス",
      "FC町田ゼルビア",
      "ガイナーレ鳥取（2023-2024）",
      "2025年〜 ガイナーレ鳥取 アンバサダー",
      "2026年〜 ムラッシュFC コーチ就任",
    ],
    feature:
      "J1リーグ通算251試合17得点を記録した元日本代表MF。イラン人の父と日本人の母を持つハーフで、186cmの長身から繰り出される的確なパスとビルドアップが武器。FC東京時代の2013年9月にはJリーグ月間MVPを受賞、2012年には日本代表にも選出された（出場なし）。妻は元グラビアアイドルの滝川綾（モーニング娘。の生田衣梨奈のいとこ）。ランコ・ポポヴィッチ監督の下でFC東京・C大阪・サラゴサ・町田の4クラブを共にし、戦術を体現する選手として絶大な信頼を獲得していた。2026年よりムラッシュFCの新コーチに就任。",
    researchedProfile: true,
    tournamentHistory: [{ tournament: "rebirth", role: "coach", subRole: "コーチ" }],
  },

  // ----- 各大会のスタッフ（コーチ・トレーナー） -----
  {
    slug: "inui",
    name: "乾達朗",
    nameEn: "INUI",
    nameKana: "いぬいたつろう",
    position: "MF",
    status: "staff",
    tournaments: ["mexico"],
    role: "コーチ",
    feature: "メキシコ大会1stコーチ。",
    tournamentHistory: [
      { tournament: "mexico", role: "coach", subRole: "1st Coach" },
    ],
  },
  {
    slug: "shibata",
    name: "柴田涼太郎",
    nameEn: "SHIBATA",
    nameKana: "しばたりょうたろう",
    position: "GK",
    status: "staff",
    tournaments: ["mexico"],
    role: "GKコーチ",
    feature: "メキシコ大会GKコーチ。",
    tournamentHistory: [
      { tournament: "mexico", role: "coach", subRole: "GK Coach" },
    ],
  },
  {
    slug: "kanehara",
    name: "金原知希",
    nameEn: "KANEHARA",
    nameKana: "かねはらともき",
    position: "MF",
    status: "staff",
    tournaments: ["mexico"],
    role: "トレーナー",
    tournamentHistory: [{ tournament: "mexico", role: "trainer" }],
  },
  {
    slug: "watanabe",
    name: "渡邉康隆",
    nameEn: "WATANABE",
    nameKana: "わたなべやすたか",
    position: "MF",
    status: "staff",
    tournaments: ["italy", "france"],
    nickname: "GOD",
    role: "トレーナー",
    tournamentHistory: [
      { tournament: "italy", role: "trainer" },
      { tournament: "france", role: "trainer" },
    ],
  },
  {
    slug: "endo",
    name: "遠藤浩隆",
    nameEn: "ENDO",
    nameKana: "えんどうひろたか",
    position: "MF",
    status: "staff",
    tournaments: ["brazil"],
    role: "トレーナー",
    tournamentHistory: [{ tournament: "brazil", role: "trainer" }],
  },
  {
    slug: "nakai",
    name: "中井健介",
    nameEn: "NAKAI",
    nameKana: "なかいけんすけ",
    position: "MF",
    status: "staff",
    tournaments: ["italy", "france"],
    role: "前監督",
    feature:
      "第2回イタリア大会・第3回フランス大会で監督を務めた。再スタート編では落選メンバーを率いる「レベナンツ（Revenants：亡霊たち）」の監督として、最終セレクションで新生ムラッシュFCと激突した。",
    tournamentHistory: [
      { tournament: "italy", role: "manager", subRole: "監督" },
      { tournament: "france", role: "manager", subRole: "監督" },
      { tournament: "rebirth", role: "manager", subRole: "レベナンツ監督" },
    ],
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
