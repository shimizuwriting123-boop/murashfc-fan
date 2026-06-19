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

/**
 * エピソード集の1項目。NotebookLM からの抽出データを格納する。
 * - title: 任意のサブ見出し
 * - content: 本文。renderRichText 経由でレンダリングされ、**bold** / [text](url) / 自動内部リンクが効く
 */
export interface EpisodeItem {
  title?: string;
  content: string;
}

/**
 * 大会別のエピソード集。キーは「大会の slug + 開催年」で
 * 「mexico2024」のような verbose な名前を使う（将来同地域での再開催に備える）。
 */
export interface TournamentEpisodes {
  mexico2024?: EpisodeItem[];
  italy2025?: EpisodeItem[];
  france2025?: EpisodeItem[];
  brazil2026?: EpisodeItem[];
  rebirth?: EpisodeItem[];
}

/**
 * 選手の出演動画1本ぶん。YouTube 限定（サムネは hqdefault.jpg を使用）。
 * - title: 必須。動画タイトル
 * - url: 必須。`https://youtu.be/xxx` or `https://www.youtube.com/watch?v=xxx`
 * - videoId: 任意。URL から抽出可能だが、明示するとサムネ生成が安定する
 * - publishedAt: 任意。YYYY-MM-DD 形式
 * - channel: 任意。チャンネル名（例「KSK ch 【MURASH FC】」）
 */
export interface VideoItem {
  title: string;
  url: string;
  videoId?: string;
  description?: string;
  publishedAt?: string;
  channel?: string;
}

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
  /** YouTube チャンネル URL。可能なら /@handle 形式に揃える（動画 URL でも表示は可） */
  youtubeUrl?: string;
  /** TikTok プロフィール URL（/@handle 形式） */
  tiktokUrl?: string;
  /** スタッフ用の現在の役職（監督 / コーチ / マネージャー など）。staff バッジに表示される */
  role?: string;
  /**
   * 公式サイトではなく、本人公開情報・各クラブ公式発表・Wikipedia 等から
   * リサーチして集めたプロフィール。詳細ページのフッター注記の出し分けに使う。
   */
  researchedProfile?: boolean;
  /**
   * 経歴・パーソナリティ・周囲からの評価をまとめた長文ノート。
   * `\n\n` 区切りで段落に分割される。
   */
  personalityNote?: string;
  /** 大会別のエピソード集。NotebookLM 等の動画分析から抽出。 */
  tournamentEpisodes?: TournamentEpisodes;
  /** 出演動画リスト（YouTube）。空・未定義なら詳細ページのセクション自体を非表示。 */
  featuredVideos?: VideoItem[];
}

/** TournamentEpisodes のキー → 表示ラベル */
export const EPISODE_TOURNAMENT_LABEL: Record<keyof TournamentEpisodes, string> = {
  mexico2024: "第1回 メキシコ大会（2024年5〜6月）",
  italy2025: "第2回 イタリア大会（2025年1月）",
  france2025: "第3回 フランス大会（2025年6月）",
  brazil2026: "第4回 ブラジル大会（2026年1月）",
  rebirth: "再スタート編・新体制（2026年〜）",
};

