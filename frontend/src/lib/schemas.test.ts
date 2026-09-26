import { describe, expect, it } from "vitest";
import { categorySchema, signInSchema, transactionSchema } from "./schemas";

describe("schemas", () => {
  it("validates sign in payloads", () => {
    expect(signInSchema.safeParse({ email: "a@b.com", password: "123456" }).success).toBe(
      true,
    );
  });

  it("rejects invalid transaction payloads", () => {
    expect(
      transactionSchema.safeParse({
        title: "",
        amount: -1,
        type: "EXPENSE",
        date: "",
      }).success,
    ).toBe(false);
  });

  it("fills defaults for category payloads", () => {
    const parsed = categorySchema.parse({ title: "Food" });

    expect(parsed.color).toBe("#1f6f43");
    expect(parsed.icon).toBe("✦");
  });
});
