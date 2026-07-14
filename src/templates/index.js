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
  listaChamada: () => import("./listaChamada.jsx"),
  boletim: () => import("./boletim.jsx"),
  planoAula: () => import("./planoAula.jsx"),
  caligrafia: () => import("./caligrafia.jsx"),
  noivas: () => import("./noivas.jsx"),
  partituras: () => import("./partituras.jsx"),
};

// Cache em memória: { [key]: { nome, layout } }. Vive só durante a sessão
// (recarregar a página limpa, o que é aceitável — o chunk baixa rápido de
// novo, e o browser ainda tem o arquivo em cache HTTP).
const moduleCache = new Map();

// Chave usada pra não entrar num loop de reload infinito (ver mais abaixo).
const RELOAD_FLAG_KEY = "miolos:chunk-reload-attempt";

function isChunkLoadError(err) {
  const msg = String(err?.message || err || "");
  return /Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed|dynamically imported module/i.test(
    msg,
  );
}

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

  return loader()
    .then((mod) => {
      const def = mod.default;
      moduleCache.set(key, def);
      try {
        sessionStorage.removeItem(RELOAD_FLAG_KEY);
      } catch {
        /* sessionStorage indisponível (modo privado etc.) — sem problema */
      }
      return def;
    })
    .catch((err) => {
      // "Failed to fetch dynamically imported module" quase sempre significa
      // que o arquivo do chunk que o navegador tentou baixar não existe mais
      // com aquele hash — geralmente porque o Vite recompilou (dev: algum
      // arquivo foi salvo; produção: um novo deploy substituiu os assets)
      // enquanto o app já estava aberto na aba. A correção de verdade é
      // simples: recarregar a página, que baixa o build/lista de chunks
      // atual. Fazemos isso automaticamente, UMA única vez por sessão (a
      // flag em sessionStorage evita loop infinito se o erro for outra
      // coisa, tipo a internet ter caído de verdade).
      if (isChunkLoadError(err)) {
        let jaTentou = false;
        try {
          jaTentou = sessionStorage.getItem(RELOAD_FLAG_KEY) === key;
        } catch {
          /* sem sessionStorage: só segue sem o auto-reload */
        }
        if (!jaTentou && typeof window !== "undefined") {
          try {
            sessionStorage.setItem(RELOAD_FLAG_KEY, key);
          } catch {
            /* noop */
          }
          window.location.reload();
          // A página vai recarregar; devolvemos uma promise que nunca
          // resolve pra não deixar o `.then()` de quem chamou correr com
          // `undefined` no meio do reload.
          return new Promise(() => {});
        }
      }
      // Não é erro de chunk (ou já tentamos recarregar e continua falhando):
      // propaga pra quem chamou decidir o que mostrar na tela.
      throw err;
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
