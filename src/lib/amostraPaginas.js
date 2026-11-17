// Prévia real na tela: renderiza as primeiras páginas do modelo (as mesmas da impressão).
import React from "react";

export const PAGINAS_AMOSTRA = 6;

export function paginasAmostra(def, props, n = PAGINAS_AMOSTRA) {
  try {
    const el = def.layout({ ...props, printing: true });
    if (!el || !el.props || el.props.children === undefined) return [];
    return React.Children.toArray(el.props.children)
      .filter((c) => React.isValidElement(c) && String(c.props?.className || "").includes("page-break"))
      .slice(0, n);
  } catch {
    return [];
  }
}
