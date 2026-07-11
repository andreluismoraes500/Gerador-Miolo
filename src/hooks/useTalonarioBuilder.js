// src/hooks/useTalonarioBuilder.js
//
// Estado e lógica do Talonário: gera talões de Pedido de Venda, vias de
// Receituário e cartões de Receita, com numeração automática, logo,
// marca d'água e impressão em lote. Segue o mesmo espírito de
// useAgendaSettings — um hook único que a página consome via desestruturação.

import { useState, useCallback, useEffect, useMemo, useRef } from "react";

export const TAL_ACCENTS = {
  pedido: { accent: "#0f7a72", dark: "#0a5951", light: "#e4f7f3" },
  receituario: { accent: "#0f6e94", dark: "#0a4e6a", light: "#e3f2f8" },
  receita: { accent: "#c9822c", dark: "#966017", light: "#fbf1df" },
  bingo: { accent: "#7c3aed", dark: "#5b21b6", light: "#f1e9fe" },
};

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
};

export function useTalonarioBuilder() {
  const [activeTab, setActiveTab] = useState("pedido");

  // ---------------- Pedido de Venda ----------------
  const [pedido, setPedido] = useState({
    empresa: "",
    slogan: "",
    numStart: 1,
    numEnd: 50,
    prefix: "",
    digits: 4,
    linhas: 12,
    rodape: "",
    campos: {
      nome: true,
      endereco: true,
      tel: true,
      municipio: true,
      cnpj: true,
      insc: true,
      email: true,
    },
  });
  const setPedidoField = useCallback((key, value) => {
    setPedido((p) => ({ ...p, [key]: value }));
  }, []);
  const togglePedidoCampo = useCallback((key) => {
    setPedido((p) => ({ ...p, campos: { ...p.campos, [key]: !p.campos[key] } }));
  }, []);

  // ---------------- Receituário ----------------
  const [receituario, setReceituario] = useState({
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
  });
  const setReceituarioField = useCallback((key, value) => {
    setReceituario((r) => ({ ...r, [key]: value }));
  }, []);

  // ---------------- Receita culinária ----------------
  // Talão simples: cabeçalho com os dados do prato + pautas em branco
  // (com marcações) para preencher os ingredientes e o modo de preparo à
  // mão — sem campos estruturados de ingrediente/passo.
  const [receita, setReceita] = useState({
    titulo: "",
    categoria: "",
    dificuldade: "Fácil",
    porcoes: "",
    tempoPreparo: "",
    tempoCoccao: "",
    autor: "",
    linhasIngredientes: 6,
    linhasPreparo: 11,
  });
  const setReceitaField = useCallback((key, value) => {
    setReceita((r) => ({ ...r, [key]: value }));
  }, []);

  // ---------------- Bingo ----------------
  const [bingo, setBingo] = useState({
    titulo: "Noite de Bingo",
    subtitulo: "",
    quantidade: 4,
    freeSpace: true,
    porPagina: 4,
  });
  const setBingoField = useCallback((key, value) => {
    setBingo((b) => ({ ...b, [key]: value }));
  }, []);

  const bingoQty = useMemo(() => {
    const n = parseInt(bingo.quantidade, 10) || 1;
    return Math.min(Math.max(n, 1), BINGO_MAX);
  }, [bingo.quantidade]);

  const [bingoCards, setBingoCards] = useState(() =>
    generateBingoCards(4, true),
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
  const [logos, setLogos] = useState({
    pedido: null,
    receituario: null,
    receita: null,
    bingo: null,
  });

  const handleLogoUpload = useCallback(async (who, file) => {
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setLogos((l) => ({ ...l, [who]: dataUrl }));
  }, []);
  const clearLogo = useCallback((who) => {
    setLogos((l) => ({ ...l, [who]: null }));
  }, []);

  // ---------------- Marca d'água ----------------
  const [watermark, setWatermark] = useState({
    on: false,
    type: "text",
    text: "AMOSTRA",
    opacity: 12,
    size: 220,
  });
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
  }, [watermark.on, watermark.type, watermark.text, watermark.opacity, watermark.size, logos, activeTab]);

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

  // ---------------- impressão ----------------
  const [printBatch, setPrintBatch] = useState(null); // { tab, items } | null
  const printTimeoutRef = useRef(null);

  const handlePrint = useCallback(() => {
    if (activeTab === "pedido") {
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
    } else if (activeTab === "bingo") {
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
    pedidoRange,
    receituario.numerar,
    receituarioRange,
    bingoCards,
  ]);

  useEffect(() => {
    if (!printBatch) return;
    printTimeoutRef.current = setTimeout(() => {
      window.print();
      setPrintBatch(null);
    }, 80);
    return () => clearTimeout(printTimeoutRef.current);
  }, [printBatch]);

  return {
    activeTab,
    setActiveTab,
    accents: TAL_ACCENTS[activeTab],

    pedido,
    setPedidoField,
    togglePedidoCampo,
    pedidoRange,

    receituario,
    setReceituarioField,
    receituarioRange,

    receita,
    setReceitaField,

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
