// Projetos salvos no navegador (IndexedDB): configuração + imagens de Capas, Embalagens e Encarte.
// Além dos projetos nomeados, cada tela guarda um rascunho automático, para as imagens
// sobreviverem ao recarregar a página.
import { capasCfg, capasImgs } from "./capas";
import { embCfg, embImgs } from "./embalagens";
import { encarteCfg, encarteFotos, encarteLogo } from "./encarte";
import { stickersDados } from "./stickers";

const limpar = (o) => { Object.keys(o).forEach((k) => { delete o[k]; }); };
const filtraStk = (pref) => (i) => String(i.pagina).startsWith(pref);
const lerStk = (pref) => stickersDados.get().itens.filter(filtraStk(pref));
const aplicarStk = (pref, lista) => stickersDados.set({ itens: [...stickersDados.get().itens.filter((i) => !filtraStk(pref)(i)), ...(lista || [])] });

export const TIPOS = {
  capas: {
    nome: "Capas",
    ler: () => ({ cfg: capasCfg.get(), imgs: { ...capasImgs }, stk: lerStk("capa") }),
    imgs: () => ({ ...capasImgs }),
    aplicarImgs: (imgs) => { limpar(capasImgs); Object.assign(capasImgs, imgs || {}); },
    aplicar(p) { this.aplicarImgs(p.imgs); aplicarStk("capa", p.stk); capasCfg.set(p.cfg); },
  },
  embalagens: {
    nome: "Embalagens",
    ler: () => ({ cfg: embCfg.get(), imgs: { ...embImgs }, stk: lerStk("emb-") }),
    imgs: () => ({ ...embImgs }),
    aplicarImgs: (imgs) => { limpar(embImgs); Object.assign(embImgs, imgs || {}); },
    aplicar(p) { this.aplicarImgs(p.imgs); aplicarStk("emb-", p.stk); embCfg.set(p.cfg); },
  },
  encarte: {
    nome: "Encarte",
    ler: () => ({ cfg: encarteCfg.get(), imgs: { fotos: { ...encarteFotos }, logo: encarteLogo.url }, stk: [] }),
    imgs: () => ({ fotos: { ...encarteFotos }, logo: encarteLogo.url }),
    aplicarImgs: (imgs) => { limpar(encarteFotos); Object.assign(encarteFotos, imgs?.fotos || {}); encarteLogo.url = imgs?.logo || null; },
    aplicar(p) { this.aplicarImgs(p.imgs); encarteCfg.set(p.cfg); },
  },
};

// ---------- IndexedDB ----------
let dbp = null;
function abrir() {
  if (!dbp) {
    dbp = new Promise((ok, erro) => {
      if (typeof indexedDB === "undefined") { erro(new Error("sem IndexedDB")); return; }
      const rq = indexedDB.open("miolos-projetos", 1);
      rq.onupgradeneeded = () => { rq.result.createObjectStore("projetos", { keyPath: "id" }); };
      rq.onsuccess = () => ok(rq.result);
      rq.onerror = () => erro(rq.error);
    });
  }
  return dbp;
}
async function tx(modo, fn) {
  const db = await abrir();
  return new Promise((ok, erro) => {
    const t = db.transaction("projetos", modo);
    const r = fn(t.objectStore("projetos"));
    t.oncomplete = () => ok(r && "result" in r ? r.result : undefined);
    t.onerror = () => erro(t.error);
    t.onabort = () => erro(t.error);
  });
}

const novoId = () => `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

export async function listarProjetos(tipo) {
  const todos = (await tx("readonly", (s) => s.getAll())) || [];
  return todos.filter((p) => p.tipo === tipo && !p.rascunho).sort((a, b) => b.atualizado - a.atualizado);
}
export const obterProjeto = (id) => tx("readonly", (s) => s.get(id));
export const excluirProjeto = (id) => tx("readwrite", (s) => s.delete(id));

export async function salvarProjeto(tipo, nome, idExistente) {
  const dados = TIPOS[tipo].ler();
  const agora = Date.now();
  const antigo = idExistente ? await obterProjeto(idExistente) : null;
  const p = { id: antigo ? antigo.id : novoId(), tipo, nome: nome || "Sem nome", criado: antigo ? antigo.criado : agora, atualizado: agora, ...dados };
  await tx("readwrite", (s) => s.put(p));
  return p;
}
export async function duplicarProjeto(id) {
  const p = await obterProjeto(id);
  if (!p) return null;
  const c = { ...p, id: novoId(), nome: `${p.nome} (cópia)`, criado: Date.now(), atualizado: Date.now() };
  await tx("readwrite", (s) => s.put(c));
  return c;
}
export async function renomearProjeto(id, nome) {
  const p = await obterProjeto(id);
  if (p) await tx("readwrite", (s) => s.put({ ...p, nome: nome || p.nome }));
}
export async function abrirProjeto(id, tipo) {
  const p = await obterProjeto(id);
  if (!p || p.tipo !== tipo) return null;
  TIPOS[tipo].aplicar(p);
  return p;
}

// rascunho automático (só imagens; a configuração já fica no localStorage)
const idRasc = (tipo) => `rascunho:${tipo}`;
export const salvarRascunho = (tipo) => tx("readwrite", (s) => s.put({ id: idRasc(tipo), tipo, rascunho: true, atualizado: Date.now(), imgs: TIPOS[tipo].imgs() }));
export async function restaurarRascunho(tipo) {
  const p = await obterProjeto(idRasc(tipo));
  if (p?.imgs) { TIPOS[tipo].aplicarImgs(p.imgs); return true; }
  return false;
}
