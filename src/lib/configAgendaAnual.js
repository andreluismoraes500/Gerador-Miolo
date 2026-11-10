// Agenda Anual Completa: estilos (Clássica / Pop Color / Planner), calendário
// do ano escolhido, semanas, feriados e a lista de páginas.
import { criarStore } from "./storeSimples";
import { feriadosDoAno } from "./configDevocional";

export const ESTILOS = {
  classica: { nome: "Clássica (hora a hora)", cor: "#e0a800", semana: 0 },
  pop: { nome: "Pop Color", cor: "#ff5d8f", semana: 0 },
  planner: { nome: "Planner semanal e mensal", cor: "#6f86b5", semana: 1 },
};

const ANO = new Date().getFullYear();

export const agendaAnualCfg = criarStore("agenda-anual-cfg", {
  estilo: "classica",
  ano: ANO + (new Date().getMonth() >= 9 ? 1 : 0),
  cor: "#e0a800",
  fonteTitulo: "'DM Serif Display', serif",
  semanaComeca: 0, // 0 = domingo, 1 = segunda
  diasPorPagina: 1, // 1 ou 2 (clássica / pop)
  horaIni: 7,
  horaFim: 19,
  mesesContinuos: false,
  anotacoesMes: true,
  dados: true,
  calendarios: 2,
  planejamentoAnual: true,
  anotacoesIni: 1,
  extrasPlanner: true,
  contatos: 3,
  anotacoesFim: 2,
});

/* ---------- nomes ---------- */
export const DIAS_PT = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
export const DIAS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export const DIAS_ES = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const MESES_PT = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
export const MESES_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const MESES_ES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export const INICIAIS = ["D", "S", "T", "Q", "Q", "S", "S"];

export const dois = (n) => String(n).padStart(2, "0");

export function mix(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = (v) => Math.round(v + (255 - v) * f).toString(16).padStart(2, "0");
  return `#${c((n >> 16) & 255)}${c((n >> 8) & 255)}${c(n & 255)}`;
}

export function diaDoAno(d) {
  return Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - new Date(d.getFullYear(), 0, 1)) / 86400000) + 1;
}
// Semana do ano começando no domingo (ou segunda), como nas agendas impressas.
export function semanaDoAno(d, inicio = 0) {
  const j1 = new Date(d.getFullYear(), 0, 1).getDay();
  const off = (j1 - inicio + 7) % 7;
  return Math.floor((diaDoAno(d) - 1 + off) / 7) + 1;
}

// Células do mês (null = vazio), semana começando em `inicio`.
export function celulasMes(ano, mes, inicio = 0) {
  const prim = (new Date(ano, mes, 1).getDay() - inicio + 7) % 7;
  const total = new Date(ano, mes + 1, 0).getDate();
  const cel = Array(prim).fill(null).concat(Array.from({ length: total }, (_, i) => i + 1));
  while (cel.length % 7 || cel.length < 35) cel.push(null);
  return cel;
}
export const cabecalhoSemana = (inicio) => Array.from({ length: 7 }, (_, i) => INICIAIS[(i + inicio) % 7]);

export function mapaFeriados(ano) {
  const m = {};
  feriadosDoAno(ano).forEach((f) => { m[`${f.mes}-${f.dia}`] = f.nome; });
  return m;
}

/* ---------- lista de páginas ---------- */
const diasDoMes = (ano, mes) => new Date(ano, mes + 1, 0).getDate();

export function montarPaginasAnual(cfg) {
  const { ano, estilo } = cfg;
  const p = [{ tipo: "capa" }];
  if (cfg.dados) p.push({ tipo: "dados" });
  for (let i = 0; i < cfg.calendarios; i += 1) p.push({ tipo: "calendarios", ano: ano + i });
  if (cfg.planejamentoAnual) {
    if (estilo === "planner") for (let i = 0; i < 4; i += 1) p.push({ tipo: "planAnualLista", parte: i });
    else for (let i = 0; i < 2; i += 1) p.push({ tipo: "planAnual", parte: i });
  }
  for (let i = 0; i < cfg.anotacoesIni; i += 1) p.push({ tipo: "anotacoes" });

  if (estilo === "planner") {
    if (cfg.extrasPlanner) {
      ["roda", "desejos", "objetivos1", "objetivos2", "objetivos3", "logins1", "logins2", "livros", "filmes", "viagens1", "viagens2", "consultas", "registros"].forEach((t) => p.push({ tipo: t }));
    }
    for (let m = 0; m < 12; m += 1) {
      p.push({ tipo: "mesObjetivos", mes: m });
      p.push({ tipo: "mesPlanejamento", mes: m });
      p.push({ tipo: "mesFinanceiro", mes: m });
      p.push({ tipo: "mesBalanco", mes: m });
      // semanas (seg-dom) cuja quinta cai no mês; janeiro inclui a semana do dia 1º
      let seg = new Date(ano, m, 1);
      seg.setDate(seg.getDate() - ((seg.getDay() + 6) % 7));
      for (let k = 0; k < 7; k += 1) {
        const qui = new Date(seg); qui.setDate(qui.getDate() + 3);
        if (qui.getFullYear() === ano && qui.getMonth() === m) {
          p.push({ tipo: "semanaA", seg: seg.getTime(), mes: m });
          p.push({ tipo: "semanaB", seg: seg.getTime(), mes: m });
        } else if (m === 0 && k === 0 && qui.getFullYear() < ano) {
          p.push({ tipo: "semanaA", seg: seg.getTime(), mes: m });
          p.push({ tipo: "semanaB", seg: seg.getTime(), mes: m });
        }
        seg = new Date(seg); seg.setDate(seg.getDate() + 7);
        if (qui.getFullYear() > ano || (qui.getFullYear() === ano && qui.getMonth() > m)) break;
      }
      p.push({ tipo: "mesReflexao", mes: m });
      p.push({ tipo: "anotacoes", estilo: "pontilhado" });
    }
  } else {
    const porPag = cfg.diasPorPagina === 2 ? 2 : 1;
    let pendente = [];
    const fecha = () => {
      while (pendente.length) {
        const grupo = pendente.splice(0, porPag);
        while (grupo.length < porPag) grupo.push(null);
        p.push({ tipo: "dia", dias: grupo.map((t) => (t === null ? null : t)) });
      }
    };
    for (let m = 0; m < 12; m += 1) {
      for (let d = 1; d <= diasDoMes(ano, m); d += 1) pendente.push(new Date(ano, m, d).getTime());
      if (!cfg.mesesContinuos) fecha();
      else while (pendente.length >= porPag) { const g = pendente.splice(0, porPag); p.push({ tipo: "dia", dias: g }); }
      if (cfg.anotacoesMes && m < 11) { if (cfg.mesesContinuos) fecha(); p.push({ tipo: "anotacoes" }); }
    }
    fecha();
  }
  if (estilo === "pop") for (let i = 0; i < cfg.contatos; i += 1) p.push({ tipo: "contatos" });
  for (let i = 0; i < cfg.anotacoesFim; i += 1) p.push({ tipo: "anotacoes" });
  return p;
}
