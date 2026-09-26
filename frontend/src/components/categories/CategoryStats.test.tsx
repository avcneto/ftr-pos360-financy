import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryStats } from "./CategoryStats";

describe("CategoryStats", () => {
  it("renders the summary values", () => {
    const { getByText } = render(
      <CategoryStats total={2} withDescription={1} withCustomColor={1} />,
    );

    expect(getByText("Total categories")).not.toBeNull();
    expect(getByText("With description")).not.toBeNull();
    expect(getByText("Custom colors")).not.toBeNull();
  });
});
