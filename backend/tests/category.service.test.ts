import { beforeEach, describe, expect, it, vi } from "vitest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    category: {
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
  createCategory,
  deleteCategory,
  listCategoriesByUser,
  updateCategory,
} from "../src/services/category.service";

describe("category.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists categories from authenticated user", async () => {
    prismaMock.category.findMany.mockResolvedValueOnce([]);

    await listCategoriesByUser("user-1");

    expect(prismaMock.category.findMany).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      orderBy: { createdAt: "desc" },
    });
  });

  it("creates a category", async () => {
    const input = {
      title: "Food",
      description: "Meals",
      color: "#10B981",
      icon: "wallet",
      userId: "user-1",
    };

    prismaMock.category.create.mockResolvedValueOnce({ id: "cat-1", ...input });

    await createCategory(input);

    expect(prismaMock.category.create).toHaveBeenCalledWith({ data: input });
  });

  it("rejects update when category does not exist", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce(null);

    await expect(
      updateCategory("cat-1", { title: "Updated" }, "user-1"),
    ).rejects.toThrow("Category not found");
  });

  it("rejects update when category belongs to another user", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce({
      id: "cat-1",
      userId: "other-user",
    });

    await expect(
      updateCategory("cat-1", { title: "Updated" }, "user-1"),
    ).rejects.toThrow("Category not found");
  });

  it("updates category when ownership is valid", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce({
      id: "cat-1",
      userId: "user-1",
    });
    prismaMock.category.update.mockResolvedValueOnce({
      id: "cat-1",
      title: "Updated",
    });

    await updateCategory("cat-1", { title: "Updated" }, "user-1");

    expect(prismaMock.category.update).toHaveBeenCalledWith({
      where: { id: "cat-1" },
      data: { title: "Updated" },
    });
  });

  it("rejects delete when category does not belong to user", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce({
      id: "cat-1",
      userId: "other-user",
    });

    await expect(deleteCategory("cat-1", "user-1")).rejects.toThrow(
      "Category not found",
    );
  });

  it("deletes category when ownership is valid", async () => {
    prismaMock.category.findUnique.mockResolvedValueOnce({
      id: "cat-1",
      userId: "user-1",
    });
    prismaMock.category.delete.mockResolvedValueOnce({ id: "cat-1" });

    await expect(deleteCategory("cat-1", "user-1")).resolves.toBe(true);
    expect(prismaMock.category.delete).toHaveBeenCalledWith({
      where: { id: "cat-1" },
    });
  });
});
