import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const summaryState = vi.hoisted(() => ({
  categories: [{ id: "cat-1", title: "Food", color: "#1f6f43", icon: "🍔" }],
  recentTransactions: [
    {
      id: "tx-1",
      title: "Salary",
      amount: 2500,
      type: "INCOME",
      date: "2025-01-02",
      category: { title: "General" },
    },
  ],
  transactions: [],
  monthlyIncome: 2500,
  monthlyExpense: 0,
  createTransaction: vi.fn(),
  income: 2500,
  expense: 0,
  balance: 2500,
  isLoading: false,
}));

vi.mock("../../hooks/useDashboardSummary", () => ({
  useDashboardSummary: () => summaryState,
}));

import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  afterEach(() => {
    cleanup();
    summaryState.isLoading = false;
  });

  it("renders summary cards and recent data", () => {
    const { getByRole, getByText } = render(<MemoryRouter><DashboardPage /></MemoryRouter>);

    expect(getByRole("heading", { name: "Dashboard" })).not.toBeNull();
    expect(getByText("Receitas do mês")).not.toBeNull();
    expect(getByText(/Food/)).not.toBeNull();
  });

  it("renders the loading state", () => {
    summaryState.categories = [];
    summaryState.recentTransactions = [];
    summaryState.income = 0;
    summaryState.expense = 0;
    summaryState.balance = 0;
    summaryState.isLoading = true;

    const { getByText } = render(<MemoryRouter><DashboardPage /></MemoryRouter>);

    expect(getByText("Carregando resumo...")).not.toBeNull();
  });

  it("opens the new transaction form from the dashboard", async () => {
    summaryState.isLoading = false;
    summaryState.createTransaction.mockResolvedValueOnce(undefined);
    const { getByRole, getByLabelText } = render(<MemoryRouter><DashboardPage /></MemoryRouter>);
    fireEvent.click(getByRole("button", { name: "Nova transação" }));
    fireEvent.change(getByLabelText("Descrição"), { target: { value: "Almoço" } });
    fireEvent.change(getByLabelText("Valor"), { target: { value: "30" } });
    fireEvent.click(getByRole("button", { name: "Salvar" }));
    await waitFor(() => expect(summaryState.createTransaction).toHaveBeenCalledWith(expect.objectContaining({ title: "Almoço", amount: 30 })));
  });
});
