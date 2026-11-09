import { criarStore } from "./storeSimples";

export const stickersDados = criarStore("stickers-dados", { itens: [] });
// Estado de tela (não persiste): editando, sticker "armado" da paleta, selecionado.
export const stickersUi = criarStore("stickers-ui", { editando: false, armado: null, sel: null }, false);

let n = 0;
const novoId = () => `st-${Date.now().toString(36)}-${(n += 1)}`;

export const EMOJIS = [
  "⭐", "🌟", "✨", "❤️", "💛", "💙", "💜", "🧡", "🌸", "🌼", "🌷", "🌻", "🍀", "🌿", "🍃", "🌈",
  "☀️", "🌙", "☁️", "⚡", "🔥", "💧", "🎵", "🎶", "🎨", "✏️", "📌", "📎", "📚", "📝", "✅", "❗",
  "🎀", "🎁", "🎈", "🎉", "🦋", "🐱", "🐶", "🐝", "🐞", "🍓", "🍒", "🍋", "🍰", "☕", "🍵", "🧁",
  "💡", "🔔", "🏆", "💪", "🙏", "😊", "😍", "🥰", "🤩", "😴", "💤", "📅", "⏰", "💰", "✈️", "🏠",
];

export const WASHI = ["#f9a8d4", "#fcd34d", "#86efac", "#93c5fd", "#c4b5fd", "#fdba74", "#fca5a5", "#5eead4"];

export function adicionar(parcial) {
  const item = { id: novoId(), pagina: 0, x: 50, y: 50, tam: 14, rot: 0, tipo: "emoji", v: "⭐", ...parcial };
  stickersDados.set({ itens: [...stickersDados.get().itens, item] });
  return item.id;
}

export function atualizar(id, parcial) {
  stickersDados.set({ itens: stickersDados.get().itens.map((i) => (i.id === id ? { ...i, ...parcial } : i)) });
}

export function remover(id) {
  stickersDados.set({ itens: stickersDados.get().itens.filter((i) => i.id !== id) });
  if (stickersUi.get().sel === id) stickersUi.set({ sel: null });
}

export function limparTudo() {
  stickersDados.set({ itens: [] });
  stickersUi.set({ sel: null });
}

// Copia o sticker para todas as páginas (útil para bordas, fitas e marcas).
export function repetirEmTodas(id, totalPaginas, prefixo = "") {
  const base = stickersDados.get().itens.find((i) => i.id === id);
  if (!base) return;
  const extras = [];
  const chaves = Array.isArray(totalPaginas) ? totalPaginas : Array.from({ length: totalPaginas }, (_, p) => (prefixo ? `${prefixo}${p}` : p));
  for (const chave of chaves) {
    if (chave === base.pagina) continue;
    extras.push({ ...base, id: novoId(), pagina: chave });
  }
  stickersDados.set({ itens: [...stickersDados.get().itens, ...extras] });
}
