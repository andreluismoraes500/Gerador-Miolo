// src/hooks/usePdfExport.js
//
// Exportação para PDF via jsPDF nativo — sem screenshot, sem DOM capture.
// Desenha o layout DiaCompleto diretamente em coordenadas PDF (mm).
// Para templates de página única usa html-to-image como fallback.
// Resultado: ~2s para mensal, ~5s para anual completo.

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getFeriado, getComemorativa, gerarHorarios } from "../utils/agendaUtils";

// ─── Dimensões A4 ────────────────────────────────────────────────────────────
const PW = 210; // largura página mm
const PH = 297; // altura página mm

// Margens (wire-o à esquerda)
const ML = 22;  // left (encadernação)
const MR = 12;  // right
const MT = 15;  // top
const MB = 12;  // bottom

const CW = PW - ML - MR;  // largura útil
const CH = PH - MT - MB;  // altura útil

const HORARIOS = gerarHorarios(); // ["07:00","07:30",..."20:00"]

const DIAS_SEMANA = ["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"];
const MESES = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];

// Colunas da tabela como frações de CW
const COLS = [
  { label: "Hora",     frac: 0.12 },
  { label: "Cliente",  frac: 0.34 },
  { label: "Serviço",  frac: 0.30 },
  { label: "Dinheiro", frac: 0.08 },
  { label: "Cartão",   frac: 0.08 },
  { label: "Pix",      frac: 0.08 },
];

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0,2),16),
    parseInt(h.substring(2,4),16),
    parseInt(h.substring(4,6),16),
  ];
}

/**
 * Desenha uma página DiaCompleto no jsPDF.
 */
