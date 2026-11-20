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
    id: "2dup", nome: "2 iguais por folha — mesma página A5 repetida (corte ao meio)", folha: [297, 210], cols: 2, rows: 1, dup: true,
    dica: "Folha A4 deitada: a página 1 sai 2 vezes na frente e a página 2 sai 2 vezes no verso (3 e 4 na folha seguinte…). Vire pela borda CURTA e corte na linha do meio: você obtém 2 folhas A5 idênticas (frente = página ímpar, verso = par).",
  },
  {
    id: "livro", nome: "Brochura — caderno dobrado (A5 em folhas A4)", folha: [297, 210], cols: 2, rows: 1, livro: true,
    dica: "Páginas na ordem de caderno: imprima frente e verso virando pela borda CURTA, empilhe as folhas na ordem, dobre ao meio (a linha tracejada é a dobra) e grampeie/costure na dobra. O total de páginas é completado com brancas até múltiplo de 4.",
  },
  {
    id: "4up", nome: "4 por folha — páginas A6 em folha A4", folha: [210, 297], cols: 2, rows: 2,
    dica: "Folha A4 em pé. Para frente e verso, vire pela borda LONGA. Depois corte nas linhas tracejadas.",
  },
];

// Formatos de folha do Talonário: os mesmos da agenda, menos a brochura.
export const FORMATOS_TAL = FORMATOS.filter((x) => !x.livro);
export const DICAS_TAL = {
  a4: "Um talão por folha A4.",
  a5: "Um talão por folha A5 (coloque papel A5 na bandeja).",
  a6: "Um talão por folha A6 (coloque papel A6 na bandeja).",
  "2up": "Folha A4 deitada com 2 talões diferentes lado a lado (1 e 2, 3 e 4…). Corte ao meio.",
  "2dup": "Folha A4 deitada com o MESMO talão 2 vezes (via do cliente e via da loja, com a mesma numeração). Corte ao meio.",
  "4up": "Folha A4 em pé com 4 talões diferentes (A6). Corte em cruz.",
};
export const talImpressao = criarStore("talonario-impressao", { formato: "a4" });

export const impressao = criarStore("impressao-lados", { lados: "ambos", formato: "a4", compensar: true });

