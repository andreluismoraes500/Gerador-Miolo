// src/hooks/usePdfExport.js
//
// Exportação para PDF via jsPDF nativo — DiaCompleto (mensalCompleto/anualCompleto).
// Valores calibrados contra o PDF real do browser (medição pixel a pixel).

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { getFeriado, getComemorativa, gerarHorarios } from "../utils/agendaUtils";

// ─── Medidas calibradas (mm) ──────────────────────────────────────────────────
// Fonte: medição pixel a pixel do PDF gerado pelo browser a 200dpi

const PW = 210, PH = 297;
// Margens "ímpares" (página 1, 3, 5…). Nas páginas pares elas são
// espelhadas (ver .page-break:nth-child(even) em print.css), pois o miolo
// é pensado para encadernação Wire-O.
const ML = 22, MR = 12, MT = 15, MB = 12;
const CW = PW - ML - MR;   // 176mm

// Retorna as margens esquerda/direita efetivas para a página `pageIndex`
// (0-based), espelhando-as nas páginas pares — exatamente como
// `.page-break:nth-child(odd|even) .printable-page` faz no print.css.
function marginsFor(pageIndex) {
  const isEven = (pageIndex % 2) === 1; // nth-child é 1-based: index 1 → child 2 (par)
  return isEven ? { ml: MR, mr: ML } : { ml: ML, mr: MR };
}

// Posições Y absolutas desde o topo da folha
const Y_LINHA_HEADER  = 35.7;   // border-b-2 do cabeçalho
const Y_LINHA_THEAD   = 48.0;   // border-b-2 do thead (primeira linha de dados começa aqui)
const Y_FOOTER_LINE   = 279.2;  // border-t do footer
const Y_FOOTER_TEXT   = 283.7;  // baseline do texto do footer

// Posições dos textos do cabeçalho (baseline)
const Y_PERFIL_NOME   = 18.5;   // "Médico", "Advogado" etc. (text-xs = 12px)
const Y_DIA_SEMANA    = 26.5;   // "sexta-feira" (h2 default ~24px)
const Y_MES_ANO       = 31.5;   // "JULHO DE 2026" (text-[11px])
const Y_DIA_NUM       = 26.5;   // "17" (text-5xl, baseline = mesmo que dia semana)

// Tabela
const ROW_H = 7.75;             // height definido no print.css: tbody tr { height: 7.75mm }
const HORARIOS = gerarHorarios();

// Tipografia
const PT = (px) => px * 0.264 / 0.352778;  // px → pt para jsPDF
const FONT = {
  xs:    PT(12),   // text-xs      → perfil nome
  h2:    PT(21),   // h2           → dia semana (medido: bloco ~7.5mm a 200dpi)
  p11:   PT(11),   // text-[11px]  → mês/ano
  p85:   PT(8.5),  // text-[8.5px] → thead labels
  p12:   PT(12),   // text-[12px]  → hora tbody
  p9:    PT(9),    // text-[9px]   → footer
  p7:    PT(7),    // text-[7px]   → DINHEIRO/CARTÃO/PIX
  "5xl": PT(40),   // text-5xl     → número do dia (ajustado visualmente)
};

const MESES_PT = ["janeiro","fevereiro","março","abril","maio","junho",
  "julho","agosto","setembro","outubro","novembro","dezembro"];
const DIAS_PT  = ["domingo","segunda-feira","terça-feira","quarta-feira",
  "quinta-feira","sexta-feira","sábado"];

function hexToRgb(hex = "#000000") {
  const h = (hex || "#000000").replace("#","");
  if (h.length !== 6) return [0,0,0];
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}

// Detecta o formato da imagem (PNG/JPEG/WEBP) a partir do dataURL, exigido
// pela assinatura de pdf.addImage(imageData, format, x, y, w, h, ...).
function imageFormatFromDataUrl(dataUrl) {
  const m = /^data:image\/(\w+);/.exec(dataUrl || "");
  const type = (m?.[1] || "png").toLowerCase();
  if (type === "jpg" || type === "jpeg") return "JPEG";
  if (type === "webp") return "WEBP";
  return "PNG";
}

