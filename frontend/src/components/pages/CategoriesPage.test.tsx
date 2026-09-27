import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const categoryHooks = vi.hoisted(() => ({
  createCategory: vi.fn(),
  updateCategory: vi.fn(),
  deleteCategory: vi.fn(),
}));

vi.mock("../../hooks/useCategories", () => ({
  useCategories: () => ({
    categories: [
      {
        id: "cat-1",
        title: "Food",
        description: "Meals",
        color: "#1f6f43",
        icon: "🍔",
      },
    ],
    isLoading: false,
    createCategory: categoryHooks.createCategory,
    updateCategory: categoryHooks.updateCategory,
    deleteCategory: categoryHooks.deleteCategory,
    createPending: false,
    updatePending: false,
    deletePending: false,
  }),
}));
vi.mock("../../hooks/useTransactions", () => ({ useTransactions: () => ({ transactions: [], isLoading: false }) }));

import { CategoriesPage } from "./CategoriesPage";

describe("CategoriesPage", () => {
  afterEach(() => {
    cleanup();
    categoryHooks.createCategory.mockReset();
    categoryHooks.updateCategory.mockReset();
    categoryHooks.deleteCategory.mockReset();
  });

  it("renders category management content", () => {
    const { getByRole } = render(<CategoriesPage />);

    expect(getByRole("heading", { name: "Categorias" })).not.toBeNull();
    expect(getByRole("heading", { name: "Food" })).not.toBeNull();
    expect(getByRole("button", { name: "Nova categoria" })).not.toBeNull();
  });

  it("creates, edits and deletes categories", async () => {
    categoryHooks.createCategory.mockResolvedValue(undefined);
    categoryHooks.updateCategory.mockResolvedValue(undefined);
    categoryHooks.deleteCategory.mockRejectedValue(
      new Error("Could not delete category"),
    );

    const { getByRole, getByLabelText } = render(<CategoriesPage />);

    fireEvent.click(getByRole("button", { name: "Nova categoria" }));
    fireEvent.change(getByLabelText("Título"), { target: { value: "Travel" } });
    fireEvent.change(getByLabelText("Descrição (opcional)"), {
      target: { value: "Trips" },
    });
    fireEvent.click(getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(categoryHooks.createCategory).toHaveBeenCalledWith(
        expect.objectContaining({ title: "Travel", description: "Trips" }),
      );
    });

    fireEvent.click(getByRole("button", { name: "Editar Food" }));
    fireEvent.change(getByLabelText("Título"), {
      target: { value: "Updated food" },
    });
    fireEvent.click(getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(categoryHooks.updateCategory).toHaveBeenCalledWith({
        id: "cat-1",
        values: expect.objectContaining({ title: "Updated food" }),
      });
    });

    fireEvent.click(getByRole("button", { name: "Excluir Food" }));

    await waitFor(() => {
      expect(getByRole("alert").textContent).toBe("Could not delete category");
    });
  });
});
