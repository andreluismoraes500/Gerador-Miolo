import { describe, it, expect } from "vitest";
import {
  formatLocalDate,
  gerarHorarios,
  somarMinutos,
  gerarDiasDoMes,
} from "../agendaUtils";

describe("formatLocalDate", () => {
  it("usa a data local, sem deslocamento de fuso", () => {
    expect(formatLocalDate(new Date(2026, 0, 5, 23, 59))).toBe("2026-01-05");
    expect(formatLocalDate(new Date(2026, 11, 31, 0, 0))).toBe("2026-12-31");
  });
});

describe("gerarHorarios", () => {
  it("gera slots do início ao fim", () => {
    const h = gerarHorarios("08:00", "09:00", 30);
    expect(h[0]).toBe("08:00");
    expect(h.length).toBeGreaterThanOrEqual(2);
  });
});

describe("somarMinutos", () => {
  it("soma minutos a um horário HH:MM", () => {
    expect(somarMinutos("07:30", 45)).toBe("08:15");
  });
});

describe("gerarDiasDoMes", () => {
  it("retorna 29 dias em fevereiro de ano bissexto", () => {
    expect(gerarDiasDoMes(2028, 1)).toHaveLength(29);
  });
});
