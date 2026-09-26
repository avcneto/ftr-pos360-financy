import { prisma } from "../db";
import { assertCategoryOwnedByUser } from "./shared";

export async function listCategoriesByUser(userId: string) {
  return prisma.category.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCategory(data: {
  title: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
  userId: string;
}) {
  return prisma.category.create({ data });
}

export async function updateCategory(
  id: string,
  data: {
    title?: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
  },
  userId: string,
) {
  await assertCategoryOwnedByUser(id, userId);

  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string, userId: string) {
  await assertCategoryOwnedByUser(id, userId);

  await prisma.category.delete({ where: { id } });
  return true;
}
