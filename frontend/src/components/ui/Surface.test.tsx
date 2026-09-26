import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Surface } from "./Surface";

describe("Surface", () => {
  it("renders its children", () => {
    const { getByText } = render(<Surface>Content</Surface>);

    expect(getByText("Content")).not.toBeNull();
  });
});
