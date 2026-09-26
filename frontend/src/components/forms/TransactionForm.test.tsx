import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Category } from "../../types";
import { TransactionForm } from "./TransactionForm";

describe("TransactionForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("resets when the editing transaction changes", () => {
    const categories: Category[] = [{ id: "cat-1", title: "Food" } as Category];

    const { container, rerender } = render(
      <TransactionForm categories={categories} editingTransaction={null} onSave={vi.fn()} />,
    );

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Draft" },
    });

    rerender(
      <TransactionForm
        categories={categories}
        editingTransaction={{
          id: "tx-1",
          title: "Salary",
          amount: 2500,
          type: "INCOME",
          date: "2025-01-02T00:00:00.000Z",
          description: "Monthly payment",
          categoryId: "cat-1",
        } as never}
        onSave={vi.fn()}
      />,
    );

    expect((container.querySelector('input[name="title"]') as HTMLInputElement).value).toBe(
      "Salary",
    );
    expect((container.querySelector('input[name="amount"]') as HTMLInputElement).value).toBe(
      "2500",
    );
    expect((container.querySelector('select[name="categoryId"]') as HTMLSelectElement).value).toBe(
      "cat-1",
    );
  });

  it("shows validation errors and submits a valid transaction", async () => {
    const categories: Category[] = [{ id: "cat-1", title: "Food" } as Category];
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { container, getByRole, getByText } = render(
      <TransactionForm categories={categories} editingTransaction={null} onSave={onSave} />,
    );

    fireEvent.submit(getByRole("button", { name: "Create transaction" }).closest("form")!);

    await waitFor(() => {
      expect(getByText("Title is required")).not.toBeNull();
    });

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Salary" },
    });
    fireEvent.change(container.querySelector('input[name="amount"]')!, {
      target: { value: "2500" },
    });
    fireEvent.click(getByRole("button", { name: "Income" }));
    fireEvent.change(container.querySelector('input[name="date"]')!, {
      target: { value: "2025-01-02" },
    });
    fireEvent.change(container.querySelector('textarea[name="description"]')!, {
      target: { value: "" },
    });
    fireEvent.submit(getByRole("button", { name: "Create transaction" }).closest("form")!);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: "Salary",
        amount: 2500,
        type: "INCOME",
        date: "2025-01-02",
        description: undefined,
        categoryId: null,
      });
    });
  });

  it("shows submit failures when saving a transaction", async () => {
    const categories: Category[] = [{ id: "cat-1", title: "Food" } as Category];
    const onSave = vi.fn().mockRejectedValue(new Error("Could not save transaction"));

    const { container, getByRole, getByText } = render(
      <TransactionForm categories={categories} editingTransaction={null} onSave={onSave} />,
    );

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Salary" },
    });
    fireEvent.change(container.querySelector('input[name="amount"]')!, {
      target: { value: "2500" },
    });
    fireEvent.submit(getByRole("button", { name: "Create transaction" }).closest("form")!);

    await waitFor(() => {
      expect(getByText("Could not save transaction")).not.toBeNull();
    });
  });
});
