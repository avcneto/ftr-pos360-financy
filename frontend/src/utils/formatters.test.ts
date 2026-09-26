import { describe, expect, it } from "vitest";
import { formatCurrency, formatDate } from "./formatters";

describe("formatters", () => {
  it("formats currency values", () => {
    expect(formatCurrency(1250)).toMatch(/\$/);
  });

  it("formats dates", () => {
    expect(formatDate("2025-01-02T00:00:00.000Z")).toContain("2025");
  });
});
