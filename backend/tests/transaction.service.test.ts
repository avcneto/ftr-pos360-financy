import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    category: {
      findUnique: vi.fn(),
    },
    transaction: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../src/db", () => ({
  prisma: prismaMock,
}));

import {
  createTransaction,
  deleteTransaction,
  listTransactionsByUser,
  updateTransaction,
} from "../src/services/transaction.service";

describe("transaction.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists transactions from authenticated user", async () => {
    prismaMock.transaction.findMany.mockResolvedValueOnce([]);

    await listTransactionsByUser("user-1");

    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { date: "desc" },
      include: { category: true },
    });
  });

  it("rejects create when informed category belongs to another user", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce({
      id: "cat-1",
      userId: "other-user",
    });

    await expect(
      createTransaction({
        title: "Salary",
        amount: 1000,
        type: "INCOME",
        date: new Date("2025-01-01"),
        categoryId: "cat-1",
        userId: "user-1",
      }),
    ).rejects.toThrow("Category not found");
  });

  it("creates transaction without category", async () => {
    prismaMock.transaction.create.mockResolvedValueOnce({ id: "tx-1" });

    await createTransaction({
      title: "Salary",
      amount: 1000,
      type: "INCOME",
      date: new Date("2025-01-01"),
      categoryId: null,
      userId: "user-1",
    });

    expect(prismaMock.category.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.transaction.create).toHaveBeenCalledWith({
      data: {
        title: "Salary",
        amount: 1000,
        type: "INCOME",
        date: new Date("2025-01-01"),
        categoryId: null,
        userId: "user-1",
      },
      include: { category: true },
    });
  });

  it("rejects update when transaction does not exist", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce(null);

    await expect(
      updateTransaction("tx-1", { title: "Updated" }, "user-1"),
    ).rejects.toThrow("Transaction not found");
  });

  it("rejects update when transaction belongs to another user", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({
      id: "tx-1",
      userId: "other-user",
    });

    await expect(
      updateTransaction("tx-1", { title: "Updated" }, "user-1"),
    ).rejects.toThrow("Transaction not found");
  });

  it("rejects update when category is not owned by user", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({
      id: "tx-1",
      userId: "user-1",
    });
    prismaMock.category.findUnique.mockResolvedValueOnce({
      id: "cat-2",
      userId: "other-user",
    });

    await expect(
      updateTransaction("tx-1", { categoryId: "cat-2" }, "user-1"),
    ).rejects.toThrow("Category not found");
  });

  it("updates transaction and allows clearing category", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({
      id: "tx-1",
      userId: "user-1",
    });
    prismaMock.transaction.update.mockResolvedValueOnce({
      id: "tx-1",
      categoryId: null,
    });

    await updateTransaction("tx-1", { categoryId: null }, "user-1");

    expect(prismaMock.category.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.transaction.update).toHaveBeenCalledWith({
      where: { id: "tx-1" },
      data: { categoryId: null },
      include: { category: true },
    });
  });

  it("rejects delete when transaction does not belong to user", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({
      id: "tx-1",
      userId: "other-user",
    });

    await expect(deleteTransaction("tx-1", "user-1")).rejects.toThrow(
      "Transaction not found",
    );
  });

  it("deletes transaction when ownership is valid", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({
      id: "tx-1",
      userId: "user-1",
    });
    prismaMock.transaction.delete.mockResolvedValueOnce({ id: "tx-1" });

    await expect(deleteTransaction("tx-1", "user-1")).resolves.toBe(true);
    expect(prismaMock.transaction.delete).toHaveBeenCalledWith({
      where: { id: "tx-1" },
    });
  });
});
