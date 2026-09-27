import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryStats } from "./CategoryStats";

describe("CategoryStats", () => {
  it("renders the summary values", () => {
    const { getByText } = render(
      <CategoryStats total={2} transactionTotal={1} mostUsedCategory="Food (1)" />,
    );

    expect(getByText("Total de categorias")).not.toBeNull();
    expect(getByText("Total de transações")).not.toBeNull();
    expect(getByText("Categoria mais utilizada")).not.toBeNull();
  });
});
