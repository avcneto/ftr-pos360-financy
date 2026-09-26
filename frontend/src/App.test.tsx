import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "./App";

describe("App", () => {
  it("renders the public auth screen when there is no session", async () => {
    localStorage.clear();

    render(<App />);

    expect(await screen.findByRole("heading", { name: "Sign in" })).toBeTruthy();
  });
});