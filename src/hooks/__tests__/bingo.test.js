import { describe, it, expect } from "vitest";
import {
  generateBingoCard,
  BINGO_LETTERS,
  BINGO_RANGES,
} from "../useTalonarioBuilder";

describe("generateBingoCard", () => {
  it("gera 5 colunas com números únicos dentro da faixa de cada letra", () => {
    const card = generateBingoCard(false);
    for (const l of BINGO_LETTERS) {
      const [min, max] = BINGO_RANGES[l];
      expect(card[l]).toHaveLength(5);
      expect(new Set(card[l]).size).toBe(5);
      card[l].forEach((n) => {
        expect(n).toBeGreaterThanOrEqual(min);
        expect(n).toBeLessThanOrEqual(max);
      });
    }
  });

  it("com espaço livre, coloca null no centro da coluna N", () => {
    const card = generateBingoCard(true);
    expect(card.N).toHaveLength(5);
    expect(card.N[2]).toBeNull();
  });
});
