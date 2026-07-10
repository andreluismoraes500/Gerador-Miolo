// src/templates/index.js
//
// Registro central de templates — agora com CODE-SPLITTING de verdade.
//
// Antes, este arquivo importava os ~37 arquivos de template de uma vez só,
// então a página de seleção (a PRIMEIRA tela do app) carregava o código de
// TODOS os miolos, mesmo que o usuário só fosse usar um. Agora:
//
//   - `TEMPLATE_MANIFEST` (em ./manifest.js) tem só {chave, nome} — leve,
//     usado pela galeria/dropdown de seleção.
//   - `loadTemplate(key)` importa SOB DEMANDA (dynamic import) o arquivo do
//     template escolhido, com cache em memória — a partir da 2ª vez que o
//     mesmo template é aberto na sessão, é instantâneo.
//
// Para adicionar um novo template: crie o arquivo, registre o nome em
// manifest.js e adicione a chave no mapa de loaders abaixo.

export { TEMPLATE_MANIFEST, TEMPLATE_KEYS } from "./manifest";

// Um `import()` por chave — o Vite consegue criar um chunk separado para
// cada um porque o caminho é um literal estático (não uma variável), então
// mesmo estando dentro de um objeto, cada linha continua sendo analisável
// e "splitável" no build.
const LOADERS = {
  diario: () => import("./diario.jsx"),
  diarioLivre: () => import("./diarioLivre.jsx"),
  diarioFloral: () => import("./diarioFloral.jsx"),
  diarioComercial: () => import("./diarioComercial.jsx"),
  diarioComercialDuplo: () => import("./diarioComercialDuplo.jsx"),
  mensalCompleto: () => import("./mensalCompleto.jsx"),
  mensalLivre: () => import("./mensalLivre.jsx"),
  mensalComercialDuplo: () => import("./mensalComercialDuplo.jsx"),
  anualCompleto: () => import("./anualCompleto.jsx"),
  anualLivre: () => import("./anualLivre.jsx"),
  anualComercialDuplo: () => import("./anualComercialDuplo.jsx"),
  semanal: () => import("./semanal.jsx"),
  tarefas: () => import("./tarefas.jsx"),
  dadosPessoais: () => import("./dadosPessoais.jsx"),
  calendarios: () => import("./calendarios.jsx"),
  plannerMensal: () => import("./plannerMensal.jsx"),
  gratidao: () => import("./gratidao.jsx"),
  habitos: () => import("./habitos.jsx"),
  financas: () => import("./financas.jsx"),
  conteudo: () => import("./conteudo.jsx"),
  refeicoes: () => import("./refeicoes.jsx"),
  metas: () => import("./metas.jsx"),
  saude: () => import("./saude.jsx"),
  pet: () => import("./pet.jsx"),
  capa: () => import("./capa.jsx"),
  sono: () => import("./sono.jsx"),
  estudos: () => import("./estudos.jsx"),
  leitura: () => import("./leitura.jsx"),
  viagem: () => import("./viagem.jsx"),
  compras: () => import("./compras.jsx"),
  sonhos: () => import("./sonhos.jsx"),
  wishlist: () => import("./wishlist.jsx"),
  cadernoUniversitario: () => import("./cadernoUniversitario.jsx"),
  listaChamada: () => import("./listaChamada.jsx"),
  boletim: () => import("./boletim.jsx"),
  planoAula: () => import("./planoAula.jsx"),
  caligrafia: () => import("./caligrafia.jsx"),
};

// Cache em memória: { [key]: { nome, layout } }. Vive só durante a sessão
// (recarregar a página limpa, o que é aceitável — o chunk baixa rápido de
// novo, e o browser ainda tem o arquivo em cache HTTP).
const moduleCache = new Map();

/**
 * Carrega (ou devolve do cache) o módulo `{ nome, layout }` de um template.
 * Retorna sempre uma Promise, mesmo quando já está em cache, para manter a
 * mesma interface em todo lugar que chama.
 */
export function loadTemplate(key) {
  if (moduleCache.has(key)) {
    return Promise.resolve(moduleCache.get(key));
  }
  const loader = LOADERS[key];
  if (!loader) return Promise.resolve(null);

  return loader().then((mod) => {
    const def = mod.default;
    moduleCache.set(key, def);
    return def;
  });
}

/** Versão síncrona: só retorna algo se o template já tiver sido carregado antes. */
export function getCachedTemplate(key) {
  return moduleCache.get(key) ?? null;
}

/** Dispara o carregamento de vários templates em paralelo (usado na Montagem). */
export function preloadTemplates(keys) {
  return Promise.all(keys.map((key) => loadTemplate(key)));
}
