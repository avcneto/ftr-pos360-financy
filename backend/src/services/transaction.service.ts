import { prisma } from "../db";
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
