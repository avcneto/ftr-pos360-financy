import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { Category, Transaction } from "../../types";
import { DashboardOverviewPanels } from "./DashboardOverviewPanels";

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
        category: { id: "cat-1", title: "General" },
      },
    ];

    const { getByRole, getByText } = render(
      <DashboardOverviewPanels
        categories={categories}
        recentTransactions={recentTransactions}
      />,
    );

    expect(
      getByRole("heading", { name: "Recent transactions" }),
    ).not.toBeNull();
    expect(getByText("Salary")).not.toBeNull();
    expect(getByText(/Food/)).not.toBeNull();
  });

  it("renders empty states and expense transactions", () => {
    const { getByText } = render(
      <DashboardOverviewPanels
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
      />,
    );

    expect(getByText("-$120.00")).not.toBeNull();
    expect(getByText("No categories available.")).not.toBeNull();
  });

  it("renders fallback category badges", () => {
    const { getByText } = render(
      <DashboardOverviewPanels
        categories={[
          {
            id: "cat-1",
            title: "General",
            color: null,
            icon: null,
          },
        ]}
        recentTransactions={[]}
      />,
    );

    expect(getByText("• General")).not.toBeNull();
  });
});
