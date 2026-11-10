import { useCallback, useState } from "react";

// Estado com desfazer/refazer. `set(fn, false)` altera sem registrar histórico.
export function useHistoria(inicial) {
  const [h, setH] = useState({ passado: [], presente: inicial, futuro: [] });
  const set = useCallback((fn, registrar = true) => setH((s) => {
    const novo = typeof fn === "function" ? fn(s.presente) : fn;
    if (novo === s.presente) return s;
    return registrar ? { passado: [...s.passado.slice(-80), s.presente], presente: novo, futuro: [] } : { ...s, presente: novo };
  }), []);
  const desfazer = useCallback(() => setH((s) => (s.passado.length ? { passado: s.passado.slice(0, -1), presente: s.passado.at(-1), futuro: [s.presente, ...s.futuro] } : s)), []);
  const refazer = useCallback(() => setH((s) => (s.futuro.length ? { passado: [...s.passado, s.presente], presente: s.futuro[0], futuro: s.futuro.slice(1) } : s)), []);
  const reiniciar = useCallback((v) => setH({ passado: [], presente: v, futuro: [] }), []);
  return { estado: h.presente, set, desfazer, refazer, reiniciar, podeDesfazer: h.passado.length > 0, podeRefazer: h.futuro.length > 0 };
}