function dashedLine(pdf, x1, y, x2, dash = 0.8, gap = 0.8) {
  let x = x1;
  while (x < x2) {
    pdf.line(x, y, Math.min(x + dash, x2), y);
    x += dash + gap;
  }
}

// Frações das colunas (w-[12%] w-[34%] w-[30%] w-[8%] w-[8%] w-[8%])
const FRACS = [0.12, 0.34, 0.30, 0.08, 0.08, 0.08];

// ─── Render de uma página ─────────────────────────────────────────────────────
function drawDiaCompleto(pdf, data, opts) {
  const {
    primaryColor   = "#475569",
    secondaryColor = "#cbd5e1",
    bgColor        = "#f8fafc",
    footerName     = "Lucas Cassiano de Moraes",
    footerType     = "default",
    perfilNome     = "",
    perfilIcon     = "",
    clienteLabel   = "Cliente",
    servicoLabel   = "Compromisso",
    logo           = null,   // dataURL (opcional)
    watermarkSrc   = null,   // dataURL (opcional)
    watermarkOpacity = 0.03,
    pageIndex      = 0,
  } = opts;

  const { ml: ML, mr: MR } = marginsFor(pageIndex);
  const CW = PW - ML - MR;

  const [pr,pg,pb]   = hexToRgb(primaryColor);
  const [sr,sg,sb]   = hexToRgb(secondaryColor);
  const [br,bgr,bbr] = hexToRgb(bgColor || "#ffffff");

  const colW = FRACS.map(f => f * CW);
  const colX = colW.reduce((acc, w, i) => {
    acc.push(i === 0 ? ML : acc[i-1] + colW[i-1]);
    return acc;
  }, []);

  // ── Fundo ──
  pdf.setFillColor(br, bgr, bbr);
  pdf.rect(0, 0, PW, PH, "F");

  // ── Marca d'água (Watermark.jsx: img centralizada, w-48 ≈ 45mm) ──
  if (watermarkSrc) {
    try {
      const wmSize = 45; // w-48 (192px) a 96dpi ≈ 50.8mm; ajustado visualmente a 45mm
      const wmX = (PW - wmSize) / 2;
      const wmY = (PH - wmSize) / 2;
      const gState = pdf.GState ? new pdf.GState({ opacity: watermarkOpacity }) : null;
      if (gState) pdf.setGState(gState);
      pdf.addImage(watermarkSrc, imageFormatFromDataUrl(watermarkSrc), wmX, wmY, wmSize, wmSize, undefined, "FAST");
      if (gState) pdf.setGState(new pdf.GState({ opacity: 1 }));
    } catch (e) {
      console.warn("[usePdfExport] Falha ao desenhar marca d'água:", e);
    }
  }

  const feriado      = getFeriado(data);
  const comemorativa = getComemorativa(data);
  const diaNum       = String(data.getDate()).padStart(2,"0");
  const diaSemana    = DIAS_PT[data.getDay()];
  const mesStr       = data.toLocaleDateString("pt-BR", {month:"long", year:"numeric"}).toUpperCase();
  const diaCap       = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);

  // ── Logo do usuário (Logo.jsx: h-8 ≈ 8.47mm, antes do ícone de calendário) ──
  let afterLogoX = ML;
  if (logo) {
    try {
      const logoH = 8.47; // h-8
      const logoProps = pdf.getImageProperties(logo);
      const logoW = logoH * (logoProps.width / logoProps.height);
      const logoY = Y_DIA_SEMANA - logoH * 0.6; // centraliza aproximadamente com o bloco de texto do cabeçalho
      pdf.addImage(logo, imageFormatFromDataUrl(logo), ML, logoY, logoW, logoH, undefined, "FAST");
      afterLogoX = ML + logoW + 3.5 * (4 * 0.264); // gap-3.5
    } catch (e) {
      console.warn("[usePdfExport] Falha ao desenhar logo:", e);
    }
  }

  // ── Ícone calendário (alinhado verticalmente ao centro do cabeçalho) ──
  const iconS  = 5.3;   // w-5 h-5 ≈ 5.28mm
  const iconX  = afterLogoX;
  const iconY  = Y_PERFIL_NOME - iconS;   // topo do ícone
  pdf.setFillColor(pr, pg, pb);
  pdf.roundedRect(iconX, iconY, iconS, iconS, 0.7, 0.7, "F");
  // Grade 3×3 interna (calendário)
  pdf.setFillColor(br, bgr, bbr);
  const cg = iconS / 4;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      pdf.rect(iconX + cg*(col+0.5) - 0.35, iconY + cg*(row+1) - 0.35, 0.7, 0.7, "F");
    }
  }

  // ── Textos do cabeçalho ──
  const textX = iconX + iconS + 3.5 * (4 * 0.264);  // gap-3.5

  // Perfil: "Médico" etc. (text-xs, primaryColor)
  if (perfilNome) {
    pdf.setFontSize(FONT.xs);
    pdf.setFont("helvetica","normal");
    pdf.setTextColor(pr, pg, pb);
    pdf.text(`${perfilIcon} ${perfilNome}`, textX, Y_PERFIL_NOME);
  }

  // h2: "sexta-feira" (h2 ~21pt, bold, primaryColor)
  pdf.setFontSize(FONT.h2);
  pdf.setFont("helvetica","bold");
  pdf.setTextColor(pr, pg, pb);
  pdf.text(diaCap, textX, Y_DIA_SEMANA);

  // p: "JULHO DE 2026" (text-[11px], gray-400 = #9ca3af)
  pdf.setFontSize(FONT.p11);
  pdf.setFont("helvetica","bold");
  pdf.setTextColor(156, 163, 175);
  pdf.text(mesStr, textX, Y_MES_ANO);

  // Linha separadora do cabeçalho (border-b-2, primaryColor)
  pdf.setDrawColor(pr, pg, pb);
  pdf.setLineWidth(0.53);
  pdf.line(ML, Y_LINHA_HEADER, PW - MR, Y_LINHA_HEADER);

  // Número do dia (text-5xl font-extralight, alinhado à direita)
  pdf.setFontSize(FONT["5xl"]);
  pdf.setFont("helvetica","normal"); // jsPDF/helvetica não tem variante "light"; "normal" é o mais próximo do font-extralight
  pdf.setTextColor(20, 20, 20);
  pdf.text(diaNum, PW - MR, Y_DIA_NUM, {align:"right"});

  // Feriado ou comemorativa
  if (feriado) {
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica","bold");
    pdf.setTextColor(20, 20, 20);
    const label = `* ${feriado.nome}`;
    const tw = pdf.getTextWidth(label);
    pdf.setDrawColor(20, 20, 20);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(PW-MR-tw-3, MT, tw+3, 4, 0.5, 0.5);
    pdf.text(label, PW-MR-tw-1.5, MT+3);
  } else if (comemorativa) {
    pdf.setFontSize(6.5);
    pdf.setFont("helvetica","italic");
    pdf.setTextColor(150, 150, 150);
    pdf.text(comemorativa, PW-MR, MT+3, {align:"right"});
  }

  // ── Thead ──────────────────────────────────────────────────────────────────
  const thTop  = Y_LINHA_HEADER + 0.5;  // logo após a linha
  const thLine = Y_LINHA_THEAD;
  const thMid  = (thTop + thLine) / 2;

  // Separadores verticais do thead
  pdf.setDrawColor(sr, sg, sb);
  pdf.setLineWidth(0.26);
  [1,2,3,4,5].forEach(i => pdf.line(colX[i], thTop, colX[i], thLine));

  // Linha abaixo do thead (border-b-2, primaryColor)
  pdf.setDrawColor(pr, pg, pb);
  pdf.setLineWidth(0.53);
  pdf.line(ML, thLine, PW-MR, thLine);

  // Labels: HORA, Cliente, Serviço (text-[8.5px] bold uppercase, preto)
  pdf.setFontSize(FONT.p85);
  pdf.setFont("helvetica","bold");
  pdf.setTextColor(20, 20, 20);
  pdf.text("HORA",                     colX[0]+1, thMid + FONT.p85*0.352778/2);
  pdf.text(clienteLabel.toUpperCase(), colX[1]+2, thMid + FONT.p85*0.352778/2);
  pdf.text(servicoLabel.toUpperCase(), colX[2]+2, thMid + FONT.p85*0.352778/2);

  // Ícones das colunas de pagamento (w-4 h-4 + text-[7px])
  const iconPayS = 4 * 4 * 0.264;  // w-4 = 4.23mm
  const payDefs = [
    {ci:3, label:"DINHEIRO", draw:"cash"},
    {ci:4, label:"CARTÃO",   draw:"card"},
    {ci:5, label:"PIX",      draw:"pix"},
  ];
  payDefs.forEach(({ci, label, draw}) => {
    const cx = colX[ci] + colW[ci]/2;
    const iconTop = thTop + 0.5;
    const s = iconPayS;

    pdf.setDrawColor(pr, pg, pb);
    pdf.setFillColor(pr, pg, pb);

    if (draw === "cash") {
      // GiMoneyStack: duas notas empilhadas, contorno
      pdf.setLineWidth(0.22);
      pdf.roundedRect(cx - s/2, iconTop + s*0.12, s*0.82, s*0.42, 0.3, 0.3);
      pdf.roundedRect(cx - s/2 + s*0.12, iconTop + s*0.46, s*0.82, s*0.42, 0.3, 0.3);
    } else if (draw === "card") {
      // CiCreditCard2: cartão com tarja
      pdf.setLineWidth(0.22);
      pdf.roundedRect(cx - s/2, iconTop + s*0.12, s, s*0.7, 0.4, 0.4);
      pdf.setLineWidth(0.45);
      pdf.line(cx - s/2 + 0.3, iconTop + s*0.32, cx + s/2 - 0.3, iconTop + s*0.32);
    } else {
      // FaPix: losango estilizado (4 pétalas)
      const r = s*0.34;
      pdf.triangle(cx, iconTop + s*0.12, cx - r*0.6, iconTop + s*0.47, cx + r*0.6, iconTop + s*0.47, "F");
      pdf.triangle(cx, iconTop + s*0.82, cx - r*0.6, iconTop + s*0.47, cx + r*0.6, iconTop + s*0.47, "F");
    }

    // Label abaixo
    pdf.setFontSize(FONT.p7);
    pdf.setFont("helvetica","bold");
    pdf.setTextColor(107, 114, 128);  // gray-500
    pdf.text(label, cx, thLine - 1, {align:"center"});
  });

  // ── Tbody ──────────────────────────────────────────────────────────────────
  HORARIOS.forEach((hora, idx) => {
    const ry    = thLine + idx * ROW_H;
    const ryEnd = ry + ROW_H;
    const ryMid = ry + ROW_H * 0.62;

    // Linha horizontal border-b-[1.5px] border-solid (secondaryColor)
    pdf.setDrawColor(sr, sg, sb);
    pdf.setLineWidth(1.5 * 0.264);
    pdf.line(ML, ryEnd, PW-MR, ryEnd);

    // Separadores verticais
    pdf.setLineWidth(0.26);
    [1,2,3,4,5].forEach(ci => pdf.line(colX[ci], ry, colX[ci], ryEnd));

    // Hora (font-mono text-[12px] font-bold)
    pdf.setFontSize(FONT.p12);
    pdf.setFont("courier","bold");
    pdf.setTextColor(20, 20, 20);
    pdf.text(hora, colX[0]+1, ryMid);

    // EditableField: border-b border-dotted border-gray-300
    pdf.setDrawColor(209, 213, 219);  // gray-300
    pdf.setLineWidth(0.2);
    dashedLine(pdf, colX[1]+2, ryEnd-1.5, colX[2]-0.5, 0.6, 0.6);
    dashedLine(pdf, colX[2]+2, ryEnd-1.5, colX[3]-0.5, 0.6, 0.6);

    // Checkboxes: w-3.5 h-3.5 border rounded-sm (secondaryColor)
    const cbS = 3.5 * 4 * 0.264;  // 3.70mm
    [3,4,5].forEach(ci => {
      const bx = colX[ci] + colW[ci]/2 - cbS/2;
      const by = ry + ROW_H/2 - cbS/2;
      pdf.setDrawColor(sr, sg, sb);
      pdf.setLineWidth(0.26);
      pdf.roundedRect(bx, by, cbS, cbS, 0.5, 0.5);
    });
  });

  // ── Footer ─────────────────────────────────────────────────────────────────
  // border-t border-gray-300
  pdf.setDrawColor(209, 213, 219);
  pdf.setLineWidth(0.264);
  pdf.line(ML, Y_FOOTER_LINE, PW-MR, Y_FOOTER_LINE);

  // "Desenho de Miolo por: Nome" (text-[9px] font-mono uppercase)
  pdf.setFontSize(FONT.p9);
  pdf.setFont("courier","normal");
  pdf.setTextColor(156, 163, 175);  // gray-400
  const prefix = "DESENHO DE MIOLO POR: ";
  pdf.text(prefix, ML, Y_FOOTER_TEXT);

  pdf.setFont("courier","bold");
  pdf.setTextColor(pr, pg, pb);
  pdf.text((footerName || "").toUpperCase(), ML + pdf.getTextWidth(prefix), Y_FOOTER_TEXT);
}

