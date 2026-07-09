// src/components/AdSlot.jsx
//
// Slot de anúncio do Google AdSense, isolado num componente para poder ser
// colocado em qualquer página (grid de templates, sidebar do config, etc.)
// sem duplicar a lógica de carregamento.
//
// IMPORTANTE:
//   - Nunca usar dentro de páginas com a classe "printable-page" — o
//     "print:hidden" abaixo já impede que o anúncio apareça na impressão/
//     exportação, mas o ideal é nem montar o componente ali.
//   - Cada <AdSlot> precisa de um "slot" (ID do bloco de anúncio criado no
//     painel do AdSense). O "client" (ca-pub-XXXXXXXXXXXXXXXX) é o mesmo
//     em todo o site e fica melhor centralizado numa env var.
//
// Uso:
//   <AdSlot slot="1234567890" />
//   <AdSlot slot="1234567890" format="horizontal" className="my-6" />

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT = import.meta.env.VITE_ADSENSE_CLIENT || "";

export default function AdSlot({
  slot,
  format = "auto",
  fullWidthResponsive = true,
  className = "",
  label = "Publicidade",
}) {
  const insRef = useRef(null);
  const pushed = useRef(false);

  useEffect(() => {
    // Sem client configurado (ex: ambiente de desenvolvimento) — não tenta
    // carregar nada, evita erro no console.
    if (!ADSENSE_CLIENT || !slot) return;
    if (pushed.current) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      // Bloqueadores de anúncio derrubam esse push com frequência —
      // não deixamos isso quebrar o resto da página.
      console.warn("AdSlot: falha ao carregar anúncio", err);
    }
  }, [slot]);

  if (!ADSENSE_CLIENT || !slot) return null;

  return (
    <div className={`print:hidden ${className}`}>
      <span className="block text-center text-[10px] uppercase tracking-widest text-gray-400 mb-1">
        {label}
      </span>
      <ins
        ref={insRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
