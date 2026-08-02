// src/hooks/useTalonarioBuilder.js
//
// Estado e lógica do Talonário: gera talões de Pedido de Venda, vias de
// Receituário e cartões de Receita, com numeração automática, logo,
// marca d'água e impressão em lote. Segue o mesmo espírito de
// useAgendaSettings — um hook único que a página consome via desestruturação.

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import toast from "react-hot-toast";
import { usePersistedState } from "./usePersistedState";

// Quando este hook é montado numa aba controlada pelo Puppeteer (geração
// de PDF pelo backend), main.jsx já rodou hydrateFromServer() ANTES do
// React montar e populou window.__TALONARIO_HYDRATE__ com o "retrato" de
// configuração que o usuário tinha na tela dele (ver
// src/utils/talonarioStateSnapshot.js). Cada useState relevante abaixo
// usa esse valor como estado inicial quando disponível — para qualquer
// usuário normal, window.__TALONARIO_HYDRATE__ não existe e o valor
// padrão de sempre é usado normalmente.
function hydrated(key, fallback) {
  if (typeof window !== "undefined" && window.__TALONARIO_HYDRATE__) {
    const h = window.__TALONARIO_HYDRATE__;
    if (h && Object.prototype.hasOwnProperty.call(h, key)) {
      return h[key];
    }
  }
  return fallback;
}

// Paleta padrão de cada aba — usada como ponto de partida e como opção de
// "restaurar cor padrão" nas configurações.
export const TAL_ACCENTS = {
  pedido: { accent: "#0f7a72", dark: "#0a5951", light: "#e4f7f3" },
  receituario: { accent: "#0f6e94", dark: "#0a4e6a", light: "#e3f2f8" },
  receita: { accent: "#c9822c", dark: "#966017", light: "#fbf1df" },
  bingo: { accent: "#7c3aed", dark: "#5b21b6", light: "#f1e9fe" },
  ordemServico: { accent: "#b45309", dark: "#7c3908", light: "#fbead2" },
  recibo: { accent: "#166534", dark: "#0f4a25", light: "#e4f5e9" },
  comanda: { accent: "#9d174d", dark: "#701038", light: "#fbe4ee" },
  reserva: { accent: "#4338ca", dark: "#312a8f", light: "#e7e5fb" },
  valePresente: { accent: "#be123c", dark: "#8b0e2c", light: "#fbe0e6" },
};

// Algumas sugestões de cor rápidas para o seletor de configurações
// (além da cor padrão de cada aba e de um campo de cor livre).
export const TAL_COLOR_PRESETS = [
  "#0f7a72",
  "#0f6e94",
  "#c9822c",
  "#7c3aed",
  "#b23b3b",
  "#2563eb",
  "#15803d",
  "#be185d",
  "#334155",
  "#a16207",
];

function clamp255(n) {
  return Math.max(0, Math.min(255, n));
}