// ─── Página de resumo (mensalCompleto.jsx / anualCompleto.jsx) ──────────────
function drawResumoPage(pdf, dias, opts) {
  const { template, primaryColor = "#475569", bgColor = "#ffffff", pageIndex = 0 } = opts;
  const { ml: ML, mr: MR } = marginsFor(pageIndex);
  const [pr,pg,pb]   = hexToRgb(primaryColor);
  const [br,bgr,bbr] = hexToRgb(bgColor || "#ffffff");

  let feriados = 0, comemorativas = 0, uteis = 0;
  dias.forEach((d) => {
    if (getFeriado(d)) feriados++;
    if (getComemorativa(d)) comemorativas++;
    const dw = d.getDay();
    if (dw !== 0 && dw !== 6) uteis++;
  });
  const totalDias = dias.length;
  const isAno = template === "anualCompleto";

  pdf.setFillColor(br, bgr, bbr);
  pdf.rect(0, 0, PW, PH, "F");

  const cx = (ML + (PW - MR)) / 2;
  let y = 130;

  pdf.setFont("helvetica","normal");
  pdf.setFontSize(PT(20));
  pdf.setTextColor(40, 40, 40);
  pdf.text(`Resumo do ${isAno ? "Ano" : "Mês"}`, cx, y, {align:"center"});
  y += 14;

  const linhas = [
    `Total de dias: ${totalDias}`,
    `Dias úteis: ${uteis}`,
    `Feriados: ${feriados}`,
    `Datas comemorativas: ${comemorativas}`,
  ];
  pdf.setFontSize(PT(12));
  linhas.forEach((linha) => {
    pdf.text(linha, cx, y, {align:"center"});
    y += 7;
  });

  y += 8;
  pdf.setFontSize(PT(9));
  pdf.setTextColor(156, 163, 175);
  pdf.text("Gerado automaticamente", cx, y, {align:"center"});
}