function drawDiaCompleto(pdf, data, opts) {
  const {
    primaryColor   = "#475569",
    secondaryColor = "#cbd5e1",
    bgColor        = "#ffffff",
    footerName     = "",
    perfilNome     = "",
    clienteLabel   = "Cliente",
    servicoLabel   = "Serviço",
  } = opts;

  const [pr, pg, pb] = hexToRgb(primaryColor);
  const [sr, sg, sb] = hexToRgb(secondaryColor);
  const [br, bg_, bb] = hexToRgb(bgColor);

  // Fundo
  pdf.setFillColor(br, bg_, bb);
  pdf.rect(0, 0, PW, PH, "F");

  // ── Cabeçalho ──────────────────────────────────────────────────────────────
  const feriado    = getFeriado(data);
  const comem      = getComemorativa(data);
  const diaSemana  = DIAS_SEMANA[data.getDay()];
  const mesAno     = `${MESES[data.getMonth()]} de ${data.getFullYear()}`;
  const diaNum     = String(data.getDate()).padStart(2, "0");

  // Linha do cabeçalho
  pdf.setDrawColor(pr, pg, pb);
  pdf.setLineWidth(0.6);
  pdf.line(ML, MT + 12, PW - MR, MT + 12);

  // Perfil nome (pequeno, acima do dia da semana)
  if (perfilNome) {
    pdf.setFontSize(6.5);
    pdf.setTextColor(pr, pg, pb);
    pdf.text(perfilNome, ML, MT + 4);
  }

  // Dia da semana
  pdf.setFontSize(12);
  pdf.setFont("helvetica","bold");
  pdf.setTextColor(pr, pg, pb);
  pdf.text(diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1), ML, MT + 9);

  // Mês/ano
  pdf.setFontSize(7);
  pdf.setFont("helvetica","normal");
  pdf.setTextColor(150, 150, 150);
  pdf.text(mesAno.toUpperCase(), ML, MT + 12.5);

  // Número do dia (grande, direita)
  pdf.setFontSize(32);
  pdf.setFont("helvetica","light");
  pdf.setTextColor(20, 20, 20);
  pdf.text(diaNum, PW - MR - 18, MT + 11, { align: "right" });

  // Feriado ou data comemorativa
  if (feriado) {
    pdf.setFontSize(6);
    pdf.setFont("helvetica","bold");
    pdf.setTextColor(pr, pg, pb);
    pdf.text(`★ ${feriado.nome}`, PW - MR - 20, MT + 4);
  } else if (comem) {
    pdf.setFontSize(6);
    pdf.setFont("helvetica","normal");
    pdf.setTextColor(150, 150, 150);
    pdf.text(comem, PW - MR - 20, MT + 4);
  }

  // ── Tabela ─────────────────────────────────────────────────────────────────
  const tableTop    = MT + 15;
  const headerH     = 5;
  const rowH        = (CH - 15 - headerH - 8) / HORARIOS.length; // 8 = footer

  // Larguras reais das colunas
  const colWidths = COLS.map(c => c.frac * CW);

  // Cabeçalho das colunas
  pdf.setFontSize(6.5);
  pdf.setFont("helvetica","bold");
  pdf.setTextColor(pr, pg, pb);
  pdf.setDrawColor(pr, pg, pb);
  pdf.setLineWidth(0.5);

  // Linha abaixo do header
  pdf.line(ML, tableTop + headerH, PW - MR, tableTop + headerH);

  const labels = [COLS[0].label, clienteLabel, servicoLabel, ...COLS.slice(3).map(c=>c.label)];
  let cx = ML;
  colWidths.forEach((w, i) => {
    const lbl = labels[i].toUpperCase();
    pdf.text(lbl, cx + w / 2, tableTop + headerH - 1, { align: "center" });
    if (i < colWidths.length - 1) {
      pdf.setDrawColor(sr, sg, sb);
      pdf.setLineWidth(0.2);
      pdf.line(cx + w, tableTop, cx + w, tableTop + headerH);
    }
    cx += w;
  });

  // Linhas de dados
  pdf.setLineWidth(0.15);
  HORARIOS.forEach((hora, i) => {
    const ry = tableTop + headerH + i * rowH;

    // Linha separadora horizontal
    pdf.setDrawColor(sr, sg, sb);
    pdf.line(ML, ry + rowH, PW - MR, ry + rowH);

    // Hora
    pdf.setFont("helvetica","bold");
    pdf.setFontSize(7.5);
    pdf.setTextColor(20, 20, 20);
    pdf.text(hora, ML + 1, ry + rowH * 0.65);

    // Separadores verticais das colunas
    cx = ML;
    colWidths.forEach((w, ci) => {
      if (ci < colWidths.length - 1) {
        pdf.setDrawColor(sr, sg, sb);
        pdf.line(cx + w, ry, cx + w, ry + rowH);
      }
      cx += w;
    });

    // Checkboxes nas últimas 3 colunas (Dinheiro, Cartão, Pix)
    const checkSize = 2.2;
    [3, 4, 5].forEach((ci) => {
      const bx = ML + colWidths.slice(0,ci).reduce((a,b)=>a+b,0) + colWidths[ci]/2 - checkSize/2;
      const by = ry + rowH/2 - checkSize/2;
      pdf.setDrawColor(sr, sg, sb);
      pdf.setLineWidth(0.2);
      pdf.rect(bx, by, checkSize, checkSize);
    });
  });

  // ── Rodapé ─────────────────────────────────────────────────────────────────
  const fy = PH - MB;
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineWidth(0.2);
  pdf.line(ML, fy - 4, PW - MR, fy - 4);

  pdf.setFontSize(6);
  pdf.setFont("helvetica","normal");
  pdf.setTextColor(150, 150, 150);
  pdf.text("DESENHO DE MIOLO POR:", ML, fy - 1);

  if (footerName) {
    pdf.setFont("helvetica","bold");
    pdf.setTextColor(pr, pg, pb);
    pdf.text(footerName, ML + 28, fy - 1);
  }
}

// ─── Fallback: captura via html-to-image (páginas únicas / outros layouts) ──

