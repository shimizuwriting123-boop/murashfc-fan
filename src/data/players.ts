export type Position = "GK" | "DF" | "MF" | "FW";
export type PlayerStatus = "current";

export interface Player {
  name: string;
  position: Position;
  number: number;
  status: PlayerStatus;
}

// ポジション・背番号は仮置き（あとで修正予定）。
export const players: Player[] = [
  { name: "横山航河", position: "GK", number: 1, status: "current" },
  { name: "宮内俊輔", position: "DF", number: 2, status: "current" },
  { name: "木戸皓貴", position: "DF", number: 3, status: "current" },
  { name: "箱崎裕也", position: "DF", number: 4, status: "current" },
  { name: "縣翔平", position: "DF", number: 5, status: "current" },
  { name: "中村駿介", position: "MF", number: 6, status: "current" },
  { name: "梅津怜央", position: "MF", number: 7, status: "current" },
  { name: "小田崚平", position: "MF", number: 8, status: "current" },
  { name: "江川雅信", position: "MF", number: 9, status: "current" },
  { name: "林田大和", position: "FW", number: 10, status: "current" },
  { name: "宮下豪也", position: "FW", number: 11, status: "current" },
  { name: "白石郁哉", position: "FW", number: 12, status: "current" },
  { name: "重信圭佑", position: "MF", number: 13, status: "current" },
  { name: "谷田光", position: "MF", number: 14, status: "current" },
  { name: "児玉剛", position: "FW", number: 15, status: "current" },
  { name: "深谷圭佑", position: "GK", number: 16, status: "current" },
];
