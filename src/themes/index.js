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
  semData: () => import("./semData.jsx"),
  diario: () => import("./diario.jsx"),
  diarioLivre: () => import("./diarioLivre.jsx"),
  diarioFloral: () => import("./diarioFloral.jsx"),
  floralMensal: () => import("./floralMensal.jsx"),
  floralAnual: () => import("./floralAnual.jsx"),
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
  cadernoReceitas: () => import("./cadernoReceitas.jsx"),
  bulletJournal: () => import("./bulletJournal.jsx"),
  babyBook: () => import("./babyBook.jsx"),
  listaChamada: () => import("./listaChamada.jsx"),
  boletim: () => import("./boletim.jsx"),
  planoAula: () => import("./planoAula.jsx"),
  caligrafia: () => import("./caligrafia.jsx"),
  noivas: () => import("./noivas.jsx"),
  partituras: () => import("./partituras.jsx"),
};

// Cache em memória: { [key]: { nome, layout } }.
const moduleCache = new Map();
// Carregamentos em andamento (evita baixar o mesmo chunk 2x em paralelo).
const inflight = new Map();

// Chave usada pra não entrar num loop de reload infinito.
const RELOAD_FLAG_KEY = "miolos:chunk-reload-attempt";

function isChunkLoadError(err) {
  const msg = String(err?.message || err || "");
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|dynamically imported module/i.test(
    msg,
  );
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Tenta o import algumas vezes com espera crescente. Na primeira visita a
// rede costuma estar fria/instável; uma nova tentativa quase sempre resolve
// sem precisar recarregar a página inteira.
async function importWithRetry(loader, tries = 3) {
  let lastErr;
  for (let i = 0; i < tries; i += 1) {
    try {
      return await loader();
    } catch (err) {
      lastErr = err;
      if (!isChunkLoadError(err)) throw err;
      await sleep(400 * (i + 1));
    }
  }
  throw lastErr;
}

/**
 * Carrega (ou devolve do cache) o módulo `{ nome, layout }` de um template.
 */
export function loadTemplate(key) {
  if (moduleCache.has(key)) return Promise.resolve(moduleCache.get(key));
  if (inflight.has(key)) return inflight.get(key);

  const loader = LOADERS[key];
  if (!loader) return Promise.resolve(null);

  const p = importWithRetry(loader)
    .then((mod) => {
      const def = mod.default;
      moduleCache.set(key, def);
      try {
        sessionStorage.removeItem(RELOAD_FLAG_KEY);
      } catch {
        /* noop */
      }
      return def;
    })
    .catch((err) => {
      // Só recarrega a página se as tentativas falharam (build novo no ar).
      if (isChunkLoadError(err) && typeof window !== "undefined") {
        let jaTentou = false;
        try {
          jaTentou = sessionStorage.getItem(RELOAD_FLAG_KEY) === key;
          if (!jaTentou) sessionStorage.setItem(RELOAD_FLAG_KEY, key);
        } catch {
          jaTentou = true; // sem sessionStorage: não arrisca loop de reload
        }
        if (!jaTentou) {
          window.location.reload();
          return new Promise(() => {});
        }
      }
      throw err;
    })
    .finally(() => inflight.delete(key));

  inflight.set(key, p);
  return p;
}

/** Versão síncrona: só retorna algo se o template já tiver sido carregado antes. */
export function getCachedTemplate(key) {
  return moduleCache.get(key) ?? null;
}

/** Dispara o carregamento de vários templates em paralelo (usado na Montagem). */
export function preloadTemplates(keys) {
  return Promise.all(keys.map((key) => loadTemplate(key)));
}
