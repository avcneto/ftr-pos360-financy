import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const transactionHooks = vi.hoisted(() => ({
  createTransaction: vi.fn(),
  updateTransaction: vi.fn(),
  deleteTransaction: vi.fn(),
}));

vi.mock("../../hooks/useCategories", () => ({
  useCategories: () => ({ categories: [{ id: "cat-1", title: "Food" }] }),
}));

vi.mock("../../hooks/useTransactions", () => ({
  useTransactions: () => ({
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
    createTransaction: transactionHooks.createTransaction,
    updateTransaction: transactionHooks.updateTransaction,
    deleteTransaction: transactionHooks.deleteTransaction,
    createPending: false,
    updatePending: false,
    deletePending: false,
  }),
}));

import { TransactionsPage } from "./TransactionsPage";

describe("TransactionsPage", () => {
  afterEach(() => {
    cleanup();
    transactionHooks.createTransaction.mockReset();
    transactionHooks.updateTransaction.mockReset();
    transactionHooks.deleteTransaction.mockReset();
  });

  it("renders transaction management content", () => {
    const { getByRole, getByText } = render(<TransactionsPage />);

    expect(getByRole("heading", { name: "Transactions" })).not.toBeNull();
    expect(getByText("Salary")).not.toBeNull();
    expect(getByRole("button", { name: "Create transaction" })).not.toBeNull();
  });

  it("creates, edits and deletes transactions", async () => {
    transactionHooks.createTransaction.mockResolvedValue(undefined);
    transactionHooks.updateTransaction.mockResolvedValue(undefined);
    transactionHooks.deleteTransaction.mockRejectedValue(
      new Error("Could not delete transaction"),
    );

    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => undefined);

    const { getByRole, getByLabelText } = render(<TransactionsPage />);

    fireEvent.change(getByLabelText("Title"), { target: { value: "Bonus" } });
    fireEvent.change(getByLabelText("Amount"), { target: { value: "300" } });
    fireEvent.click(getByRole("button", { name: "Income" }));
    fireEvent.click(getByRole("button", { name: "Create transaction" }));

    await waitFor(() => {
      expect(transactionHooks.createTransaction).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Bonus",
          amount: 300,
          type: "INCOME",
        }),
      );
    });

    fireEvent.click(getByRole("button", { name: "Edit" }));
    fireEvent.change(getByLabelText("Title"), {
      target: { value: "Updated salary" },
    });
    fireEvent.click(getByRole("button", { name: "Update transaction" }));

    await waitFor(() => {
      expect(transactionHooks.updateTransaction).toHaveBeenCalledWith({
        id: "tx-1",
        values: expect.objectContaining({ title: "Updated salary" }),
      });
    });

    fireEvent.click(getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith("Could not delete transaction");
    });
  });
});
