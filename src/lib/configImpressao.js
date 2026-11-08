// Impressão em folha única (sem impressora frente e verso).
// Páginas ímpares = frente; pares = verso (mesma lógica da margem espelhada).
import { criarStore } from "./storeSimples";
import { cssFonte, fonteCfg } from "./configFonte";

export const LADOS = [
  { id: "ambos", nome: "Frente e verso (tudo)" },
  { id: "frente", nome: "Só frente (páginas 1, 3, 5…)" },
  { id: "verso", nome: "Só verso (páginas 2, 4, 6…)" },
  { id: "verso-inverso", nome: "Só verso, ordem invertida" },
];


export const DICAS_LADOS = {
  ambos: "Use com impressora que imprime frente e verso (borda longa).",
  frente: "Imprima, depois use “Só verso”: coloque as folhas impressas de volta na bandeja, viradas, e imprima.",
  verso: "Recoloque a pilha impressa virando pela borda LONGA. Se o verso sair de ponta-cabeça ou fora de ordem, teste “ordem invertida”.",
  "verso-inverso": "Use se a sua impressora entrega a pilha com a frente para cima: o verso sai da última folha para a primeira.",
};

export const FORMATOS = [
  { id: "a4", nome: "A4 (1 por folha)", folha: [210, 297], cols: 1, rows: 1, dica: "" },
  { id: "a5", nome: "A5 (folha A5)", folha: [148, 210], cols: 1, rows: 1, dica: "Coloque papel A5 na bandeja." },
  { id: "a6", nome: "A6 (folha A6)", folha: [105, 148], cols: 1, rows: 1, dica: "Coloque papel A6 na bandeja." },
  {
    id: "2up", nome: "2 por folha — páginas A5 em folha A4", folha: [297, 210], cols: 2, rows: 1,
    dica: "Folha A4 deitada. Para frente e verso, vire pela borda CURTA (como página de livro). Depois corte ao meio nas linhas tracejadas.",
  },
  {
    id: "4up", nome: "4 por folha — páginas A6 em folha A4", folha: [210, 297], cols: 2, rows: 2,
    dica: "Folha A4 em pé. Para frente e verso, vire pela borda LONGA. Depois corte nas linhas tracejadas.",
  },
];

export const impressao = criarStore("impressao-lados", { lados: "ambos", formato: "a4", compensar: true });

// Posição de cada página nas folhas. Cada folha é { lado, cells: [indicePágina|null] }.
// Nas folhas múltiplas, frente e verso são montados para que, depois de virar
// a folha e cortar, cada pedaço fique com frente = página ímpar, verso = par.
function montarFolhas(n, f) {
  const k = f.cols * f.rows;
  const folhas = [];
  if (k === 1) {
    for (let i = 0; i < n; i += 1) folhas.push({ lado: i % 2 === 0 ? "frente" : "verso", cells: [i] });
    return folhas;
  }
  const grupo = k * 2; // páginas por papel (frente + verso)
  const ok = (i) => (i < n ? i : null);
  for (let g = 0; g * grupo < n; g += 1) {
    const b = g * grupo;
    if (k === 2) {
      folhas.push({ lado: "frente", cells: [ok(b), ok(b + 2)] });
      folhas.push({ lado: "verso", cells: [ok(b + 3), ok(b + 1)] });
    } else {
      folhas.push({ lado: "frente", cells: [ok(b), ok(b + 2), ok(b + 4), ok(b + 6)] });
      folhas.push({ lado: "verso", cells: [ok(b + 3), ok(b + 1), ok(b + 7), ok(b + 5)] });
    }
  }
  return folhas;
}

