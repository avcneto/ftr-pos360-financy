import { describe, expect, it } from "vitest";
import { formatCurrency, formatCurrencyInput, formatDate, formatShortDate, isInCalendarMonth, parseCurrencyInput } from "./formatters";

describe("formatters", () => {
  it("formats currency values", () => {
    expect(formatCurrency(1250)).toMatch(/R\$.*1\.250,00/);
    expect(formatCurrencyInput(1234.5)).toBe("1.234,50");
    expect(parseCurrencyInput("R$ 1.234,56")).toBe(1234.56);
    expect(parseCurrencyInput("2500")).toBe(2500);
    expect(parseCurrencyInput("2500.50")).toBe(2500.5);
    expect(parseCurrencyInput("")).toBe(0);
  });

  it("formats dates", () => {
    expect(formatDate("2025-01-02T00:00:00.000Z")).toContain("2 de jan. de 2025");
    expect(formatShortDate("2025-11-30T00:00:00.000Z")).toBe("30/11/25");
  });

  it("uses the transaction calendar date for monthly totals", () => {
    const april = new Date(2026, 3, 15);
    expect(isInCalendarMonth("2026-04-01T00:00:00.000Z", april)).toBe(true);
    expect(isInCalendarMonth("2026-03-31T00:00:00.000Z", april)).toBe(false);
    expect(isInCalendarMonth("2026-05-01T00:00:00.000Z", april)).toBe(false);
  });
});
