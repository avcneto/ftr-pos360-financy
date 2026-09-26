import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardStatCard } from "./DashboardStatCard";

describe("DashboardStatCard", () => {
  it("renders the label and value", () => {
    const { getByText } = render(
      <DashboardStatCard label="Income" value="$2,500.00" tone="income" />,
    );

    expect(getByText("Income")).not.toBeNull();
    expect(getByText("$2,500.00")).not.toBeNull();
  });
});
