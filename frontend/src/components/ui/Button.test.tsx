import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders the primary variant by default", () => {
    const { getByRole } = render(<Button>Save</Button>);

    const button = getByRole("button", { name: "Save" });
    expect(button.className).toContain("bg-[#1f6f43]");
  });

  it("renders alternative variants", () => {
    const onClick = vi.fn();

    const { getByRole } = render(
      <Button variant="danger" onClick={onClick}>
        Delete
      </Button>,
    );

    const button = getByRole("button", { name: "Delete" });
    expect(button.className).toContain("bg-[#dc2626]");
  });
});
