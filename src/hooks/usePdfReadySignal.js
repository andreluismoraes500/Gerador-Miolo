// src/hooks/usePdfReadySignal.js
//
// Sinaliza para o Puppeteer (backend) que a renderização de impressão
// terminou. Diferente da versão antiga (setTimeout fixo de 100ms), aqui
// esperamos o DOM "estabilizar": ficamos observando o container com um
// MutationObserver e só marcamos window.__PDF_READY__ = true quando o
// número de nós filhos parar de mudar por `stableMs` consecutivos.
//
// Isso é necessário porque templates grandes (ex: "anualLivre", com ~365
// páginas) podem levar bem mais que 100ms para montar tudo no DOM,
// especialmente em produção (CPU mais lenta em serverless) ou quando o
// layout depende de imagens (logo, marca d'água, fundo) carregando.
//
// `ready` deve ser true somente quando as condições prévias (template
// carregado, módulos carregados, etc.) já estiverem satisfeitas — o hook
// não sabe nada sobre isso, só observa o DOM.

import { useEffect } from "react";

const STABLE_MS = 400; // tempo sem mutações para considerar "estável"
const MAX_WAIT_MS = 45000; // teto de segurança (não trava para sempre)
const POLL_MS = 100;

export function usePdfReadySignal(
  containerRef,
  { printing, ready, pageSelector = ".page-break" },
) {
  useEffect(() => {
    if (!printing || !ready) return;
    if (!containerRef.current) return;

    // Reset do sinal a cada nova renderização de impressão, para que o
    // backend nunca leia um __PDF_READY__ "velho" de uma página anterior.
    window.__PDF_READY__ = false;
    window.__PDF_PAGE_COUNT__ = 0;

    let cancelled = false;
    let lastMutationAt = Date.now();
    const startedAt = Date.now();

    const observer = new MutationObserver(() => {
      lastMutationAt = Date.now();
    });

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false,
    });

    const interval = setInterval(() => {
      if (cancelled) return;

      const now = Date.now();
      const stableFor = now - lastMutationAt;
      const elapsed = now - startedAt;

      const isStable = stableFor >= STABLE_MS;
      const timedOut = elapsed >= MAX_WAIT_MS;

      if (isStable || timedOut) {
        clearInterval(interval);
        observer.disconnect();

        if (!containerRef.current) return;

        // Duplo requestAnimationFrame: garante que o navegador já pintou
        // o último frame antes de liberarmos o sinal para o Puppeteer.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (!containerRef.current) return;
            const pageBreaks =
              containerRef.current.querySelectorAll(pageSelector);
            const count = pageBreaks.length;
            window.__PDF_READY__ = true;
            window.__PDF_PAGE_COUNT__ = count;
            if (timedOut && !isStable) {
              console.warn(
                `[usePdfReadySignal] Timeout de ${MAX_WAIT_MS}ms atingido antes do DOM estabilizar. Prosseguindo com ${count} página(s) mesmo assim.`,
              );
            } else {
              console.log(
                `[usePdfReadySignal] PDF pronto: ${count} página(s) (estável por ${stableFor}ms).`,
              );
            }
          });
        });
      }
    }, POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printing, ready]);
}