// Prepara o DOM para a impressão (A4/A5/A6, N por folha, só frente/verso).
// Devolve uma função que desfaz tudo.
export function prepararImpressao({ lados = "ambos", formato = "a4", compensar = true } = {}) {
  const cont = document.querySelector(".print-container");
  const limpar = () => delete document.body.dataset.ladosImpressao;
  document.body.dataset.ladosImpressao = lados;
  if (!cont) return limpar;

  const paginas = [...cont.children].filter((el) => el.classList.contains("page-break"));
  paginas.forEach((el, i) => {
    el.dataset.lado = i % 2 === 0 ? "frente" : "verso";
  });

  const f = FORMATOS.find((x) => x.id === formato) || FORMATOS[0];
  const simples = f.id === "a4" && lados === "ambos";
  if (simples) {
    return () => {
      paginas.forEach((el) => delete el.dataset.lado);
      limpar();
    };
  }

  const [fw, fh] = f.folha;
  const cw = fw / f.cols;
  const ch = fh / f.rows;
  const sx = cw / 210;
  const sy = ch / 297;

  let folhas = montarFolhas(paginas.length, f);
  if (lados === "frente") folhas = folhas.filter((x) => x.lado === "frente");
  else if (lados === "verso") folhas = folhas.filter((x) => x.lado === "verso");
  else if (lados === "verso-inverso") folhas = folhas.filter((x) => x.lado === "verso").reverse();

  const originais = [...cont.children];
  const estilosOrig = new Map(paginas.map((el) => [el, el.getAttribute("style")]));

  // Ao reduzir a página (A5/A6/várias por folha) o texto encolhe junto. Para manter
  // a leitura confortável, compensamos o tamanho das letras (A5 ≈ +25%, A6 ≈ +42%).
  const z = Math.min(sx, sy);
  const reforco = compensar && z < 1 ? 1 + (1 - z) * 0.85 : 1;
  const fonteExtra = reforco > 1 ? cssFonte(Math.round((fonteCfg.get().escala / 100) * reforco * 100), ".folha .printable-page") : "";
  const pagina = document.createElement("style");
  const semCal = formato === "4up" ? "@media print { .mini-cal { display: none !important; } }\n" : "";
  pagina.textContent = `${fonteExtra}\n${semCal}`+`@media print { @page { size: ${fw}mm ${fh}mm; margin: 0; } html, body, #root, .print-container { width: ${fw}mm !important; min-width: ${fw}mm !important; max-width: none !important; height: auto !important; margin: 0 !important; padding: 0 !important; } .folha { margin: 0 !important; } }`;
  document.head.appendChild(pagina);

  const novas = folhas.map((fo) => {
    const el = document.createElement("div");
    el.className = "folha";
    el.style.cssText = `width:${fw}mm;height:${fh - 0.4}mm;`;
    fo.cells.forEach((idx, c) => {
      const cel = document.createElement("div");
      cel.className = "celula";
      cel.style.cssText = `left:${(c % f.cols) * cw}mm;top:${Math.floor(c / f.cols) * ch}mm;width:${cw}mm;height:${ch}mm;`;
      if (idx !== null) {
        const pg = paginas[idx];
        pg.style.zoom = String(Math.min(sx, sy));
        cel.appendChild(pg);
      }
      el.appendChild(cel);
    });
    if (f.cols > 1) {
      const g = document.createElement("div");
      g.className = "guia";
      g.style.cssText = `left:${cw}mm;top:0;bottom:0;border-left-width:0.25mm;`;
      el.appendChild(g);
    }
    if (f.rows > 1) {
      const g = document.createElement("div");
      g.className = "guia";
      g.style.cssText = `top:${ch}mm;left:0;right:0;border-top-width:0.25mm;`;
      el.appendChild(g);
    }
    return el;
  });

  originais.forEach((el) => {
    if (!el.classList.contains("page-break")) return;
  });
  cont.replaceChildren(...novas);

  return () => {
    cont.replaceChildren(...originais);
    paginas.forEach((el) => {
      const st = estilosOrig.get(el);
      if (st === null || st === undefined) el.removeAttribute("style");
      else el.setAttribute("style", st);
      delete el.dataset.lado;
    });
    pagina.remove();
    limpar();
  };
}

if (typeof window !== "undefined") window.__prepararImpressao = prepararImpressao; // gancho de teste
