const INITIAL_MAP = {
  A: "ア",
  B: "ベ",
  C: "ク",
  D: "デ",
  E: "エ",
  F: "フ",
  G: "グ",
  H: "ハ",
  I: "イ",
  J: "ジ",
  K: "カ",
  L: "ラ",
  M: "マ",
  N: "ナ",
  O: "オ",
  P: "パ",
  Q: "キ",
  R: "ロ",
  S: "サ",
  T: "タ",
  U: "ウ",
  V: "ヴ",
  W: "ワ",
  X: "エックス",
  Y: "ヤ",
  Z: "ゼ",
};

export function getJapaneseInitial(name = "") {
  const initial = name.trim().charAt(0).toUpperCase();

  return INITIAL_MAP[initial] || "和";
}
