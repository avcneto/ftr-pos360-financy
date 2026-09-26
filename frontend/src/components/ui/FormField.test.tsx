import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("renders label, content and error", () => {
    const { getByText } = render(
      <FormField label="Email" error="Invalid email">
        <input />
      </FormField>,
    );

    expect(getByText("Email")).not.toBeNull();
    expect(getByText("Invalid email")).not.toBeNull();
  });
});
