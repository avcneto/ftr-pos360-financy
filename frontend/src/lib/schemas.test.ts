import { describe, expect, it } from "vitest";
import { categorySchema, signInSchema, signUpSchema, transactionSchema } from "./schemas";

describe("schemas", () => {
  it("validates sign in payloads", () => {
    expect(
      signInSchema.safeParse({ email: "a@b.com", password: "12345678" }).success,
    ).toBe(true);
    expect(
      signInSchema.safeParse({ email: "a@b.com", password: "1234567" }).success,
    ).toBe(false);
    expect(
      signUpSchema.safeParse({ name: "Ada", email: "a@b.com", password: "1234567" }).success,
    ).toBe(false);
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

    expect(parsed.color).toBe("#16a34a");
    expect(parsed.icon).toBe("✦");
  });
});
