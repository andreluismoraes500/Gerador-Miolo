import { describe, it, expect } from "vitest";
import {
  TEMPLATE_MANIFEST,
  TEMPLATE_CATEGORIAS,
  getTemplatesPorCategoria,
} from "../manifest";

describe("manifest de templates", () => {
  it("todo template tem uma categoria válida", () => {
    const ids = new Set(TEMPLATE_CATEGORIAS.map((c) => c.id));
    for (const [key, t] of Object.entries(TEMPLATE_MANIFEST)) {
      expect(ids.has(t.categoria), key).toBe(true);
    }
  });

  it("agrupa todos os templates sem perder nenhum", () => {
    const total = getTemplatesPorCategoria().reduce((n, g) => n + g.itens.length, 0);
    expect(total).toBe(Object.keys(TEMPLATE_MANIFEST).length);
  });

  it("busca ignora acento e maiúsculas", () => {
    const keys = getTemplatesPorCategoria("DIARIO").flatMap((g) => g.itens.map((i) => i.key));
    expect(keys).toContain("diario");
    expect(keys).toContain("diarioLivre");
  });
});
