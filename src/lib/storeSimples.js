// Pequeno store persistente (localStorage) que dá para ler fora de componentes
// (ex.: dentro de `layout()` dos templates) e assinar dentro deles via hook.
import { useSyncExternalStore } from "react";

export function criarStore(chave, inicial) {
  let valor = inicial;
  try {
    const bruto = localStorage.getItem(chave);
    if (bruto) valor = { ...inicial, ...JSON.parse(bruto) };
  } catch {
    /* sem storage: segue com o padrão */
  }
  const ouvintes = new Set();
  const get = () => valor;
  const set = (parcial) => {
    valor = { ...valor, ...parcial };
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      /* ignora */
    }
    ouvintes.forEach((f) => f());
  };
  const subscribe = (f) => {
    ouvintes.add(f);
    return () => ouvintes.delete(f);
  };
  const useStore = () => useSyncExternalStore(subscribe, get, get);
  return { get, set, useStore };
}
