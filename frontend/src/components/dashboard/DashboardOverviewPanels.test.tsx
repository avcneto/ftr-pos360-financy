import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Category, Transaction } from "../../types";
import { DashboardOverviewPanels } from "./DashboardOverviewPanels";
import { MemoryRouter } from "react-router-dom";

describe("DashboardOverviewPanels", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders recent transactions and categories", () => {
    const categories: Category[] = [
      { id: "cat-1", title: "Food", color: "#1f6f43", icon: "🍔" },
    ];
    const recentTransactions: Transaction[] = [
      {
        id: "tx-1",
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-02",
        categoryId: "cat-1",
        category: { id: "cat-1", title: "Food", color: "#1f6f43", icon: "utensils" },
      },
    ];

    const { getByRole, getByText, getAllByText } = render(
      <MemoryRouter><DashboardOverviewPanels
        categories={categories}
        recentTransactions={recentTransactions}
      /></MemoryRouter>,
    );

    expect(
      getByRole("heading", { name: "Transações recentes" }),
    ).not.toBeNull();
    expect(getByText("Salary")).not.toBeNull();
    expect(getAllByText(/Food/)).toHaveLength(2);
    expect(getByText("1 item")).not.toBeNull();
    expect(getAllByText(/R\$\s*2\.500,00/)).toHaveLength(2);
  });

  it("renders empty states and expense transactions", () => {
    const { getByText } = render(
      <MemoryRouter><DashboardOverviewPanels
        categories={[]}
        recentTransactions={[
          {
            id: "tx-2",
            title: "Groceries",
            amount: 120,
            type: "EXPENSE",
            date: "2025-01-03",
          },
        ]}
      /></MemoryRouter>,
    );

    expect(getByText(/−\s*R\$\s*120,00/)).not.toBeNull();
    expect(getByText("Nenhuma categoria cadastrada.")).not.toBeNull();
  });

  it("renders fallback category badges", () => {
    const { getByText } = render(
      <MemoryRouter><DashboardOverviewPanels
        categories={[
          {
            id: "cat-1",
            title: "General",
            color: null,
            icon: null,
          },
        ]}
        recentTransactions={[]}
      /></MemoryRouter>,
    );

    expect(getByText("General")).not.toBeNull();
  });
});
