import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    category: {
      findUnique: vi.fn(),
    },
    transaction: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("../src/db", () => ({
  prisma: prismaMock,
}));

import {
  assertCategoryOwnedByUser,
  assertTransactionOwnedByUser,
} from "../src/services/shared";

describe("shared service guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the category when ownership matches", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce({ id: "cat-1", userId: "user-1" });

    await expect(assertCategoryOwnedByUser("cat-1", "user-1")).resolves.toEqual({
      id: "cat-1",
      userId: "user-1",
    });
  });

  it("throws when the category is missing", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce(null);

    await expect(assertCategoryOwnedByUser("cat-1", "user-1")).rejects.toThrow(
      "Category not found",
    );
  });

  it("returns the transaction when ownership matches", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({ id: "tx-1", userId: "user-1" });

    await expect(assertTransactionOwnedByUser("tx-1", "user-1")).resolves.toEqual({
      id: "tx-1",
      userId: "user-1",
    });
  });

  it("throws when the transaction is missing", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce(null);

    await expect(assertTransactionOwnedByUser("tx-1", "user-1")).rejects.toThrow(
      "Transaction not found",
    );
  });
});