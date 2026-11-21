// Encarte de ofertas: várias ofertas em grade (foto, nome e preço), título, validade e rodapé.
import { criarStore } from "./storeSimples";
import { FONTES_PAR } from "./fontes";

export const PALETAS_ENC = [
  { id: "verao", nome: "Verão", fundo: "#fff6df", titulo: "#2e9b4f", faixa: "#ffcf1a", faixaTxt: "#7a4a00", pill: "#1559b7", preco: "#e30613", rodape: "#e30613", rodapeTxt: "#ffffff" },
  { id: "vermelho", nome: "Vermelhão", fundo: "#e30613", titulo: "#ffd500", faixa: "#ffd500", faixaTxt: "#c4000f", pill: "#0b3d91", preco: "#e30613", rodape: "#8f0a12", rodapeTxt: "#ffffff" },
  { id: "hortifruti", nome: "Hortifruti", fundo: "#2e9b4f", titulo: "#ffffff", faixa: "#ffe14d", faixaTxt: "#1f6b35", pill: "#1f6b35", preco: "#e8431f", rodape: "#1f6b35", rodapeTxt: "#ffffff" },
  { id: "azul", nome: "Azulão", fundo: "#0a6cd6", titulo: "#ffffff", faixa: "#ffd500", faixaTxt: "#0a3d7a", pill: "#0a3d7a", preco: "#e30613", rodape: "#082f5e", rodapeTxt: "#ffffff" },
  { id: "acougue", nome: "Açougue", fundo: "#5a0f1b", titulo: "#ffe9c2", faixa: "#d4a63c", faixaTxt: "#3b0a12", pill: "#8a1d2e", preco: "#8a1d2e", rodape: "#2e0710", rodapeTxt: "#ffe9c2" },
  { id: "laranja", nome: "Relâmpago", fundo: "#ff7a00", titulo: "#ffffff", faixa: "#2b0a5e", faixaTxt: "#ffe14d", pill: "#2b0a5e", preco: "#d6002a", rodape: "#2b0a5e", rodapeTxt: "#ffe14d" },
  { id: "black", nome: "Black Friday", fundo: "#0c0c0c", titulo: "#f4ff3a", faixa: "#f4ff3a", faixaTxt: "#0c0c0c", pill: "#2a2a2a", preco: "#ff2e63", rodape: "#ff2e63", rodapeTxt: "#ffffff" },
  { id: "clean", nome: "Clean", fundo: "#ffffff", titulo: "#111111", faixa: "#e30613", faixaTxt: "#ffffff", pill: "#111111", preco: "#e30613", rodape: "#111111", rodapeTxt: "#ffffff" },
];
export const FONTES_ENC = FONTES_PAR;
export const novoItemEnc = (o = {}) => ({ id: Math.random().toString(36).slice(2, 9), nome: "PRODUTO", preco: "9,99", unid: "kg", de: "", emoji: "", ...o });
const exemplo = [["BANANA PRATA", "3,99", "kg", "🍌"], ["LARANJA PERA", "3,79", "kg", "🍊"], ["LIMÃO TAHITI", "3,49", "kg", "🍋"], ["MELÃO AMARELO", "6,99", "kg", "🍈"], ["ABACATE", "2,99", "un", "🥑"], ["CENOURA", "3,49", "kg", "🥕"], ["ABÓBORA", "2,99", "kg", "🎃"], ["CEBOLA", "1,99", "kg", "🧅"], ["MANGA PALMER", "4,59", "kg", "🥭"], ["TOMATE", "5,99", "kg", "🍅"]];
export const encarteCfg = criarStore("encarte-cfg", {
  paleta: "verao", titulo: "OFERTAS DA SEMANA", fonteTitulo: "'Anton', sans-serif", validade: "Ofertas válidas de 18/11 a 19/11 ou enquanto durarem os estoques",
  mercado: "SUPERMERCADO BOM PREÇO", rodape1: "Compre também pelo WhatsApp: (00) 00000-0000", rodape2: "Rua Exemplo, 123 — Centro", papel: "a4", orient: "retrato",
  cols: 5, maxLinhas: 4, itens: exemplo.map(([nome, preco, unid, emoji]) => novoItemEnc({ nome, preco, unid, emoji })), cores: {},
});
export const encarteFotos = {};
export const encarteLogo = { url: null };
