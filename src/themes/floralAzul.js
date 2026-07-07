// src/themes/floralAzul.js
//
// Tema usado pela DiarioFloralLayout — paleta azul/aquarela + selo dourado,
// igual à referência (flores azuis nos cantos, número do dia em dourado).

export default {
  nome: "Floral Azul",
  border: "border-sky-100",
  text: "text-sky-800",
  headerBorder: "border-sky-200",
  bgLight: "bg-sky-50/40",
  sabado: "text-sky-700 bg-sky-100/40",
  headingFont: "font-serif italic",
  bodyFont: "font-sans",
  cardBg: "bg-white",
  accent: "text-sky-600",
  button: "bg-sky-700 hover:bg-sky-600 text-white",
  colors: {
    primary: "#3a6a86",
    secondary: "#e4ecef",
    background: "#ffffff",
    badge: "#e3c184",
  },
  // Paleta usada pelo componente <FloralCorner /> — pode ser
  // sobrescrita por customColors.floralPalette se você quiser
  // gerar variações (rosa, verde-sálvia, terracota, etc.).
  floralPalette: {
    petalDark: "#4c7d96",
    petalMid: "#89b7cd",
    petalLight: "#c7e0ea",
    petalHighlight: "#f0f7fa",
    leafDark: "#5c7a5a",
    leafMid: "#8dab84",
    leafLight: "#cfe0c6",
  },
};
