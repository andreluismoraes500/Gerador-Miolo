// Gerenciamento de projetos do Mockup Studio (localStorage).
const CHAVE = "studio-projetos";

export function listarProjetos() {
  try { return JSON.parse(localStorage.getItem(CHAVE) || "[]"); } catch { return []; }
}
export function salvarProjeto(p) {
  const lista = listarProjetos().filter((x) => x.id !== p.id);
  lista.unshift({ ...p, atualizado: Date.now() });
  try {
    localStorage.setItem(CHAVE, JSON.stringify(lista.slice(0, 12)));
    return true;
  } catch { return false; }
}
export function excluirProjeto(id) {
  try { localStorage.setItem(CHAVE, JSON.stringify(listarProjetos().filter((x) => x.id !== id))); } catch { /* ignora */ }
}
export const novoId = () => Math.random().toString(36).slice(2, 10);