// ─── Fallback html-to-image (outros layouts) ─────────────────────────────────
async function captureViaImage(el, toPng, pageIndex = 0) {
  const prev = {
    paddingTop: el.style.paddingTop, paddingBottom: el.style.paddingBottom,
    paddingLeft: el.style.paddingLeft, paddingRight: el.style.paddingRight,
  };
  const { ml, mr } = marginsFor(pageIndex);
  el.style.paddingTop="15mm"; el.style.paddingBottom="12mm";
  el.style.paddingLeft=`${ml}mm`; el.style.paddingRight=`${mr}mm`;

  // Elementos com `print:hidden` (ex.: slogan do rodapé) só somem dentro de
  // @media print — como a captura ocorre em contexto de tela, precisamos
  // escondê-los manualmente para que o PDF fique igual ao impresso de verdade.
  const hiddenEls = [...el.querySelectorAll('[class*="print:hidden"]')];
  const prevDisplay = hiddenEls.map(n => n.style.display);
  hiddenEls.forEach(n => { n.style.display = "none"; });

  const fontEmbedCSS = [...document.styleSheets].reduce((acc, sheet) => {
    try {
      return acc + [...sheet.cssRules]
        .filter(r => r instanceof CSSFontFaceRule)
        .map(r => r.cssText).join("\n");
    } catch { return acc; }
  }, "");

  const dataUrl = await toPng(el, {pixelRatio:2, backgroundColor:"#ffffff", fontEmbedCSS});
  Object.assign(el.style, prev);
  hiddenEls.forEach((n, i) => { n.style.display = prevDisplay[i]; });
  return dataUrl;
}

