// src/utils/gsapAnimations.js
//
// Pequena camada de utilidades sobre o GSAP para padronizar as animações
// usadas no app (entrada de página, stagger de cards, micro-interações).
// Mantém as configurações (durações, easings) num único lugar para que
// todas as telas tenham a mesma "assinatura" de movimento.

import gsap from "gsap";

// Easing padrão do app: suave na entrada, sem "bounce" exagerado — combina
// com o visual editorial/papel do restante da UI.
export const EASE = "power3.out";

/**
 * Anima a entrada do cabeçalho/topo da página (usado uma vez, no mount).
 */
export function animateHeaderIn(el) {
  if (!el) return;
  gsap.fromTo(
    el,
    { y: -16, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.6, ease: EASE },
  );
}

/**
 * Transição simples de conteúdo entre rotas: fade + leve subida.
 * Retorna a instância do tween para permitir cleanup (kill) se necessário.
 */
export function animatePageIn(el) {
  if (!el) return null;
  return gsap.fromTo(
    el,
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.45, ease: EASE },
  );
}

/**
 * Stagger de entrada para uma lista de elementos (cards, seções, grid de
 * templates). Aceita um NodeList/array de elementos.
 */
export function staggerIn(elements, { delay = 0, stagger = 0.06 } = {}) {
  const targets = Array.from(elements || []).filter(Boolean);
  if (!targets.length) return null;
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 18, scale: 0.98 },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.5,
      ease: EASE,
      delay,
      stagger,
    },
  );
}

/**
 * Micro-interação de "pop" para hover/tap em cards e botões — pensada para
 * ser chamada em onMouseEnter/onMouseLeave (não usa CSS transition, então
 * não conflita com as classes do Tailwind já existentes).
 */
export function popHover(el, active) {
  if (!el) return;
  gsap.to(el, {
    scale: active ? 1.035 : 1,
    duration: 0.25,
    ease: "power2.out",
  });
}

/**
 * Pulso curto usado para chamar atenção para um elemento (ex.: destacar o
 * botão de CTA depois de uma ação do usuário).
 */
export function pulse(el) {
  if (!el) return;
  gsap.fromTo(
    el,
    { scale: 1 },
    { scale: 1.06, duration: 0.18, ease: "power1.out", yoyo: true, repeat: 1 },
  );
}
