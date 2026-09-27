import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TransactionTypeToggle } from "./TransactionTypeToggle";

describe("TransactionTypeToggle", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the type selector buttons and switches type", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <TransactionTypeToggle selectedType="EXPENSE" onChange={onChange} />,
    );

    expect(getByRole("button", { name: "Despesa" })).not.toBeNull();
    expect(getByRole("button", { name: "Receita" })).not.toBeNull();

    fireEvent.click(getByRole("button", { name: "Receita" }));
    expect(onChange).toHaveBeenCalledWith("INCOME");
  });

  it("renders the income-selected state", () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <TransactionTypeToggle selectedType="INCOME" onChange={onChange} />,
    );

    fireEvent.click(getByRole("button", { name: "Despesa" }));

    expect(onChange).toHaveBeenCalledWith("EXPENSE");
    expect(getByRole("button", { name: "Receita" }).className).toContain(
      "border-[#16a34a]",
    );
  });
});