/** TournamentEpisodes のキー順（時系列） */
export const EPISODE_TOURNAMENT_KEYS: Array<keyof TournamentEpisodes> = [
  "mexico2024",
  "italy2025",
  "france2025",
  "brazil2026",
  "rebirth",
];

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
    instagramUrl: "https://www.instagram.com/tsuyoshikodama_official",
    youtubeUrl: "https://youtube.com/@vlog-ec4ri",
    tiktokUrl: "https://www.tiktok.com/@tsuyoshikodama",
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
    hometown: "山梨県",
    dominantFoot: "left",
    career: [
      "フォルトゥナU-15",
      "帝京大可児高校（第100回全国高校サッカー選手権出場）",
      "ロボガトフットサルクラブ（東海1部）",
      "ソサイチ日本代表候補",
    ],
    feature:
      "チーム最年少のディフェンダー。小中ともにフットサルで全国大会に出場し、高校サッカー選手権出場という夢も実現。守備から入って自分のリズムを作り攻撃につなげるスタイルが持ち味。大舞台に強く、「足が折れてでもゴールを守ります」と語る泥臭さが武器。",
    personalityNote:
      "22歳（今年23歳）、チーム最年少のディフェンダー。山梨県出身、身長172cm、利き足は左足。\n\n小中ともにフットサルで全国大会に出場する実績を残す。「第100回高校サッカー選手権に絶対出たい」「プリンスリーグでやりたい」という理由で岐阜の帝京可児高校に進学。1〜2年生の頃はBチームのコーチと衝突し一番下のカテゴリーに落とされるも、腐らずに努力を続け、高3の最後の半年で一気にトップチームへ昇格。元々は左サイドバックだったが、サイドハーフとしてスタメンに定着し、見事に選手権出場という夢を叶えた。\n\nプロを諦め指定校推薦で名古屋の大学に進学。一度はサッカーを全て辞めるつもりだったが、地元・山梨の大会でFリーグのスカウトから声をかけられ、愛知の東海1部「ロボガトフットサルクラブ」でフットサルを開始。7人制サッカーの「ソサイチ」では日本代表候補に選出された実績も持つ。\n\n現在は新卒入社した施工管理系の会社で働きながら、休日はパーソナルトレーニングやジムに通うサッカー漬けの日々を送る。大舞台に強く、観客が湧くような状況が「大好き」。\n\nソサイチ日本代表で面識のあった縣選手・野崎選手から「お前、KINGsのセレクション受けろよ」とガチで勧められ、締め切り1〜2日前に急遽応募。1次セレクションで初めて加藤純一の話を聞いた際、「あ、これ戦う時だな」と一気にスイッチが入った。加藤のことを「サッカー未経験なのにスポーツのメンタリティや本質を鋭く捉えている」「人を惹きつける力がすごい」「モチベーター系の監督に絶対なれる」と絶賛している。\n\nセレクションでは「総合2位」に選ばれ、本人が一番驚いた。コントロールショットは打てず「ストレートボールしか打てない」ものの、元Jリーガー相手のエキシビションマッチでその強烈なシュートを叩き込み、一気に波に乗った。\n\nイタリア合宿に参加するため、新卒入社わずか2ヶ月の6月に支店長に「10日間休めないか」と直談判。「無理だと言われたら仕事を辞める」という覚悟だったが、会社側が「やりたいことはやった方がいい」と応援してくれた。\n\n自身の最大の武器は「守備」。守備から入って自分のリズムを作り、攻撃につなげていくスタイル。「みんな自分より上手い人たちばっかりだけど、足が折れてでもゴールを守ります」と語り、チームのために泥臭く戦う決意を持つ。",
    researchedProfile: true,
    instagramUrl: "https://www.instagram.com/miyauchi714",
    featuredVideos: [
      {
        url: "https://www.youtube.com/watch?v=ro5PmcJtwPk",
        videoId: "ro5PmcJtwPk",
        title:
          "【最年少】高校Bチームの男がMURASH FCで2位になるまで｜自身の長所｜本当の姿｜MURASH ポッドキャスト＃３宮内俊輔",
      },
    ],
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
    instagramUrl: "https://www.instagram.com/koki13official",
    xUrl: "https://x.com/kkkkdddddkkk333",
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
    hometown: "大阪府",
    feature:
      "ソサイチ日本代表の中心選手。ASIA 7's 2024では初戦ブルネイ戦の2得点などで優勝（アジア2連覇）に貢献し、FOOTBALL 7 WORLD CHAMPIONSHIP 2025では日本初のベスト8進出を経験。F7SL関西Div.1ベスト7（2024）にも選出されている。",
    personalityNote:
      "今年32歳になるベテラン。チーム内では中村駿介、縣翔平と並んで2番目に年長。年齢を感じさせない若々しさがあり、チームメイトから「甘いマスク」と「お菓子ほど綺麗な肌」と絶賛されている。\n\n香川西高校で1年生のインターハイ後からレギュラーに定着し、3年連続で全国選手権に出場。大阪学院大学では関西リーグでアシストランキング2位に入り、関西選抜にも選出された。卒業時にはJ3の複数チームから声がかかっていたが、大学3年の終わり頃に選抜に落ちたことでモチベーションを失い、プロへの道は進まなかった。\n\n現在はリフォーム関係の会社を立ち上げ、2期目を迎える社長。起業の理由は「ソサイチで日本代表として世界と戦うやりがいを感じ、普通の仕事では遠征などの弊害になるから」という、サッカーのために自ら環境を作った凄まじい覚悟の持ち主。\n\n11人制サッカー（ルートイレブン）、7人制ソサイチ（ボルベール大阪）、フットサル（リンドバロッサ京都）を掛け持ちし、週4日以上のペースでプレー。仕事以外の時間はほぼ全てサッカーに注ぎ、友達と遊ぶ時間は全くないと語る。ソサイチではアジア大会で優勝、ワールドカップ（メキシコ大会、ブラジル大会）にも出場するなど、世界を舞台に実績を残している。\n\nソサイチのアジア大会終了後、チームメイトの縣翔平がムラッシュFCの一員としてイタリアのネーションズカップに出場するのを見て「自分もあの舞台に立ちたい」と思ったのが応募のきっかけ。フランス大会のセレクションでは実力不足で落選するも、その後ブラジル大会のセレクションに見事合格した。\n\nブラジル大会初戦（アメリカ戦）では手も足も出ずに惨敗し、「何をしてきたんやろう」という虚無感に襲われた。しかしアメリカ戦後の深夜、加藤純一オーナーからチーム全員が激怒された際には「高校サッカーの監督に怒られている気分で、何も言い返せない。自分たちが悪い」と真摯に受け止めた。\n\n加藤純一のことを「見てないようでしっかり見てくれている」と深く尊敬しており、「許されるなら『ボス』と呼びたい」「何言われても加藤さんのために頑張ろうと思える」と語るほど心酔している。\n\n学生時代は右サイドハーフを主戦場とし、ドリブルで仕掛ける「ギャンギャンドリブラー」だったが、年齢による衰えやブラジル大会で「攻撃だけやっていても勝てない」と痛感。現在は守備を重視するバランス型の選手へと大きくプレースタイルを変えた。試合状況に応じてプレーを変えられる適応力の高さが持ち味で、チームメイトからも「ギャンブルにならない（計算できる）」と評価されている。\n\n「ボスの笑顔が見たい」という一心でプレーしており、イタリア大会で優勝して加藤オーナーの満面の笑みを見ながらみんなでハイタッチすることが現在の最大の夢。",
    researchedProfile: true,
    career: [
      "香川西高校（3年連続全国選手権出場）",
      "大阪学院大学（関西選抜）",
      "ルート11",
      "RAPAZ FUTSAL CLUB",
      "リンドバロッサ京都",
      "VOLVER OSAKA",
      "ソサイチ日本代表（2024アジアカップ優勝、2025ブラジルW杯）",
    ],
    kakitaniComment:
      "パスを出すタイミング、出すところのセンスがある。全てにおいて能力が高い。",
    playerMessage:
      "箱﨑裕也です！新たに発足するチームで皆さんとコミュニケーションをいっぱい取っていきたいと思っています。今まで築き上げてこられたムラッシュFCの歴史をより良くできるように、世界一だけを目指して魂で闘います。よろしくお願いします。",
    instagramUrl: "https://www.instagram.com/yuya.hakozaki",
    tournamentHistory: [
      { tournament: "brazil", role: "player", position: "MF", jerseyNumber: 8 },
    ],
    featuredVideos: [
      {
        url: "https://www.youtube.com/watch?v=O6oyZ6bPtk4",
        videoId: "O6oyZ6bPtk4",
        title:
          "【初告白】キングスブラジル大会の心境を初告白｜７人制の為に仕事を変える｜一番印象に残った選手は〇〇｜MURASH FC Podcast＃4 YUYA HAKOZAKI",
      },
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
    birthdate: "1994年5月16日",
    height: "167cm",
    weight: "61kg",
    hometown: "埼玉県新座市",
    career: [
      "浦和レッズジュニアユース",
      "浦和レッズユース（2012年10番・トップチーム2種登録）",
      "専修大学",
      "Qrendi FC（マルタ）",
      "Pietà Hotspurs（マルタ）",
      "ヴァルミエラ（ラトビア）",
      "ペルセラ・ラモンガン（インドネシア）",
      "2020年7月 現役引退",
      "ELAGUA TOKYO（ソサイチ）",
      "新世界制覇（ソサイチ）",
    ],
    feature:
      "浦和レッズユースで10番を背負い、マルタ・ラトビア・インドネシアと海外3カ国でプレーした元プロ。引退後は選手代理人・セカンドキャリア支援の株式会社C.T.Cを設立し代表を務める。ソサイチ日本代表としてASIA 7's 2024優勝（アジア2連覇）に貢献し、イタリア大会では初戦イタリア戦でMVPを獲得した。",
    researchedProfile: true,
    instagramUrl: "https://www.instagram.com/shunsukenakamura0516",
    xUrl: "https://x.com/nakashun0516",
    youtubeUrl: "https://youtube.com/@nakashun7474",
    tiktokUrl: "https://www.tiktok.com/@shunsukenakamura0516",
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
    instagramUrl: "https://www.instagram.com/shohei_agata",
    xUrl: "https://x.com/agata19940525",
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
    instagramUrl: "https://www.instagram.com/kouga_960526",
    xUrl: "https://x.com/kouga3030",
    tiktokUrl: "https://www.tiktok.com/@kouga.yokoyama",
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
    hometown: "宮城県",
    career: [
      "ベガルタ仙台ユースU-18（国体選抜）",
      "東北学院大学",
      "intel biloba tokyo",
      "東京蹴球団（東京都社会人サッカーリーグ1部）",
      "てくてくキッカーズ（ソサイチ関東リーグ1部）",
    ],
    feature:
      "小柄なレフティアタッカー。ソサイチF7SL関東1部では2023年1得点→2024年5得点→2025年7得点と毎年記録を伸ばし続けている。2026年からは小田崚平も同じてくてくキッカーズに加入。",
    researchedProfile: true,
    kakitaniComment:
      "1vs1で何度も相手を剥がしているシーンが見られた。取られない持ち方もできる。左利きも特徴。",
    playerMessage:
      "はじめまして！梅津怜央です。へいへい、漢の分も魂燃やして必死こいて頑張ります。よろしくお願いします！",
    instagramUrl: "https://www.instagram.com/reeo1107",
    xUrl: "https://x.com/reeeeeo1107",
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
    birthdate: "2000年3月3日",
    height: "171cm",
    career: [
      "桜丘FC・桜丘smile FC",
      "セレージャFC",
      "大阪市立桜宮高校",
      "桃山学院大学",
      "ELAGUA TOKYO（ソサイチ、2023-2025）",
      "てくてくキッカーズ（ソサイチ、2026-）",
      "TOKYO BAY FC（サッカー）",
    ],
    feature:
      "トレセン・選抜歴なしから這い上がった叩き上げのアタッカー。ソサイチの強豪ELAGUA TOKYOで3年間14ゴールを記録し、サッカーとソサイチの二刀流を続ける。スピードとアジリティが武器。ブラジル大会トライアウトの落選を経て、2026年セレクションをトップ評価で勝ち上がり復帰した。",
    researchedProfile: true,
    instagramUrl: "https://www.instagram.com/heihei.0303",
    xUrl: "https://x.com/heiheikings8",
    youtubeUrl: "https://youtu.be/tg2MKtSHaP0",
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
    xUrl: "https://x.com/forever_829",
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
    instagramUrl: "https://www.instagram.com/toshiya2003",
    xUrl: "https://x.com/tosiya58",
    youtubeUrl: "https://youtube.com/@toshiya.10",
    tiktokUrl: "https://www.tiktok.com/@tosisal10",
    tournamentHistory: [
      { tournament: "france", role: "player", position: "FW", jerseyNumber: 12 },
      { tournament: "brazil", role: "player", position: "MF", jerseyNumber: 10 },
    ],
  },
  {
    slug: "hayashida",
    name: "林田大和",
    nameEn: "HAYASHIDA",
    position: "DF",
    number: 12,
    status: "confirmed",
    tournaments: [],
    career: [
      "埼玉の大学（大学4年生の夏に休学）",
      "スペイン5部リーグ（学生ビザ、約2年間 〜2025年5月）",
      "キャリアアドバイザー（転職サポート）／スペイン留学サポート（社会人として並行）",
    ],
    feature:
      "1対1の対人の強さと、ボールを奪ってからそのまま攻撃に出ていける推進力が武器のディフェンダー。一番後ろで構えるだけでなく、ボランチのように守備から攻撃へ参加していくプレーが持ち味。",
    instagramUrl: "https://www.instagram.com/yamatohayashida_",
    personalityNote:
      "24歳のディフェンダー（2026年現在、今年25歳）。\n\n埼玉の大学でサッカーをプレーしていたが、「日本で行けるカテゴリーでは天井が見えている」と感じ、自身の付加価値を高めるために海外挑戦を決意。大学4年生の夏に休学し、スペインの5部リーグで約2年間プレーした。プロ契約ではなく学生ビザでの滞在で、チームからの給与だけでは生活できず、日本の企業の仕事をオンラインでこなしながら苦労して生活した経験を持つ。\n\n2025年5月に帰国。現在は社会人として働きながら、キャリアアドバイザー（転職サポート）と、自身の元代理人が経営する会社で高校生のスペイン留学サポート業務を行っている。\n\nプレースタイルは1対1の対人の強さに加え、ボールを奪ってからそのまま攻撃に出ていける推進力が特徴。一番後ろで構えるだけでなく、ボランチのように守備から攻撃へ参加していくプレーが持ち味。",
    featuredVideos: [
      {
        title:
          "【新加入】スペインサッカーを知る男がMURASH FCに加入！その素顔に迫る！MURASH Podcast#2 ｜林田大和",
        url: "https://youtu.be/gWV7CVF_m8U",
        videoId: "gWV7CVF_m8U",
        channel: "KSK ch 【MURASH FC】",
      },
    ],
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
    instagramUrl: "https://www.instagram.com/fumiya__shiraishi",
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
    career: ["浦和西高校", "N（ソサイチ）"],
    feature:
      "高校3年時にゲキサカ「全国高校総体予選 注目の11傑」に選ばれた左利きアタッカー。卒業後はクラブチームに所属せず、「公園でサッカー→キングスリーグの舞台へ」と紹介された異色の経歴を持つ。",
    researchedProfile: true,
    kakitaniComment:
      "なかしゅんが連れてきた、無名枠。左足のシュートが武器で、シュートレンジ（シュートが決めれる範囲）が広い。",
    instagramUrl: "https://www.instagram.com/keisukeshige0901",
    xUrl: "https://x.com/shigesuke0901",
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
      "東京ヴェルディウィングス",
      "JSC千葉",
      "聖和学園高校（第93回全国高校サッカー選手権出場・背番号10）",
      "新潟医療福祉大学",
      "Musan Salama（フィンランド・プロ）",
      "FCカラスト埼玉南西（社会人・背番号10）",
    ],
    feature:
      "フィンランドのプロチーム「Musan Salama」でプレーした経験を持つ攻撃的MF。前十字靭帯断裂を二度経験しながらも復帰した不屈のアタッカー。両足が使えてドリブルができることが最大の武器で、チームメイトから「後ろの2枚以外ならどこでもできる」と評価されるユーティリティ性を持つ。現在はITエンジニアとして働きながら社会人チーム「FCカラスト埼玉南西」で背番号10を背負う。",
    personalityNote:
      "29歳のアタッカー。職業はITエンジニア。\n\n小学4年まで東京ヴェルディの下部組織「ウィングス」に所属し、その後街クラブを経て、中学はドリブルテクニックで有名な「JSC千葉」でプレー。高校は強豪・聖和学園に進学し、3年時には背番号10番を背負って全国高校サッカー選手権に出場した。大学は新潟医療福祉大学へ進学。\n\n大学4年時にフィンランドへ渡りプロとしての挑戦を始めたが、前十字靭帯を断裂。実は高校の最後にも前十字靭帯を切っており、二度目の大怪我でメンタルも崩れ、「もうサッカーはできない」と引退状態に陥った。2〜3年弱ほどサッカーから完全に離れ、夜勤もあるシフト制の仕事をしながら、個サルすら一切やらない生活を送っていた。\n\nしかし、社会人サッカーを始めていた中戸選手から連絡をもらったことがきっかけで再びボールを蹴り始める。元々の技術が高かったため、徐々にコンディションを取り戻して現在に至る。\n\n中村駿介、野崎選手、重信圭佑らと社会人サッカーチーム（カラスト）や7人制ソサイチのチーム、サッカースクールを週4日ペースで共に活動している深い仲。\n\n前回のキングスリーグ（フランス大会やブラジル大会）の際も参加を悩んでいたが、仕事の都合で断念。しかし大会の試合結果を見ているうちに「参加すればよかった」「もしかしたら俺やれるわ」という強い後悔と情熱が湧き、今回の応募のきっかけとなった。\n\nセレクション中はハムストリングに痛みを抱えながらのプレーだったが、普段から強度の高い社会人チームでプレーしているため、周りのレベルの高さに驚くことはなく、すんなりと練習通りにやれたと自信を覗かせていた。最終セレクションの合宿では、過酷な環境の中でも「俺は全然起きなかった、爆睡だった」と語るなど、フィンランドでの海外生活経験からくる図太さを持ち合わせている。\n\n最大の武器は両足が使えてドリブルができること。チームメイトからは「後ろの2枚以外ならどこでもできる」と評価されている。本人が一番やりたいポジションは「真ん中」か「トップ」で、攻撃の起点となる役割を望んでいる。",
    researchedProfile: true,
    instagramUrl: "https://www.instagram.com/mitsuru_t_0",
    tiktokUrl: "https://www.tiktok.com/@mitsuru_t_0",
    featuredVideos: [
      {
        url: "https://www.youtube.com/watch?v=xdJvCoOSBHU",
        videoId: "xdJvCoOSBHU",
        title: "新生ムラッシュFC合格者「谷田光」に話を聞いてみた。",
      },
    ],
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
    instagramUrl: "https://www.instagram.com/f_ksk_",
    xUrl: "https://x.com/kei93fuka41",
    youtubeUrl: "https://youtube.com/@kskch8243",
    tournamentHistory: [
      { tournament: "mexico", role: "player", position: "GK", jerseyNumber: 1 },
      { tournament: "italy", role: "player", position: "GK", jerseyNumber: 1 },
      { tournament: "france", role: "player", position: "GK", jerseyNumber: 1 },
    ],
    personalityNote:
      "帝京長岡高校、高校選抜、立正大学、品川CCを経て、Jリーグのサガン鳥栖でプロとしてプレーした経歴を持つ。2017年から現在に至るまで、ソサイチ（7人制サッカー）の日本代表としても長年活躍。\n\n奥さんからは「K（ケイ）」という愛称で呼ばれている。チームに朝倉啓介が加入した際、「啓介だと被るので、ケイでも大丈夫です（ガチで言っているので）」と提案したが、加藤純一オーナーから即座に「呼ばねえよ、お前のことケイって」と突っ込まれる一幕があった。\n\n加藤純一からは「スポーツできてかっこよくて、性格良くて面白かったら火の打ち所がない。唯一の弱点は面白くないことだけ」と愛あるいじりを受けている。柿谷曜一朗からも「シュートストップがピカイチ。全てのキングスリーグ日本代表として大会に参戦中で経験もある」と絶大な信頼を寄せられている。",
    tournamentEpisodes: {
      mexico2024: [
        {
          content:
            "「初めのメキシコは早く出して怪我して何もしてないんで、本大会2大会分頑張りたいと思います」と語った、本人にとっても悔しい初戦。",
        },
        {
          content:
            "大会敗退後には「キーパーっていうポジションはどれだけセーブしても1つの自分のミスだったりとかで失点してしまうそんなポジションだなっていうところは痛感してて」「多分あれは僕のミスだとぶっちゃけ思ってます」「次こそは優勝して絶対に加藤さんを胴上げしたい」と語り、強い責任感と悔しさを露わにした。",
        },
      ],
      italy2025: [
        {
          content:
            "初戦の開催国イタリア戦では、パントキックから直接ゴールに吸い込まれる見事なオープニングゴール（日本の2点目）を決めた。ビッグセーブも連発し、見事試合のMVPを獲得。加藤純一は後の大会で他の選手に「啓介からMVP取るぐらいの勢いで」とハッパをかけるほど、その活躍は印象的だった。",
        },
        {
          content:
            "第2戦のアルゼンチン戦では、相手のプレジデントペナルティ（オーナーのPK）を見事にストップ。実況から「ビッグセーブが飛び出しました」と称賛された。同試合のシュートアウト（1対1）でも、アルゼンチンのパブロ・ゴメスに対して「じわりじわり寄せていってシュートコースを消しました。見事な駆け引き深谷。まさに日本の守護神」と見事なストップを見せた。",
        },
        {
          content:
            "第3戦のモロッコ戦でも、シュートアウトで相手のサウードに対して飛びつき、時間をかけさせてシュートを打たせないという好セーブを見せた。",
        },
      ],
      france2025: [
        {
          content:
            "メンバー発表では、加藤純一から1人目として名前を呼ばれた。「メキシコ大会、イタリア大会2大会連続で出ていて今回も選ばしていただきました。経験も豊富ですし気持ちもすごく強い」「目標ゼロ失点で頑張っていただきたい」と絶大な信頼を寄せられ、チームのキャプテンに任命された。",
        },
        {
          content:
            "初戦のフランス「F2R」戦では、開始1分過ぎに自らドリブルで持ち上がり、右足一閃のシュートが相手に当たってゴールに吸い込まれ、大会のオープニングゴールを決めた。しかし、同試合の終盤では、F2Rのエルムに股を巧みに抜かれて失点（股抜きゴール）を喫する悔しい場面もあった。",
        },
        {
          content:
            "第2戦のアメリカ「ジンジFC」戦では、シュートアウトで相手のアレイシュのシュートを足を出して見事にストップ。さらに、この日絶好調だった相手のブリンキーニョのシュートアウトも気迫で止めた。試合は惜しくもサドンデスで敗退となった。",
        },
      ],
      brazil2026: [
        {
          content:
            "ブラジル大会に向けたトライアウトには「ムラッシュFCの常設メンバー」の募集だと聞いて参加し、見事合格を果たした。最終セレクションでのFC太田（元Jリーガー軍団）とのエキシビションマッチに出場し、富山選手のシュートアウトに対して絶妙な距離の詰め方でセーブし、実況から「このエキシビションマッチでもあの距離詰めてセーブ本当に印象的ですね」と称賛された。",
        },
        {
          content:
            "しかし、ブラジル大会が開催される1月は妻の第一子出産予定日と重なっていた。妻はこれまでの大会も応援してくれており、深谷がセーブした時にテレビの前で泣いて喜んでくれるほどだった。そのため「今回は自分が一番近くで妻を応援したい」と考え、ブラジル大会への不参加を決断。",
        },
        {
          content:
            "不参加の理由はGMには伝えていたが、加藤純一に自分の口から直接伝えたいと考え、練習後に直接報告。これを聞いた加藤は「家族より大事なものって存在しない。その判断は間違ってない。尊重できる」「お前のキングスに対する思いを知ってるから、お前いないけど俺がちゃんと勝ってきてやるから。俺こうやってお前に自慢しにくるから」と温かく受け入れ、日本にいる時は経験をチームに還元してほしいと伝えた。",
        },
        {
          content:
            "深谷は「自分が行けない大会だとしてもめちゃくちゃ勝ってほしい、優勝してほしいと本気で願ってます」と語り、12月の渡航前までは練習に参加してチームが引き締まるように全力でサポートすることを約束。サポートとして練習に参加し続ける中で、トライアウト落選組（エルアグア）とのトレーニングマッチにも出場し、「前回は4-2で守備を作ってシュートを止めるのが最大の役割だったが、今回からは攻撃のところにもチャレンジしていこうということで、チャレンジする時としない時は分けないといけないなっていう課題が見えた」と語った。",
        },
      ],
    },
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
    birthdate: "1981年10月10日",
    height: "180cm",
    weight: "77kg",
    hometown: "鹿児島県",
    career: [
      "鹿児島実業高校",
      "駒澤大学",
      "横浜F・マリノス（2002-2007）",
      "東京ヴェルディ（2008）",
      "ジュビロ磐田（2009-2011）",
      "柏レイソル（2012）",
      "浦和レッズ（2013-2017）",
      "ヴィッセル神戸（2018-2019）",
      "2020年1月 天皇杯優勝を最後に現役引退",
    ],
    feature:
      "2004年アテネ五輪で主将を務めた元日本代表クラスのユーティリティDF。2003年J1新人王・2013年J1ベストイレブン・J1通算400試合出場と輝かしい実績を持つ。引退後はサッカー系YouTuberの先駆者として登録者約49万人のチャンネルを運営。メキシコ大会にはワイルドカード枠で参戦した。",
    researchedProfile: true,
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
    birthdate: "1991年6月1日",
    height: "176cm",
    feature:
      "メキシコ大会のヘイトタンク。USスチール戦で神シュートを決めて会場を沸かせた。フランス大会ではチームスタッフとして帯同。サッカーYouTubeチーム「WINNER'S」の発起人・創設メンバーでもある。",
    researchedProfile: true,
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
    birthdate: "2001年9月29日",
    height: "165cm",
    hometown: "愛知県長久手市",
    career: [
      "興國高校",
      "山形大学 工学部（サッカー部副キャプテン）",
      "山形大学大学院 理工学研究科",
    ],
    feature:
      "メキシコ大会のチーム最年少にして唯一の学生選手。興國高校から山形大学工学部に進んだ文武両道の理系プレーヤーで、大会後は大学院に進学した。",
    researchedProfile: true,
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
    career: [
      "浦和レッズユース",
      "ルクセンブルクリーグ",
      "TJFA（中学生年代コーチ）",
    ],
    feature:
      "元浦和レッズユース。ルクセンブルクでのプレー経験を持ち、一度引退して指導者に転身していたが、メキシコ大会で約2年ぶりに現役復帰した。現在はサッカースクールで中学生年代を指導する。",
    researchedProfile: true,
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
    birthdate: "1993年8月23日",
    height: "173cm",
    weight: "65kg",
    hometown: "大阪府豊中市",
    dominantFoot: "right",
    career: [
      "ガンバ大阪ジュニアユース",
      "野洲高校",
      "大阪経済大学",
      "奈良クラブ（2016）",
      "タイ・スロベニア・ラトビア・ポーランド・クロアチアの5カ国でプレー",
      "プラムワン（2022-、ソサイチ日本代表）",
      "WINNER'S（2023-）",
    ],
    feature:
      "海外5カ国でプレーした元プロ。ソサイチ日本代表としてASIA 7's 2023優勝に貢献。スパイク取り寄せサービス「Footboots」を経営する起業家でもある。メキシコ・イタリア・フランスと3大会連続で日本代表を支えたレジェンド。",
    researchedProfile: true,
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
    birthdate: "1990年11月13日",
    height: "180cm",
    career: ["LUFT-柏TOR（フットサル）", "malva", "O-PA（2015-）"],
    feature:
      "関東のフットサルシーンを渡り歩いたベテラン。フェイント技「トンパ」の使い手で、SNSでは「トンパ職人」を名乗る。",
    researchedProfile: true,
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
    birthdate: "1994年7月10日",
    height: "174cm",
    hometown: "福岡県北九州市",
    career: [
      "ボルク北九州（2015-2018）",
      "ボルクバレット北九州（Fリーグ、2018-2023）",
      "バサジィ大分（Fリーグ、2023-2024）",
    ],
    feature:
      "Fリーグで長くプレーした元フットサル選手。現在は女子バレーボールSVリーグ「カノアラウレアーズ福岡」のフロントスタッフ（営業本部長兼アリーナMC）を務める異色の経歴の持ち主。",
    researchedProfile: true,
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
    birthdate: "1997年5月22日",
    height: "170cm",
    feature:
      "メキシコ大会では3試合すべてに出場。ブラジル大会に向けた2025年11月発表の常設メンバー18名にも復帰選出された（最終ロスター入りはならず）。",
    researchedProfile: true,
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
    birthdate: "1991年8月17日",
    height: "171cm",
    weight: "63kg",
    hometown: "広島県",
    career: [
      "サンフレッチェ広島ユース",
      "法政大学（4年時キャプテン）",
      "カマタマーレ讃岐（2014-2015）",
      "オネハンガ・スポーツ（ニュージーランド）",
      "ワイタケレ・ユナイテッド（ニュージーランド）",
      "マランパ・リバイバース（バヌアツ）",
      "WINNER'S（2022-）",
      "FC LISEM SOCIETY（ソサイチ）",
    ],
    feature:
      "日本代表・森保一監督の長男。サンフレッチェ広島ユースから法政大学（4年時主将）を経てカマタマーレ讃岐でプロに。その後ニュージーランド・バヌアツでもプレーした。フランス大会でキャプテンに就任。現在はWINNER'Sやソサイチで活動し、2025年にはソサイチ日本代表最終候補に選出された。",
    researchedProfile: true,
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
    birthdate: "1990年10月5日",
    height: "177cm",
    weight: "69kg",
    hometown: "京都府京都市",
    career: [
      "京都サンガF.C. U-15・U-18",
      "立命館大学",
      "アルビレックス新潟シンガポール（2013-2015）",
      "ラオ・トヨタFC（ラオス、2016）",
      "カスタムズ・ユナイテッド（タイ、2017）",
      "ブラウブリッツ秋田（2017-2018）",
      "プラムワン（2021-）",
    ],
    feature:
      "元ソサイチ日本代表（ASIA 7's 2023優勝メンバー）で、後に代表アシスタントコーチも務めた。ブラウブリッツ秋田では2017年のJ3優勝に貢献。フランス大会ではコーチに就任。",
    researchedProfile: true,
    instagramUrl: "https://www.instagram.com/yitsuki15",
    xUrl: "https://x.com/itsuki_ymd",
    youtubeUrl: "https://youtube.com/@itsukichannel14",
    tiktokUrl: "https://www.tiktok.com/@yitsuki14",
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
    hometown: "東京都",
    career: [
      "JACPA東京FC",
      "実践学園高校",
      "國學院大學蹴球部",
      "ラインメール青森FC",
      "FC刈谷",
      "品川CC",
    ],
    feature:
      "左足のキック力とビルドアップ能力を武器に3大会に出場。品川CCでは槙野智章監督の下でプレーし、2025年11月に現役引退した。",
    researchedProfile: true,
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
    height: "170cm",
    weight: "60kg",
    career: ["FC DA VINCHI（ソサイチ、2020）", "プラムワン（2021-）"],
    feature:
      "元ソサイチ日本代表。ソサイチチーム「プラムワン」の発起人・キャプテン。吉本興業を経てYouTuber「梅ちゃんねる」としても活動する。",
    researchedProfile: true,
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
    career: [
      "イルソーレ小野FC（兵庫）",
      "スペイン各クラブ",
      "Rayo de Barcelona（キングスリーグ）",
      "xBuyer Team（キングスリーグ、2025-）",
    ],
    feature:
      "スペインのキングスリーグを主戦場とする「スペインキングスリーガー」。2025年1月にRayo de BarcelonaからxBuyer Teamに移籍し、フランス大会にはxBuyerの一員として出場。現地ファンから「キングスリーグの皇帝」とも呼ばれる人気選手で、青髪がトレードマーク。",
    researchedProfile: true,
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
    career: ["Verde Banca（ソサイチF7SL関東）"],
    feature:
      "ソサイチF7SL関東のVerde Bancaに所属するFW。2024シーズンは5ゴールを記録した。",
    researchedProfile: true,
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
    birthdate: "1991年10月31日",
    height: "170cm",
    hometown: "埼玉県川越市",
    career: [
      "川越プレーザFC",
      "大宮アルディージャユース",
      "ザスパ草津チャレンジャーズ",
      "栃木ウーヴァFC",
      "Intel Biloba Tokyo（ソサイチ）",
      "エルアグア",
      "LFYR SC / LAZO YOKOHAMA",
    ],
    feature:
      "大宮アルディージャユース出身。ソサイチ関東リーグで2年連続得点王に輝いた生粋のストライカーで、ASIA 7's 2023では優勝と得点王を同時達成。TBS『SASUKE』への出場歴も持つ。",
    researchedProfile: true,
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
    birthdate: "1992年10月21日",
    height: "183cm",
    career: [
      "ジェフユナイテッド千葉U-15",
      "流通経済大学付属柏高校",
      "国士舘大学",
      "オーストラリアのクラブ（ブリスベン）",
      "東京23FC",
      "VOYAGERS（2025-）",
    ],
    feature:
      "メキシコ大会では2ndコーチ、フランス大会では選手として出場というユニークな経歴。サッカースクール「TJBCFS」のコーチを務めながら、2025年からは岐阜のVOYAGERSで選手として現役を続ける、指導と現役の二刀流。",
    researchedProfile: true,
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
    birthdate: "1992年1月27日",
    height: "173cm",
    weight: "68kg",
    hometown: "神奈川県川崎市",
    career: [
      "さぎぬまSC",
      "神奈川県立百合丘高校",
      "ファイアフォックス府中（フットサル）",
      "フウガドールすみだ（Fリーグ）",
      "ボアルース長野（Fリーグ）",
      "Y.S.C.C.横浜（Fリーグ）",
      "LAZO YOKOHAMA（ソサイチ）",
    ],
    feature:
      "元フットサル日本代表。Fリーグで約10年プレーしたベテランで、現在はソサイチのLAZO YOKOHAMAで現役を続ける。登録者280万人超のサッカーYouTubeチャンネル「あしざるFC」のメンバーとしても活動。",
    researchedProfile: true,
    tournamentHistory: [
      { tournament: "france", role: "player", position: "MF", jerseyNumber: 4 },
    ],
  },
  {
    slug: "sugimoto",
    name: "杉本竜士",
    nameEn: "SUGIMOTO",
    nameKana: "すぎもとりゅうじ",
    position: "MF",
    status: "past",
    tournaments: ["france"],
    birthdate: "1993年6月1日",
    height: "163cm",
    weight: "58kg",
    hometown: "東京都府中市",
    dominantFoot: "right",
    career: [
      "東京ヴェルディジュニアユース・ユース",
      "東京ヴェルディ（2012-2016）",
      "FC町田ゼルビア（2013 期限付き）",
      "名古屋グランパス（2017-2018）",
      "徳島ヴォルティス（2018-2019）",
      "横浜F・マリノス（2020）",
      "横浜FC（2020-2021）",
      "東京ヴェルディ（2021-2023）",
      "ザスパ群馬（2023-2024）",
      "2025年1月 現役引退",
    ],
    feature:
      "J2通算251試合21得点を記録した小柄なドリブラー。2011年の日本クラブユース選手権ではMVPを獲得し、U-18からU-22まで各年代の日本代表を経験した元Jリーガー。2025年1月に現役引退し、その直後のフランス大会に選手として参戦。宮島事件の主人公。",
    researchedProfile: true,
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
    hometown: "京都府",
    feature:
      "ソサイチ日本代表として、FOOTBALL 7 WORLD CHAMPIONSHIP 2025（ブラジル）での日本初ベスト8進出に貢献。KT SEVEN 2025では大会ベスト7に選出された。",
    researchedProfile: true,
    career: [
      "セゾンFC",
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
    nameKana: "うじはしかん",
    position: "FW",
    status: "past",
    tournaments: ["france"],
    height: "188cm",
    weight: "89kg",
    career: [
      "三菱養和調布ジュニアユース",
      "FCトリプレッタ（ユース）",
      "成蹊大学",
      "東京蹴球団",
      "ELAGUA TOKYO（ソサイチ）",
    ],
    feature:
      "フランス大会で柿谷の代替として、トライアウト参加者から選出。F7SL関東1部の絶対王者ELAGUA TOKYOで得点を量産する188cmの大型FWで、2025年にはソサイチ日本代表に初選出され、FOOTBALL 7 WORLD CHAMPIONSHIPの日本初ベスト8に貢献した。",
    researchedProfile: true,
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
    birthdate: "1990年1月3日",
    height: "176cm",
    weight: "68kg",
    hometown: "大阪府大阪市",
    dominantFoot: "right",
    career: [
      "セレッソ大阪U-15・U-18",
      "セレッソ大阪（2006-2014）",
      "徳島ヴォルティス（2009-2011 期限付き）",
      "FCバーゼル（スイス、2014-2015）",
      "セレッソ大阪（2016-2020）",
      "名古屋グランパス（2021-2022）",
      "徳島ヴォルティス（2023-2024）",
      "2025年1月 現役引退",
    ],
    feature:
      "元日本代表FW（2014年ブラジルW杯出場、国際Aマッチ18試合5得点）。EAFF東アジアカップ2013得点王、Jリーグ最優秀ゴール賞を2013年・2021年と史上初の複数回受賞した天才アタッカー。2025年1月に現役引退。MURASH FCにフランス大会で参加予定だったが、アキレス腱痛再発でアドバイザーに変更、日本から帯同せずサポート。ブラジル大会では強化責任者を務め、再スタート編からはダブルオーナーに昇格し、加藤純一と並んでチームを率いる。",
    researchedProfile: true,
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
    birthdate: "1993年8月3日",
    height: "180cm",
    hometown: "埼玉県所沢市",
    dominantFoot: "right",
    career: [
      "浦和レッズユース",
      "浦和レッズ（2012-2014）",
      "アビスパ福岡（2014 期限付き）",
      "ガイナーレ鳥取（2015）",
      "Y.S.C.C.横浜（2016）",
      "AC長野パルセイロ（2017）",
      "ラインメール青森（2018）",
      "ラスタサッカーファミリー（2019-2020）",
      "スペイン下部リーグ3クラブ（2021-2024、約3年半）",
    ],
    feature:
      "浦和レッズユースから昇格したエリートで、J通算90試合4得点のボランチ。J複数クラブを渡り歩いた後、スペイン下部リーグで約3年半プレーし指導者ライセンス取得にも取り組んだ。第4回ブラジル大会では選手として出場し、再スタート編からはマネージャーに転身。YouTubeチャンネル「ノーザがゆく」も運営する。",
    researchedProfile: true,
    kakitaniComment:
      "Jの複数クラブとスペインのチームを経験した、プロを知るベテラン。浦和レッズユースではなかしゅんの1つ上の先輩。",
    instagramUrl: "https://www.instagram.com/nooooooza83",
    xUrl: "https://x.com/pepyan23",
    youtubeUrl: "https://youtube.com/channel/UCCnEJ1xGXtax28byjvZsBGw",
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
    birthdate: "2003年6月21日",
    height: "173cm",
    weight: "64kg",
    career: [
      "湘南工科大学附属高校",
      "産業能率大学（関東2部リーグ、4年時キャプテン）",
      "U-20関東大学選抜",
      "Honda FC（2026-、JFL）",
    ],
    feature:
      "大学2年時にU-20関東大学選抜に選出された、左右両足を蹴り分けるストライカー。ブラジル大会時は現役大学生だった。2026年からはJFLの名門・Honda FCに加入（背番号26）。",
    researchedProfile: true,
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
    hometown: "埼玉県",
    feature:
      "鴻巣市育ちのアタッカー。2025年にはTomoshibi Tokyoの一員としてFIF7クラブ世界大会（ブラジル）に出場し、ベネズエラ戦で決勝ゴールを記録。「ソサイチ界のスター」と評される実力者。",
    researchedProfile: true,
    career: [
      "鴻巣FC",
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
    birthdate: "1990年1月30日",
    height: "170cm",
    hometown: "千葉県浦安市",
    dominantFoot: "left",
    career: [
      "ジェフユナイテッド千葉ユース",
      "ジェフユナイテッド千葉（2008）",
      "アルビレックス新潟シンガポール（2010-2011）",
      "SC相模原（2014）",
      "シンガポール・タイのクラブ",
      "ブラウブリッツ秋田（2017）",
      "ナガワールドFC（カンボジア、2018-2019）",
      "2019年 現役引退",
    ],
    feature:
      "元Jリーガー。シンガポールSリーグで最優秀若手選手賞（2010）を受賞し、ブラウブリッツ秋田では2017年のJ3優勝を経験。引退後は浦安市でサッカースクール運営会社「TJBCFS」を立ち上げ、約500名の小中学生を指導する。メキシコ大会では1stコーチを務めた。",
    researchedProfile: true,
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
    feature:
      "元JALの旅客機パイロットという異色の経歴の持ち主。退職してスポーツビジネスに転身し、メキシコ大会ではGKコーチを担当。2025年からはGM（チーム統括責任者）としてクラブ運営を支えた。",
    researchedProfile: true,
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
    feature: "メキシコ大会にフィジオセラピストとして帯同した。",
    researchedProfile: true,
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
    feature:
      "CTL medical association 代表理事・CTL medical整体院院長。ソサイチ日本代表のメディカルトレーナーを務め、ELAGUA TOKYOやプラムワンのトレーナーも歴任。東京から沖縄、タイ・バリ島まで国内外で施術を行う。イタリア・フランス両大会にメディカルトレーナーとして帯同した。",
    researchedProfile: true,
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
    birthdate: "1989年7月4日",
    height: "166cm",
    weight: "59kg",
    hometown: "兵庫県",
    career: [
      "FC西神",
      "滝川第二高校",
      "専修大学",
      "ペスカドーラ町田（Fリーグ、2013-2018）",
      "カンピーナ（ブラジル、2022）",
      "ZOTT WASEDA（2023-2024）",
    ],
    feature:
      "ペスカドーラ町田で2016年全日本フットサル選手権優勝を経験し、2017年にはフットサル日本代表合宿に招集された実力者。「FC NAKAI」の設立や全国47都道府県でのクリニック開催など、フットサル界屈指の発信者としても知られる。第2回イタリア大会・第3回フランス大会で監督を務めた。再スタート編では落選メンバーを率いる「レベナンツ（Revenants：亡霊たち）」の監督として、最終セレクションで新生ムラッシュFCと激突した。",
    researchedProfile: true,
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
