import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    category: {
      findUnique: vi.fn(),
    },
    transaction: {
      findMany: vi.fn(),
      count: vi.fn(),
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
  listTransactionsPageByUser,
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

  it("paginates and filters only the authenticated user's transactions", async () => {
    prismaMock.transaction.count.mockResolvedValueOnce(27);
    prismaMock.transaction.findMany.mockResolvedValueOnce([{ id: "tx-11" }]);

    await expect(listTransactionsPageByUser("user-1", {
      page: 2,
      pageSize: 10,
      search: "Almoço",
      type: "EXPENSE",
      categoryId: "cat-1",
      month: "2025-11",
    })).resolves.toEqual({ items: [{ id: "tx-11" }], total: 27, page: 2 });

    const where = {
      userId: "user-1",
      title: { contains: "Almoço" },
      type: "EXPENSE",
      categoryId: "cat-1",
      date: { gte: new Date("2025-11-01T00:00:00.000Z"), lt: new Date("2025-12-01T00:00:00.000Z") },
    };
    expect(prismaMock.transaction.count).toHaveBeenCalledWith({ where });
    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith({
      where,
      orderBy: [{ date: "desc" }, { id: "desc" }],
      skip: 10,
      take: 10,
      include: { category: true },
    });
  });

  it("returns the last valid page after records are removed", async () => {
    prismaMock.transaction.count.mockResolvedValueOnce(20);
    prismaMock.transaction.findMany.mockResolvedValueOnce([{ id: "tx-20" }]);

    await expect(listTransactionsPageByUser("user-1", { page: 3, pageSize: 10 }))
      .resolves.toEqual({ items: [{ id: "tx-20" }], total: 20, page: 2 });
    expect(prismaMock.transaction.findMany).toHaveBeenCalledWith(expect.objectContaining({ skip: 10, take: 10 }));
  });

  it("rejects invalid pagination parameters", async () => {
    await expect(listTransactionsPageByUser("user-1", { page: 0, pageSize: 10 })).rejects.toThrow("Página inválida.");
    await expect(listTransactionsPageByUser("user-1", { page: 1, pageSize: 101 })).rejects.toThrow("Tamanho da página inválido.");
    await expect(listTransactionsPageByUser("user-1", { page: 1, pageSize: 10, month: "2025-13" })).rejects.toThrow("Período inválido.");
    expect(prismaMock.transaction.findMany).not.toHaveBeenCalled();
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
    ).rejects.toThrow("Categoria não encontrada.");
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
    ).rejects.toThrow("Transação não encontrada.");
  });

  it("rejects update when transaction belongs to another user", async () => {
    prismaMock.transaction.findUnique.mockResolvedValueOnce({
      id: "tx-1",
      userId: "other-user",
    });

    await expect(
      updateTransaction("tx-1", { title: "Updated" }, "user-1"),
    ).rejects.toThrow("Transação não encontrada.");
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
    ).rejects.toThrow("Categoria não encontrada.");
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
      "Transação não encontrada.",
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
