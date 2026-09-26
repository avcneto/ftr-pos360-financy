import { prisma } from "../db";

export async function assertCategoryOwnedByUser(id: string, userId: string) {
  const category = await prisma.category.findUnique({ where: { id } });

  if (!category || category.userId !== userId) {
    throw new Error("Category not found");
  }

  return category;
}

export async function assertTransactionOwnedByUser(id: string, userId: string) {
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  if (!transaction || transaction.userId !== userId) {
    throw new Error("Transaction not found");
  }

  return transaction;
}
