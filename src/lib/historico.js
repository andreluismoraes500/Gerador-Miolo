// Desfazer / refazer para um store (agrupa alterações seguidas, ex.: arrastar, em um só passo).
import { useCallback, useEffect, useRef, useState } from "react";

export function useHistorico(store) {
  const cfg = store.useStore();
  const r = useRef({ passado: [], futuro: [], base: cfg, aplicando: false, t: null });
  const [est, setEst] = useState({ p: 0, f: 0, base: cfg });
  const marca = () => { const s = r.current; setEst({ p: s.passado.length, f: s.futuro.length, base: s.base }); };

  const fechar = useCallback(() => {
    const s = r.current;
    clearTimeout(s.t);
    const atual = store.get();
    if (atual !== s.base) {
      s.passado.push(s.base);
      if (s.passado.length > 60) s.passado.shift();
      s.base = atual;
      s.futuro = [];
      marca();
    }
  }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const s = r.current;
    if (s.aplicando) { s.aplicando = false; s.base = cfg; return undefined; }
    if (cfg === s.base) return undefined;
    clearTimeout(s.t);
    s.t = setTimeout(fechar, 500);
    return () => clearTimeout(s.t);
  }, [cfg, fechar]);

  const desfazer = useCallback(() => {
    const s = r.current;
    fechar();
    if (!s.passado.length) return;
    const ant = s.passado.pop();
    s.futuro.push(store.get());
    s.aplicando = true; s.base = ant;
    store.set(ant);
    marca();
  }, [store, fechar]); // eslint-disable-line react-hooks/exhaustive-deps

  const refazer = useCallback(() => {
    const s = r.current;
    if (!s.futuro.length) return;
    const prox = s.futuro.pop();
    s.passado.push(store.get());
    s.aplicando = true; s.base = prox;
    store.set(prox);
    marca();
  }, [store]); // eslint-disable-line react-hooks/exhaustive-deps

  // Ctrl+Z / Ctrl+Y fora dos campos de texto
  useEffect(() => {
    const f = (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)) return;
      const k = e.key.toLowerCase();
      if (k === "z" && !e.shiftKey) { e.preventDefault(); desfazer(); }
      else if (k === "y" || (k === "z" && e.shiftKey)) { e.preventDefault(); refazer(); }
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, [desfazer, refazer]);

  return { desfazer, refazer, podeDesfazer: est.p > 0 || cfg !== est.base, podeRefazer: est.f > 0 };
}
