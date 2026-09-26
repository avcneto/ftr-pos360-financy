import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders the header copy", () => {
    const { getByText, getByRole } = render(
      <PageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Track your financial health in one place."
      />,
    );

    expect(getByText("Overview")).not.toBeNull();
    expect(getByRole("heading", { name: "Dashboard" })).not.toBeNull();
    expect(
      getByText("Track your financial health in one place."),
    ).not.toBeNull();
  });
});