// Posição de cada página nas folhas. Cada folha é { lado, cells: [indicePágina|null] }.
// Nas folhas múltiplas, frente e verso são montados para que, depois de virar
// a folha e cortar, cada pedaço fique com frente = página ímpar, verso = par.
export function montarFolhas(n, f) {
  const k = f.cols * f.rows;
  const folhas = [];
  if (k === 1) {
    for (let i = 0; i < n; i += 1) folhas.push({ lado: i % 2 === 0 ? "frente" : "verso", cells: [i] });
    return folhas;
  }
  if (f.livro) {
    const N = Math.ceil(n / 4) * 4;
    const o = (p) => (p - 1 < n ? p - 1 : null); // p = número da página (1..N)
    for (let k = 1; k <= N / 4; k += 1) {
      folhas.push({ lado: "frente", cells: [o(N - 2 * k + 2), o(2 * k - 1)] });
      folhas.push({ lado: "verso", cells: [o(2 * k), o(N - 2 * k + 1)] });
    }
    return folhas;
  }
  if (f.dup) {
    for (let i = 0; i < n; i += 2) {
      folhas.push({ lado: "frente", cells: [i, i] });
      folhas.push({ lado: "verso", cells: [i + 1 < n ? i + 1 : null, i + 1 < n ? i + 1 : null] });
    }
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
export function prepararImpressao({ lados = "ambos", formato = "a4", compensar = true, paisagem = false } = {}) {
  const cont = document.querySelector(".print-container");
  const limpar = () => delete document.body.dataset.ladosImpressao;
  document.body.dataset.ladosImpressao = lados;
  if (!cont) return limpar;

  const paginas = [...cont.children].filter((el) => el.classList.contains("page-break"));
  paginas.forEach((el, i) => {
    el.dataset.lado = i % 2 === 0 ? "frente" : "verso";
  });

  const f = FORMATOS.find((x) => x.id === formato) || FORMATOS[0];
  const simples = f.id === "a4" && lados === "ambos" && !paisagem;
  if (simples) {
    return () => {
      paginas.forEach((el) => delete el.dataset.lado);
      limpar();
    };
  }

  // Páginas deitadas (297×210): a folha gira (A4 em pé com 2 páginas empilhadas, etc.)
  const [fw, fh] = paisagem ? [f.folha[1], f.folha[0]] : f.folha;
  const cols = paisagem ? f.rows : f.cols;
  const rows = paisagem ? f.cols : f.rows;
  const pw = paisagem ? 297 : 210;
  const ph = paisagem ? 210 : 297;
  const cw = fw / cols;
  const ch = fh / rows;
  const sx = cw / pw;
  const sy = ch / ph;
  const internos = paisagem ? paginas.map((el) => [el.querySelector(".pdf-pagina"), el.querySelector(".pdf-pagina")?.getAttribute("style")]) : [];
  internos.forEach(([el]) => { if (el) { el.style.width = "297mm"; el.style.height = "210mm"; } });

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
  const tamPag = paisagem ? `@media print { body .folha .celula .page-break { width: 297mm !important; height: 210mm !important; overflow: visible !important; } }\n` : "";
  const semCal = formato === "4up" ? "@media print { .mini-cal { display: none !important; } }\n" : "";
  pagina.textContent = `${fonteExtra}\n${semCal}${tamPag}`+`@media print { @page { size: ${fw}mm ${fh}mm; margin: 0; } html, body, #root, .print-container { width: ${fw}mm !important; min-width: ${fw}mm !important; max-width: none !important; height: auto !important; margin: 0 !important; padding: 0 !important; } .folha { margin: 0 !important; } }`;
  document.head.appendChild(pagina);
  // o contêiner da página pode ter respiro (padding) na tela: zera para a 1ª folha não descer
  const pai = cont.parentElement;
  const paiStyle = pai ? pai.getAttribute("style") : null;
  if (pai) { pai.style.padding = "0"; pai.style.margin = "0"; pai.style.maxWidth = "none"; pai.style.gap = "0"; }

  const novas = folhas.map((fo) => {
    const el = document.createElement("div");
    el.className = "folha";
    el.style.cssText = `width:${fw}mm;height:${fh - 0.4}mm;`;
    fo.cells.forEach((idx, c) => {
      const cel = document.createElement("div");
      cel.className = "celula";
      cel.style.cssText = `left:${(c % cols) * cw}mm;top:${Math.floor(c / cols) * ch}mm;width:${cw}mm;height:${ch}mm;`;
      if (idx !== null) {
        const pg = paginas[idx];
        pg.style.zoom = String(Math.min(sx, sy));
        cel.appendChild(f.dup && c > 0 ? pg.cloneNode(true) : pg);
      }
      el.appendChild(cel);
    });
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
    internos.forEach(([el, st]) => { if (!el) return; if (st === null || st === undefined) el.removeAttribute("style"); else el.setAttribute("style", st); });
    if (pai) { if (paiStyle === null) pai.removeAttribute("style"); else pai.setAttribute("style", paiStyle); }
    pagina.remove();
    limpar();
  };
}

// Espera as imagens (inclusive as cópias de "2 iguais por folha") carregarem antes de imprimir; senão a cópia sai em branco.
export async function aguardarImagens(raiz = document) {
  const imgs = [...raiz.querySelectorAll("img")];
  await Promise.all(imgs.map((i) => (i.complete && i.naturalWidth ? Promise.resolve() : i.decode ? i.decode().catch(() => {}) : new Promise((r) => { i.onload = r; i.onerror = r; }))));
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  await new Promise((r) => setTimeout(r, 150));
}

if (typeof window !== "undefined") window.__prepararImpressao = prepararImpressao; // gancho de teste
