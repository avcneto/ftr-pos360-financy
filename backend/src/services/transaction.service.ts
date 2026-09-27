import { prisma } from "../db";
import type { Prisma } from "@prisma/client";
import {
  assertCategoryOwnedByUser,
  assertTransactionOwnedByUser,
} from "./shared";

export async function listTransactionsByUser(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: { category: true },
  });
}

export type TransactionPageOptions = {
  page: number;
  pageSize: number;
  search?: string | null;
  type?: string | null;
  categoryId?: string | null;
  month?: string | null;
};

export async function listTransactionsPageByUser(userId: string, options: TransactionPageOptions) {
  const { page, pageSize } = options;
  if (!Number.isInteger(page) || page < 1) throw new Error("Página inválida.");
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new Error("Tamanho da página inválido.");
  if (options.type && options.type !== "INCOME" && options.type !== "EXPENSE") throw new Error("Tipo de transação inválido.");

  const where: Prisma.TransactionWhereInput = { userId };
  const search = options.search?.trim();
  if (search) where.title = { contains: search };
  if (options.type) where.type = options.type;
  if (options.categoryId) where.categoryId = options.categoryId;
  if (options.month) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(options.month)) throw new Error("Período inválido.");
    const [year, month] = options.month.split("-").map(Number);
    where.date = {
      gte: new Date(Date.UTC(year, month - 1, 1)),
      lt: new Date(Date.UTC(year, month, 1)),
    };
  }

  const total = await prisma.transaction.count({ where });
  const currentPage = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
  const items = await prisma.transaction.findMany({
    where,
    orderBy: [{ date: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { category: true },
  });

  return { items, total, page: currentPage };
}

export async function createTransaction(data: {
  title: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: Date;
  description?: string | null;
  categoryId?: string | null;
  userId: string;
}) {
  if (data.categoryId) {
    await assertCategoryOwnedByUser(data.categoryId, data.userId);
  }

  return prisma.transaction.create({
    data,
    include: { category: true },
  });
}

export async function updateTransaction(
  id: string,
  data: {
    title?: string;
    amount?: number;
    type?: "INCOME" | "EXPENSE";
    date?: Date;
    description?: string | null;
    categoryId?: string | null;
  },
  userId: string,
) {
  await assertTransactionOwnedByUser(id, userId);

  if (data.categoryId) {
    await assertCategoryOwnedByUser(data.categoryId, userId);
  }

  return prisma.transaction.update({
    where: { id },
    data,
    include: { category: true },
  });
}

export async function deleteTransaction(id: string, userId: string) {
  await assertTransactionOwnedByUser(id, userId);

  await prisma.transaction.delete({ where: { id } });
  return true;
}
