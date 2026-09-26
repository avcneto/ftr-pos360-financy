import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
    const { getByRole, getByText } = render(<DashboardPage />);

    expect(getByRole("heading", { name: "Dashboard" })).not.toBeNull();
    expect(getByText("Income")).not.toBeNull();
    expect(getByText(/Food/)).not.toBeNull();
  });

  it("renders the loading state", () => {
    summaryState.categories = [];
    summaryState.recentTransactions = [];
    summaryState.income = 0;
    summaryState.expense = 0;
    summaryState.balance = 0;
    summaryState.isLoading = true;

    const { getByText } = render(<DashboardPage />);

    expect(getByText("Loading overview...")).not.toBeNull();
  });
});
