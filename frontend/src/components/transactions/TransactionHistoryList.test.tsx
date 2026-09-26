import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransactionHistoryList } from "./TransactionHistoryList";

describe("TransactionHistoryList", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders transaction rows", () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const { getByText, getByRole } = render(
      <TransactionHistoryList
        transactions={[
          {
            id: "tx-1",
            title: "Salary",
            amount: 100,
            type: "INCOME",
            date: "2025-01-01",
            category: { id: "cat-1", title: "General" },
          },
        ]}
        isLoading={false}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    expect(getByText("Salary")).not.toBeNull();
    expect(getByText("General")).not.toBeNull();

    fireEvent.click(getByRole("button", { name: "Edit" }));
    fireEvent.click(getByRole("button", { name: "Delete" }));

    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "tx-1", title: "Salary" }),
    );
    expect(onDelete).toHaveBeenCalledWith("tx-1");
  });

  it("renders loading and empty states", () => {
    const { getByText, rerender } = render(
      <TransactionHistoryList
        transactions={[]}
        isLoading={true}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(getByText("Loading transactions...")).not.toBeNull();

    rerender(
      <TransactionHistoryList
        transactions={[]}
        isLoading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(getByText("No transactions yet.")).not.toBeNull();
  });

  it("uses fallback values for transaction visuals", () => {
    const { getByText } = render(
      <TransactionHistoryList
        transactions={[
          {
            id: "tx-2",
            title: "Utilities",
            amount: 120,
            type: "EXPENSE",
            date: "2025-01-03",
            category: null,
          },
        ]}
        isLoading={false}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        deleteDisabled={true}
      />,
    );

    expect(getByText("General")).not.toBeNull();
    expect(getByText("-$120.00")).not.toBeNull();
  });
});
