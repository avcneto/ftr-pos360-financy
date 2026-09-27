import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TransactionMetrics } from "./TransactionMetrics";

describe("TransactionMetrics", () => {
  it("renders the metric values", () => {
    const { getByText } = render(
      <TransactionMetrics income={100} expense={50} total={3} />,
    );

    expect(getByText("Entradas")).not.toBeNull();
    expect(getByText("Saídas")).not.toBeNull();
    expect(getByText("Total de registros")).not.toBeNull();
  });
});