async function captureViaImage(el, toPng) {
  const prev = {
    paddingTop:    el.style.paddingTop,
    paddingBottom: el.style.paddingBottom,
    paddingLeft:   el.style.paddingLeft,
    paddingRight:  el.style.paddingRight,
  };
  el.style.paddingTop    = "15mm";
  el.style.paddingBottom = "12mm";
  el.style.paddingLeft   = "22mm";
  el.style.paddingRight  = "12mm";

  const fontEmbedCSS = [...document.styleSheets].reduce((acc, sheet) => {
    try {
      return acc + [...sheet.cssRules]
        .filter(r => r instanceof CSSFontFaceRule)
        .map(r => r.cssText).join("\n");
    } catch { return acc; }
  }, "");

  const dataUrl = await toPng(el, {
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    fontEmbedCSS,
  });

  Object.assign(el.style, prev);
  return dataUrl;
}

// ─── Hook principal ──────────────────────────────────────────────────────────

async function loadLibraries(needImage) {
  const libs = [import("jspdf")];
  if (needImage) libs.push(import("html-to-image"));
  const results = await Promise.all(libs);
  return {
    jsPDF:  results[0].default,
    toPng:  needImage ? results[1].toPng : null,
  };
}

/**
 * Detecta se um template é composto só por DiaCompleto
 * (mensalCompleto e anualCompleto) checando o template selecionado.
 */
function isDiaCompletoTemplate(template) {
  return template === "mensalCompleto" || template === "anualCompleto";
}

export function usePdfExport(setPrinting, getExportContext) {
  const [exporting, setExporting] = useState(false);

  const exportToPdf = useCallback(async (filename = "agenda.pdf") => {
    setExporting(true);
    const toastId = toast.loading("Gerando PDF...");

    // Contexto necessário para o gerador nativo
    const ctx = getExportContext?.() ?? {};
    const {
      template      = "",
      dias          = [],          // array de Date[] já calculado pelo template
      primaryColor  = "#475569",
      secondaryColor= "#cbd5e1",
      bgColor       = "#f8fafc",
      footerName    = "",
      perfilNome    = "",
      clienteLabel  = "Cliente",
      servicoLabel  = "Serviço",
    } = ctx;

    const useNative = isDiaCompletoTemplate(template) && dias.length > 0;

    try {
      const { jsPDF, toPng } = await loadLibraries(!useNative);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      if (useNative) {
        // ── Geração nativa: desenha cada dia diretamente no PDF ───────────────
        dias.forEach((data, i) => {
          if (i > 0) pdf.addPage("a4", "portrait");
          drawDiaCompleto(pdf, data, {
            primaryColor, secondaryColor, bgColor,
            footerName, perfilNome, clienteLabel, servicoLabel,
          });
        });

        toast.loading(`Salvando ${dias.length} páginas…`, { id: toastId });

      } else {
        // ── Fallback: captura por screenshot (layouts especiais) ───────────────
        setPrinting(true);
        await new Promise((r) => setTimeout(r, 400));

        const pages = [...document.querySelectorAll(".printable-page")];
        if (!pages.length) {
          toast.error("Nenhuma página encontrada.", { id: toastId });
          setPrinting(false);
          setExporting(false);
          return;
        }

        for (let i = 0; i < pages.length; i++) {
          if (pages.length > 1)
            toast.loading(`Capturando ${i + 1}/${pages.length}…`, { id: toastId });
          const dataUrl = await captureViaImage(pages[i], toPng);
          if (i > 0) pdf.addPage("a4", "portrait");
          pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297, undefined, "FAST");
        }

        setPrinting(false);
      }

      pdf.save(filename);
      toast.success("PDF exportado!", { id: toastId, icon: "📄" });

    } catch (err) {
      console.error("[usePdfExport] Erro:", err);
      toast.error("Erro ao gerar PDF.", { id: toastId });
    } finally {
      setExporting(false);
    }
  }, [setPrinting, getExportContext]);

  return { exportToPdf, exporting };
}
