// Impressão em folha única (sem impressora frente e verso).
// Páginas ímpares = frente; pares = verso (mesma lógica da margem espelhada).
import { criarStore } from "./storeSimples";

export const LADOS = [
  { id: "ambos", nome: "Frente e verso (tudo)" },
  { id: "frente", nome: "Só frente (páginas 1, 3, 5…)" },
  { id: "verso", nome: "Só verso (páginas 2, 4, 6…)" },
  { id: "verso-inverso", nome: "Só verso, ordem invertida" },
];

export const impressao = criarStore("impressao-lados", { lados: "ambos" });

export const DICAS_LADOS = {
  ambos: "Use com impressora que imprime frente e verso (borda longa).",
  frente: "Imprima, depois use “Só verso”: coloque as folhas impressas de volta na bandeja, viradas, e imprima.",
  verso: "Recoloque a pilha impressa virando pela borda LONGA. Se o verso sair de ponta-cabeça ou fora de ordem, teste “ordem invertida”.",
  "verso-inverso": "Use se a sua impressora entrega a pilha com a frente para cima: o verso sai da última folha para a primeira.",
};

// Marca cada .page-break com o lado e, no verso invertido, reordena o DOM.
// Devolve uma função que restaura tudo.
export function prepararLados(lados) {
  const cont = document.querySelector(".print-container");
  document.body.dataset.ladosImpressao = lados;
  if (!cont) return () => delete document.body.dataset.ladosImpressao;
  const paginas = [...cont.children].filter((el) => el.classList.contains("page-break"));
  paginas.forEach((el, i) => {
    el.dataset.lado = i % 2 === 0 ? "frente" : "verso";
  });
  const original = [...cont.children];
  if (lados === "verso-inverso") {
    const versos = paginas.filter((el) => el.dataset.lado === "verso").reverse();
    versos.forEach((el) => cont.appendChild(el));
  }
  return () => {
    original.forEach((el) => cont.appendChild(el));
    paginas.forEach((el) => delete el.dataset.lado);
    delete document.body.dataset.ladosImpressao;
  };
}