// Deriva as variações "dark" (traço/texto) e "light" (fundo suave) a
// partir de uma única cor-base escolhida pela pessoa nas configurações —
// assim ela só escolhe 1 cor e o resto (badges, bordas, sombra do botão)
// se adapta sozinho, mantendo contraste e legibilidade.
export function deriveAccentShades(hex) {
  const clean = /^#?[0-9a-fA-F]{6}$/.test(hex)
    ? hex.replace("#", "")
    : "0f7a72";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const mix = (amt) => {
    const rr = clamp255(
      Math.round(r + (amt > 0 ? 255 - r : r) * Math.abs(amt)),
    );
    const gg = clamp255(
      Math.round(g + (amt > 0 ? 255 - g : g) * Math.abs(amt)),
    );
    const bb = clamp255(
      Math.round(b + (amt > 0 ? 255 - b : b) * Math.abs(amt)),
    );
    return `#${[rr, gg, bb].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  };

  return {
    accent: `#${clean}`,
    dark: mix(-0.32), // mais escura, para texto/título
    light: mix(0.88), // bem clara, para fundos de badge/hover
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------------- Bingo: sorteio das cartelas ----------------
// Bingo tradicional de 75 bolas: cada coluna sorteia números de uma faixa
// fixa (B 1–15, I 16–30, N 31–45, G 46–60, O 61–75), sem repetição dentro
// da própria coluna/cartela. A coluna N tem espaço livre no centro quando
// a opção está ativa.

export const BINGO_RANGES = {
  B: [1, 15],
  I: [16, 30],
  N: [31, 45],
  G: [46, 60],
  O: [61, 75],
};
export const BINGO_LETTERS = ["B", "I", "N", "G", "O"];

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateBingoCard(freeSpace) {
  const columns = {};
  for (const letter of BINGO_LETTERS) {
    const [min, max] = BINGO_RANGES[letter];
    const pool = [];
    for (let n = min; n <= max; n++) pool.push(n);
    const count = letter === "N" && freeSpace ? 4 : 5;
    columns[letter] = shuffled(pool).slice(0, count);
  }
  if (freeSpace) columns.N.splice(2, 0, null); // espaço livre no centro da cartela
  return columns;
}

function generateBingoCards(qty, freeSpace) {
  return Array.from({ length: qty }, () => generateBingoCard(freeSpace));
}

const BINGO_MAX = 300;

// Quantas cartelas cabem numa folha impressa e como organizá-las em grade
// (colunas × linhas). "1" preenche a folha inteira com uma cartela grande;
// as demais opções colocam as cartelas lado a lado, uma ao lado da outra.
export const BINGO_LAYOUTS = {
  1: { cols: 1, rows: 1 },
  2: { cols: 2, rows: 1 },
  4: { cols: 2, rows: 2 },
  6: { cols: 2, rows: 3 },
  9: { cols: 3, rows: 3 },
};

export function useTalonarioBuilder() {
  const [activeTab, setActiveTab] = useState(() => hydrated("activeTab", "pedido"));

  // ---------------- Cores (configuráveis por aba) ----------------
  // Guardadas no localStorage para não se perder entre visitas. Cada aba
  // (pedido/receituario/receita/bingo) tem sua própria cor de destaque.
  const [accentColorsRaw, setAccentColors] = usePersistedState(
    "talonario-accentColors",
    TAL_ACCENTS,
  );
  // Mescla com os padrões atuais: se o usuário já tinha dados salvos de uma
  // versão anterior do app (sem alguma aba nova, ex: "ordemServico"), a
  // chave que falta não fica `undefined` — cai no padrão dessa aba.
  const accentColors = useMemo(
    () => ({ ...TAL_ACCENTS, ...accentColorsRaw }),
    [accentColorsRaw],
  );
  const setAccentColor = useCallback(
    (tab, hex) => {
      setAccentColors((prev) => ({ ...prev, [tab]: deriveAccentShades(hex) }));
    },
    [setAccentColors],
  );
  const resetAccentColor = useCallback(
    (tab) => {
      setAccentColors((prev) => ({ ...prev, [tab]: TAL_ACCENTS[tab] }));
    },
    [setAccentColors],
  );

  // ---------------- Pedido de Venda ----------------
  const [pedido, setPedido] = useState(() =>
    hydrated("pedido", {
      empresa: "",
      slogan: "",
      numStart: 1,
      numEnd: 50,
      prefix: "",
      digits: 4,
      linhas: 12,
      rodape: "",
      numerar: true, // <-- NOVO: controla se deve numerar
      campos: {
        nome: true,
        endereco: true,
        tel: true,
        municipio: true,
        cnpj: true,
        insc: true,
        email: true,
      },
    }),
  );
  const setPedidoField = useCallback((key, value) => {
    setPedido((p) => ({ ...p, [key]: value }));
  }, []);
  const togglePedidoCampo = useCallback((key) => {
    setPedido((p) => ({
      ...p,
      campos: { ...p.campos, [key]: !p.campos[key] },
    }));
  }, []);

  // ---------------- Receituário ----------------
  const [receituario, setReceituario] = useState(() =>
    hydrated("receituario", {
      clinica: "",
      profissional: "",
      registro: "",
      especialidade: "",
      endereco: "",
      telefone: "",
      email: "",
      linhas: 9,
      numerar: false,
      numStart: 1,
      numEnd: 50,
    }),
  );
  const setReceituarioField = useCallback((key, value) => {
    setReceituario((r) => ({ ...r, [key]: value }));
  }, []);

  // ---------------- Receita culinária ----------------
  const [receita, setReceita] = useState(() =>
    hydrated("receita", {
      titulo: "",
      categoria: "",
      dificuldade: "Fácil",
      porcoes: "",
      tempoPreparo: "",
      tempoCoccao: "",
      autor: "",
      linhasIngredientes: 6,
      linhasPreparo: 11,
    }),
  );
  const setReceitaField = useCallback((key, value) => {
    setReceita((r) => ({ ...r, [key]: value }));
  }, []);

  // ---------------- Ordem de Serviço ----------------
  const [ordemServico, setOrdemServico] = useState(() =>
    hydrated("ordemServico", {
      empresa: "",
      slogan: "",
      numStart: 1,
      numEnd: 50,
      prefix: "OS-",
      digits: 4,
      prazo: "",
      garantia: "90 dias",
      rodape: "",
      numerar: true, // <-- NOVO
    }),
  );
  const setOrdemServicoField = useCallback((key, value) => {
    setOrdemServico((o) => ({ ...o, [key]: value }));
  }, []);

  // ---------------- Recibo de Pagamento ----------------
  const [recibo, setRecibo] = useState(() =>
    hydrated("recibo", {
      empresa: "",
      slogan: "",
      numStart: 1,
      numEnd: 50,
      prefix: "REC-",
      digits: 4,
      referenteA: "",
      rodape: "",
      numerar: true, // <-- NOVO
    }),
  );
  const setReciboField = useCallback((key, value) => {
    setRecibo((r) => ({ ...r, [key]: value }));
  }, []);

  // ---------------- Comandas ----------------
  const [comanda, setComanda] = useState(() =>
    hydrated("comanda", {
      empresa: "",
      slogan: "",
      numStart: 1,
      numEnd: 100,
      prefix: "",
      digits: 3,
      linhas: 10,
      rodape: "",
      numerar: true, // <-- NOVO
    }),
  );
  const setComandaField = useCallback((key, value) => {
    setComanda((c) => ({ ...c, [key]: value }));
  }, []);

  // ---------------- Reserva / Agendamento ----------------
  const [reserva, setReserva] = useState(() =>
    hydrated("reserva", {
      empresa: "",
      slogan: "",
      numStart: 1,
      numEnd: 50,
      prefix: "",
      digits: 3,
      politica: "",
      rodape: "",
      numerar: true, // <-- NOVO
    }),
  );
  const setReservaField = useCallback((key, value) => {
    setReserva((r) => ({ ...r, [key]: value }));
  }, []);

  // ---------------- Vale-Presente / Voucher ----------------
  const [valePresente, setValePresente] = useState(() =>
    hydrated("valePresente", {
      empresa: "",
      slogan: "",
      numStart: 1,
      numEnd: 50,
      prefix: "VP-",
      digits: 4,
      validade: "",
      mensagemPadrao: "",
      numerar: true, // <-- NOVO
    }),
  );
  const setValePresenteField = useCallback((key, value) => {
    setValePresente((v) => ({ ...v, [key]: value }));
  }, []);

  // ---------------- Bingo ----------------
  const [bingo, setBingo] = useState(() =>
    hydrated("bingo", {
      titulo: "Noite de Bingo",
      subtitulo: "",
      quantidade: 4,
      freeSpace: true,
      porPagina: 4,
      numerar: true, // <-- NOVO
    }),
  );
  const setBingoField = useCallback((key, value) => {
    setBingo((b) => ({ ...b, [key]: value }));
  }, []);

  const bingoQty = useMemo(() => {
    const n = parseInt(bingo.quantidade, 10) || 1;
    return Math.min(Math.max(n, 1), BINGO_MAX);
  }, [bingo.quantidade]);

  const [bingoCards, setBingoCards] = useState(() =>
    hydrated("bingoCards", generateBingoCards(4, true)),
  );

  // Ajusta a quantidade de cartelas geradas sem re-sortear as que já
  // existem (só sorteia as que faltam, ou descarta as excedentes).
  useEffect(() => {
    setBingoCards((prev) => {
      if (prev.length === bingoQty) return prev;
      if (prev.length < bingoQty) {
        return [
          ...prev,
          ...generateBingoCards(bingoQty - prev.length, bingo.freeSpace),
        ];
      }
      return prev.slice(0, bingoQty);
    });
  }, [bingoQty, bingo.freeSpace]);

  const regenerateBingo = useCallback(() => {
    setBingoCards(generateBingoCards(bingoQty, bingo.freeSpace));
  }, [bingoQty, bingo.freeSpace]);

  // ---------------- Logos ----------------
  const [logos, setLogos] = useState(() =>
    hydrated("logos", {
      pedido: null,
      receituario: null,
      receita: null,
      bingo: null,
      ordemServico: null,
      recibo: null,
      comanda: null,
      reserva: null,
      valePresente: null,
    }),
  );

  const handleLogoUpload = useCallback(async (who, file) => {
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setLogos((l) => ({ ...l, [who]: dataUrl }));
    } catch (err) {
      console.error("[useTalonarioBuilder] Erro ao ler logo:", err);
      toast.error("Não foi possível carregar essa imagem.");
    }
  }, []);
  const clearLogo = useCallback((who) => {
    setLogos((l) => ({ ...l, [who]: null }));
  }, []);

  // ---------------- Marca d'água ----------------
  const [watermark, setWatermark] = useState(() =>
    hydrated("watermark", {
      on: false,
      type: "text",
      text: "AMOSTRA",
      opacity: 12,
      size: 220,
    }),
  );
  const setWatermarkField = useCallback((key, value) => {
    setWatermark((w) => ({ ...w, [key]: value }));
  }, []);

  const [wmTileUrl, setWmTileUrl] = useState(null);
  useEffect(() => {
    let cancelled = false;
    if (!watermark.on) {
      setWmTileUrl(null);
      return;
    }
    const size = watermark.size;
    const opacity = watermark.opacity / 100;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.translate(size / 2, size / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.translate(-size / 2, -size / 2);
    ctx.globalAlpha = opacity;

    const finish = () => {
      if (!cancelled) setWmTileUrl(canvas.toDataURL());
    };

    if (watermark.type === "logo" && logos[activeTab]) {
      const img = new Image();
      img.onload = () => {
        const w = size * 0.6;
        const h = w * (img.height / img.width);
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
        finish();
      };
      img.src = logos[activeTab];
    } else {
      ctx.fillStyle = "#000";
      ctx.font = `700 ${Math.round(size * 0.13)}px 'Cormorant Garamond', serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(watermark.text || "AMOSTRA", size / 2, size / 2);
      finish();
    }
    return () => {
      cancelled = true;
    };
  }, [
    watermark.on,
    watermark.type,
    watermark.text,
    watermark.opacity,
    watermark.size,
    logos,
    activeTab,
  ]);

  const watermarkStyle = useMemo(() => {
    if (!watermark.on || !wmTileUrl) return null;
    return {
      backgroundImage: `url(${wmTileUrl})`,
      backgroundSize: `${watermark.size}px ${watermark.size}px`,
    };
  }, [watermark.on, wmTileUrl, watermark.size]);

  // ---------------- numeração ----------------
  const pedidoRange = useMemo(() => {
    let start = parseInt(pedido.numStart, 10) || 1;
    let end = parseInt(pedido.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [pedido.numStart, pedido.numEnd]);

  const receituarioRange = useMemo(() => {
    let start = parseInt(receituario.numStart, 10) || 1;
    let end = parseInt(receituario.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [receituario.numStart, receituario.numEnd]);

  const ordemServicoRange = useMemo(() => {
    let start = parseInt(ordemServico.numStart, 10) || 1;
    let end = parseInt(ordemServico.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [ordemServico.numStart, ordemServico.numEnd]);

  const reciboRange = useMemo(() => {
    let start = parseInt(recibo.numStart, 10) || 1;
    let end = parseInt(recibo.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [recibo.numStart, recibo.numEnd]);

  const comandaRange = useMemo(() => {
    let start = parseInt(comanda.numStart, 10) || 1;
    let end = parseInt(comanda.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [comanda.numStart, comanda.numEnd]);

  const reservaRange = useMemo(() => {
    let start = parseInt(reserva.numStart, 10) || 1;
    let end = parseInt(reserva.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [reserva.numStart, reserva.numEnd]);

  const valePresenteRange = useMemo(() => {
    let start = parseInt(valePresente.numStart, 10) || 1;
    let end = parseInt(valePresente.numEnd, 10) || start;
    if (end < start) [start, end] = [end, start];
    return { start, end, total: end - start + 1 };
  }, [valePresente.numStart, valePresente.numEnd]);

  // ---------------- impressão ----------------
  const [printBatch, setPrintBatch] = useState(null); // { tab, items } | null
  const printTimeoutRef = useRef(null);

  const handlePrint = useCallback(() => {
    if (activeTab === "pedido") {
      if (!pedido.numerar) {
        setPrintBatch({ tab: "pedido", items: [null] });
        return;
      }
      const { start, end, total } = pedidoRange;
      if (
        total > 800 &&
        !window.confirm(
          `Você está prestes a gerar ${total} páginas. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      const items = Array.from({ length: total }, (_, i) => start + i);
      setPrintBatch({ tab: "pedido", items });
    } else if (activeTab === "receituario") {
      if (receituario.numerar) {
        const { start, end, total } = receituarioRange;
        if (
          total > 800 &&
          !window.confirm(
            `Você está prestes a gerar ${total} vias. Isso pode demorar. Deseja continuar?`,
          )
        ) {
          return;
        }
        const items = Array.from({ length: total }, (_, i) => start + i);
        setPrintBatch({ tab: "receituario", items });
      } else {
        setPrintBatch({ tab: "receituario", items: [null] });
      }
    } else if (activeTab === "receita") {
      setPrintBatch({ tab: "receita", items: [null] });
    } else if (activeTab === "ordemServico") {
      if (!ordemServico.numerar) {
        setPrintBatch({ tab: "ordemServico", items: [null] });
        return;
      }
      const { start, end, total } = ordemServicoRange;
      if (
        total > 800 &&
        !window.confirm(
          `Você está prestes a gerar ${total} ordens de serviço. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      const items = Array.from({ length: total }, (_, i) => start + i);
      setPrintBatch({ tab: "ordemServico", items });
    } else if (activeTab === "recibo") {
      if (!recibo.numerar) {
        setPrintBatch({ tab: "recibo", items: [null] });
        return;
      }
      const { start, end, total } = reciboRange;
      if (
        total > 800 &&
        !window.confirm(
          `Você está prestes a gerar ${total} recibos. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      setPrintBatch({
        tab: "recibo",
        items: Array.from({ length: total }, (_, i) => start + i),
      });
    } else if (activeTab === "comanda") {
      if (!comanda.numerar) {
        setPrintBatch({ tab: "comanda", items: [null] });
        return;
      }
      const { start, end, total } = comandaRange;
      if (
        total > 800 &&
        !window.confirm(
          `Você está prestes a gerar ${total} comandas. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      setPrintBatch({
        tab: "comanda",
        items: Array.from({ length: total }, (_, i) => start + i),
      });
    } else if (activeTab === "reserva") {
      if (!reserva.numerar) {
        setPrintBatch({ tab: "reserva", items: [null] });
        return;
      }
      const { start, end, total } = reservaRange;
      if (
        total > 800 &&
        !window.confirm(
          `Você está prestes a gerar ${total} fichas de reserva. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      setPrintBatch({
        tab: "reserva",
        items: Array.from({ length: total }, (_, i) => start + i),
      });
    } else if (activeTab === "valePresente") {
      if (!valePresente.numerar) {
        setPrintBatch({ tab: "valePresente", items: [null] });
        return;
      }
      const { start, end, total } = valePresenteRange;
      if (
        total > 800 &&
        !window.confirm(
          `Você está prestes a gerar ${total} vale-presentes. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      setPrintBatch({
        tab: "valePresente",
        items: Array.from({ length: total }, (_, i) => start + i),
      });
    } else if (activeTab === "bingo") {
      if (!bingo.numerar) {
        setPrintBatch({ tab: "bingo", items: bingoCards.map(() => null) });
        return;
      }
      if (
        bingoCards.length > 100 &&
        !window.confirm(
          `Você está prestes a gerar ${bingoCards.length} cartelas. Isso pode demorar. Deseja continuar?`,
        )
      ) {
        return;
      }
      setPrintBatch({ tab: "bingo", items: bingoCards });
    }
  }, [
    activeTab,
    pedido.numerar,
    pedidoRange,
    receituario.numerar,
    receituarioRange,
    ordemServico.numerar,
    ordemServicoRange,
    recibo.numerar,
    reciboRange,
    comanda.numerar,
    comandaRange,
    reserva.numerar,
    reservaRange,
    valePresente.numerar,
    valePresenteRange,
    bingo.numerar,
    bingoCards,
  ]);

  useEffect(() => {
    if (!printBatch) return;
    // No modo backend (Puppeteer gerando PDF via fila), window.__PDF_HEADLESS__
    // foi setado por hydrateFromServer(). Não chamamos window.print() (não
    // existe diálogo de impressão real ali) nem limpamos o printBatch — o
    // conteúdo precisa continuar no DOM até o Puppeteer terminar de gerar
    // o PDF (ver usePdfReadySignal em TalonarioPage.jsx).
    if (typeof window !== "undefined" && window.__PDF_HEADLESS__) return;
    printTimeoutRef.current = setTimeout(() => {
      window.print();
      setPrintBatch(null);
    }, 80);
    return () => clearTimeout(printTimeoutRef.current);
  }, [printBatch]);

  return {
    activeTab,
    setActiveTab,
    accents: accentColors[activeTab] || TAL_ACCENTS[activeTab],
    accentColors,
    setAccentColor,
    resetAccentColor,

    pedido,
    setPedidoField,
    togglePedidoCampo,
    pedidoRange,

    receituario,
    setReceituarioField,
    receituarioRange,

    receita,
    setReceitaField,

    ordemServico,
    setOrdemServicoField,
    ordemServicoRange,

    recibo,
    setReciboField,
    reciboRange,

    comanda,
    setComandaField,
    comandaRange,

    reserva,
    setReservaField,
    reservaRange,

    valePresente,
    setValePresenteField,
    valePresenteRange,

    bingo,
    setBingoField,
    bingoCards,
    bingoQty,
    regenerateBingo,

    logos,
    handleLogoUpload,
    clearLogo,

    watermark,
    setWatermarkField,
    watermarkStyle,

    printBatch,
    handlePrint,
  };
}