async function loadLibraries(needImage) {
  const libs = [import("jspdf")];
  if (needImage) libs.push(import("html-to-image"));
  const [j, ...rest] = await Promise.all(libs);
  return {jsPDF: j.default, toPng: needImage ? rest[0].toPng : null};
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function usePdfExport(setPrinting, getExportContext) {
  const [exporting, setExporting] = useState(false);

  const exportToPdf = useCallback(async (filename = "agenda.pdf") => {
    setExporting(true);
    const toastId = toast.loading("Gerando PDF...");

    const ctx = getExportContext?.() ?? {};
    const {
      template       = "",
      dias           = [],
      primaryColor,
      secondaryColor,
      bgColor,
      footerName     = "Lucas Cassiano de Moraes",
      footerType     = "default",
      perfilNome     = "",
      perfilIcon     = "",
      clienteLabel   = "Cliente",
      servicoLabel   = "Compromisso",
      logo           = null,
      watermarkSrc   = null,
      watermarkOpacity = 0.03,
    } = ctx;

    const useNative = (template==="mensalCompleto" || template==="anualCompleto")
                      && dias.length > 0;

    try {
      const {jsPDF, toPng} = await loadLibraries(!useNative);
      const pdf = new jsPDF({orientation:"portrait", unit:"mm", format:"a4", compress:true});

      if (useNative) {
        dias.forEach((data, i) => {
          if (i > 0) pdf.addPage("a4","portrait");
          drawDiaCompleto(pdf, data, {
            primaryColor, secondaryColor, bgColor,
            footerName, footerType,
            perfilNome, perfilIcon,
            clienteLabel, servicoLabel,
            logo, watermarkSrc, watermarkOpacity,
            pageIndex: i,
          });
        });

        // Página final "Resumo do Mês/Ano" — presente no template real
        // (ver mensalCompleto.jsx / anualCompleto.jsx), ausente até então no PDF nativo.
        pdf.addPage("a4","portrait");
        drawResumoPage(pdf, dias, {
          template, primaryColor, secondaryColor, bgColor,
          pageIndex: dias.length,
        });

        toast.loading(`Salvando ${dias.length + 1} páginas…`, {id:toastId});

      } else {
        setPrinting(true);
        await new Promise(r => setTimeout(r, 400));
        const pages = [...document.querySelectorAll(".printable-page")];
        if (!pages.length) {
          toast.error("Nenhuma página encontrada.", {id:toastId});
          setPrinting(false); setExporting(false); return;
        }
        for (let i = 0; i < pages.length; i++) {
          if (pages.length > 1)
            toast.loading(`Capturando ${i+1}/${pages.length}…`, {id:toastId});
          const dataUrl = await captureViaImage(pages[i], toPng, i);
          if (i > 0) pdf.addPage("a4","portrait");
          pdf.addImage(dataUrl, "PNG", 0, 0, 210, 297, undefined, "FAST");
        }
        setPrinting(false);
      }

      pdf.save(filename);
      toast.success("PDF exportado!", {id:toastId, icon:"📄"});
    } catch (err) {
      console.error("[usePdfExport] Erro:", err);
      toast.error("Erro ao gerar PDF.", {id:toastId});
    } finally {
      setExporting(false);
    }
  }, [setPrinting, getExportContext]);

  return {exportToPdf, exporting};
}
