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
      <TransactionForm
        categories={categories}
        editingTransaction={null}
        onSave={vi.fn()}
      />,
    );

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Draft" },
    });

    rerender(
      <TransactionForm
        categories={categories}
        editingTransaction={
          {
            id: "tx-1",
            title: "Salary",
            amount: 2500,
            type: "INCOME",
            date: "2025-01-02T00:00:00.000Z",
            description: "Monthly payment",
            categoryId: "cat-1",
          } as never
        }
        onSave={vi.fn()}
      />,
    );

    expect(
      (container.querySelector('input[name="title"]') as HTMLInputElement)
        .value,
    ).toBe("Salary");
    expect(
      (container.querySelector('input[name="amount"]') as HTMLInputElement)
        .value,
    ).toBe("2.500,00");
    expect(
      (
        container.querySelector(
          'select[name="categoryId"]',
        ) as HTMLSelectElement
      ).value,
    ).toBe("cat-1");
  });

  it("shows validation errors and submits a valid transaction", async () => {
    const categories: Category[] = [{ id: "cat-1", title: "Food" } as Category];
    const onSave = vi.fn().mockResolvedValue(undefined);

    const { container, getByRole, getByText } = render(
      <TransactionForm
        categories={categories}
        editingTransaction={null}
        onSave={onSave}
      />,
    );

    fireEvent.submit(
      getByRole("button", { name: "Salvar" }).closest("form")!,
    );

    await waitFor(() => {
      expect(getByText("Informe uma descrição com pelo menos 2 caracteres.")).not.toBeNull();
    });

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Salary" },
    });
    fireEvent.change(container.querySelector('input[name="amount"]')!, {
      target: { value: "1.234,56" },
    });
    fireEvent.blur(container.querySelector('input[name="amount"]')!);
    expect((container.querySelector('input[name="amount"]') as HTMLInputElement).value).toBe("1.234,56");
    fireEvent.click(getByRole("button", { name: "Receita" }));
    fireEvent.change(container.querySelector('input[name="date"]')!, {
      target: { value: "2025-01-02" },
    });
    fireEvent.submit(
      getByRole("button", { name: "Salvar" }).closest("form")!,
    );

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: "Salary",
        amount: 1234.56,
        type: "INCOME",
        date: "2025-01-02",
        description: undefined,
        categoryId: null,
      });
    });
  });

  it("shows submit failures when saving a transaction", async () => {
    const categories: Category[] = [{ id: "cat-1", title: "Food" } as Category];
    const onSave = vi
      .fn()
      .mockRejectedValue(new Error("Não foi possível salvar a transação."));

    const { container, getByRole, getByText } = render(
      <TransactionForm
        categories={categories}
        editingTransaction={null}
        onSave={onSave}
      />,
    );

    fireEvent.change(container.querySelector('input[name="title"]')!, {
      target: { value: "Salary" },
    });
    fireEvent.change(container.querySelector('input[name="amount"]')!, {
      target: { value: "2500" },
    });
    fireEvent.submit(
      getByRole("button", { name: "Salvar" }).closest("form")!,
    );

    await waitFor(() => {
      expect(getByText("Não foi possível salvar a transação.")).not.toBeNull();
    });
  });

  it("formats large amounts while typing and saves their numeric value", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { getByLabelText, getByRole } = render(
      <TransactionForm categories={[]} editingTransaction={null} onSave={onSave} />,
    );

    fireEvent.change(getByLabelText("Descrição"), { target: { value: "Venda" } });
    const amountInput = getByLabelText("Valor") as HTMLInputElement;
    fireEvent.focus(amountInput);
    for (const digit of "100000000") {
      const start = amountInput.selectionStart ?? amountInput.value.length;
      const end = amountInput.selectionEnd ?? start;
      fireEvent.change(amountInput, {
        target: {
          value: `${amountInput.value.slice(0, start)}${digit}${amountInput.value.slice(end)}`,
          selectionStart: start + 1,
          selectionEnd: start + 1,
        },
      });
    }
    expect(amountInput.value).toBe("100.000.000,00");

    fireEvent.click(getByRole("button", { name: "Salvar" }));
    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ amount: 100000000 }));
    });
  });
});
