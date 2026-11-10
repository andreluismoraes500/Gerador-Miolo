// Galeria de modelos prontos do Mockup Studio.
import { MODELOS_PRONTOS } from "../components/mockup3d/opcoes";
import { novoId } from "./projetos";

const set3d = (id) => MODELOS_PRONTOS.find((m) => m.id === id)?.set || {};

export const MODELOS = [
  { id: "m-fem", nome: "Papelaria feminina", categoria: "Papelaria", tipo: "3d", produto: "Agenda wire-o", desc: "Agenda rosé com wire-o dourado sobre cenário floral.", cores: ["#f4b6c4", "#e9a0b4"], set: { ...set3d("wireo-topo"), disp: "esquerda", corCapa: "#e98aa6", metal: "rose", cena: "floral", cantos: true } },
  { id: "m-min", nome: "Papelaria minimalista", categoria: "Papelaria", tipo: "3d", produto: "Caderno espiral", desc: "Caderno branco com espiral preta, fundo minimalista.", cores: ["#f2f2ee", "#2a2a2e"], set: { ...set3d("espiral"), corCapa: "#f4f4f1", metal: "preto", cena: "minimalista" } },
  { id: "m-corp", nome: "Papelaria corporativa", categoria: "Corporativo", tipo: "3d", produto: "Agenda executiva", desc: "Agenda executiva em couro com elástico, caneta e escritório.", cores: ["#1e293b", "#d4a63c"], set: { ...set3d("executiva"), corCapa: "#1e293b", cena: "escritorio" } },
  { id: "m-plan", nome: "Planner floral", categoria: "Planner", tipo: "3d", produto: "Planner wire-o", desc: "Planner com capa floral, wire-o dourado e fita marcadora.", cores: ["#f8cfd8", "#6aa86f"], set: { ...set3d("wireo-topo"), corCapa: "#f6d3da", cena: "floral", fita: true, corFita: "#c2557a", metal: "dourado" } },
  { id: "m-ele", nome: "Agenda elegante", categoria: "Agenda", tipo: "3d", produto: "Agenda costura", desc: "Capa de linho com costura, hot stamping dourado e mármore.", cores: ["#1f3a33", "#d4a63c"], set: { ...set3d("costura"), corCapa: "#1f3a33", cena: "marmore" } },
  { id: "m-esc", nome: "Caderno escolar", categoria: "Escolar", tipo: "3d", produto: "Caderno espiral", desc: "Caderno espiral colorido para o dia a dia da escola.", cores: ["#3b82f6", "#facc15"], set: { ...set3d("espiral"), corCapa: "#2f6fd0", cena: "papelaria", mioloTipo: "pautado" } },
  { id: "m-kit", nome: "Kit de papelaria", categoria: "Kit", tipo: "2d", produto: "Composição 2D", desc: "Agenda, caderno e acessórios compostos sobre mesa de madeira.", cores: ["#b98a5a", "#1e293b"], comp: "kit" },
  { id: "m-graf", nome: "Produtos para gráficas", categoria: "Gráfica", tipo: "2d", produto: "Composição 2D", desc: "Cartões, bloco e quadro em apresentação para clientes.", cores: ["#e9ebee", "#1e293b"], comp: "grafica" },
];

// Composições 2D prontas (usam produtos/acessórios do editor).
export function composicao2d(id, W, H) {
  const E = (tipo, o) => ({ id: "e" + novoId(), tipo, rotation: 0, opacidade: 1, locked: false, hidden: false, grupo: null, sombra: { on: false, cor: "#000", blur: 18, x: 6, y: 10, op: 0.3 }, ...o });
  const P = (kind, x, y, w, h, cor, rot = 0) => E("produto", { nome: kind, kind, x, y, w, h, cor, moldura: "#1b1d22", capa: null, rotation: rot });
  const A = (acId, nome, x, y, w, h, c, d, rot = 0) => E("acessorio", { nome, acId, c, d, x, y, w, h, rotation: rot, sombra: { on: true, cor: "#000", blur: 14, x: 5, y: 8, op: 0.28 } });
  const T = (texto, x, y, cor) => E("texto", { nome: "Texto", texto, x, y, w: 520, h: 60, fontSize: 52, fonte: "'DM Serif Display', serif", cor, negrito: false, alinhar: "left" });
  const s = W / 1600;
  if (id === "kit") {
    return { cenario: "madeira", elementos: [
      P("agenda", 330 * s, 210 * s, 360 * s, 500 * s, "#1e293b", -6),
      P("caderno", 700 * s, 260 * s, 320 * s, 430 * s, "#c2557a", 5),
      A("caneta", "Caneta", 1060 * s, 220 * s, 46 * s, 330 * s, "#1e3a8a", "#c9a24b", 20),
      A("flor", "Flor", 1040 * s, 620 * s, 170 * s, 170 * s, "#f48fb1", "#f6c453"),
      A("clipe", "Clipe", 280 * s, 150 * s, 50 * s, 120 * s, "#c9a24b", "#fff", -15),
      A("xicara", "Xícara", 180 * s, 640 * s, 230 * s, 195 * s, "#ffffff", "#6b4226"),
    ] };
  }
  if (id === "grafica") {
    return { cenario: "branca", elementos: [
      T("Linha de papelaria", 120 * s, 80 * s, "#1e293b"),
      P("quadro", 120 * s, 200 * s, 320 * s, 430 * s, "#9fb4d4"),
      P("bloco", 520 * s, 240 * s, 300 * s, 400 * s, "#f0b86a", 3),
      P("cartao", 920 * s, 260 * s, 360 * s, 210 * s, "#1e293b", -4),
      P("cartao", 960 * s, 480 * s, 360 * s, 210 * s, "#c9a24b", 3),
      P("caneca", 520 * s, 700 * s, 300 * s, 260 * s, "#ffffff"),
    ] };
  }
  return { cenario: "bege", elementos: [] };
}
