import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const transactionHooks = vi.hoisted(() => ({
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
  queryOptions: vi.fn(),
}));

vi.mock("../../hooks/useCategories", () => ({
  useCategories: () => ({ categories: [{ id: "cat-1", title: "Food" }] }),
}));

vi.mock("../../hooks/useTransactions", () => ({
  useTransactions: (options: { page: number }) => {
    transactionHooks.queryOptions(options);
    return {
    transactions: [
      {
        id: "tx-1",
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-02",
        description: "Monthly payment",
        categoryId: null,
        category: { title: "General" },
      },
    ],
    isLoading: false,
    total: 27,
    currentPage: options.page,
    createTransaction: transactionHooks.createTransaction,
    updateTransaction: transactionHooks.updateTransaction,
    deleteTransaction: transactionHooks.deleteTransaction,
    createPending: false,
    updatePending: false,
    deletePending: false,
    };
  },
}));

import { TransactionsPage } from "./TransactionsPage";

describe("TransactionsPage", () => {
  afterEach(() => {
    cleanup();
    transactionHooks.createTransaction.mockReset();
    transactionHooks.updateTransaction.mockReset();
    transactionHooks.deleteTransaction.mockReset();
    transactionHooks.queryOptions.mockReset();
  });

  it("renders transaction management content", () => {
    const { getByRole, getByText, queryByText } = render(<TransactionsPage />);

    expect(getByRole("heading", { name: "Transações" })).not.toBeNull();
    expect(getByText("Gerencie todas as suas transações financeiras")).not.toBeNull();
    expect(getByText("Salary")).not.toBeNull();
    expect(getByRole("button", { name: "Nova transação" })).not.toBeNull();
    expect(getByText("1 a 10 | 27 resultados")).not.toBeNull();
    fireEvent.click(getByRole("button", { name: "Página 2" }));
    expect(transactionHooks.queryOptions).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, pageSize: 10 }));
    expect(getByText("11 a 20 | 27 resultados")).not.toBeNull();
    fireEvent.change(getByRole("textbox", { name: "Buscar" }), { target: { value: "sal" } });
    expect(transactionHooks.queryOptions).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "sal" }));
    expect(queryByText("Entradas")).toBeNull();
    expect(queryByText("Saídas")).toBeNull();
    expect(queryByText("Total de registros")).toBeNull();
  });

  it("creates, edits and deletes transactions", async () => {
    transactionHooks.createTransaction.mockResolvedValue(undefined);
    transactionHooks.updateTransaction.mockResolvedValue(undefined);
    transactionHooks.deleteTransaction.mockRejectedValue(
      new Error("Could not delete transaction"),
    );

    const { getByRole, getByLabelText } = render(<TransactionsPage />);

    fireEvent.click(getByRole("button", { name: "Nova transação" }));
    fireEvent.change(getByLabelText("Descrição"), { target: { value: "Bonus" } });
    fireEvent.change(getByLabelText("Valor"), { target: { value: "300" } });
    fireEvent.click(getByRole("button", { name: "Receita" }));
    fireEvent.click(getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(transactionHooks.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Bonus",
          amount: 300,
          type: "INCOME",
        }),
      );
    });

    fireEvent.click(getByRole("button", { name: "Editar Salary" }));
    fireEvent.change(getByLabelText("Descrição"), {
      target: { value: "Updated salary" },
    });
    fireEvent.click(getByRole("button", { name: "Salvar" }));

    await waitFor(() => {
      expect(transactionHooks.updateTransaction).toHaveBeenCalledWith({
        id: "tx-1",
        values: expect.objectContaining({ title: "Updated salary" }),
      });
    });

    fireEvent.click(getByRole("button", { name: "Excluir Salary" }));

    await waitFor(() => {
      expect(getByRole("alert").textContent).toBe("Could not delete transaction");
    });
  });
});
