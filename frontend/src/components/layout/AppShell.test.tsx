import { cleanup, fireEvent, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const navigate = vi.fn();
const authState = vi.hoisted(() => ({
  user: { name: "Ada", email: "ada@example.com" },
  signOut: vi.fn(),
}));

vi.mock("../../providers/AuthProvider", () => ({
  useAuth: () => authState,
}));

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

import { AppShell } from "./AppShell";

describe("AppShell", () => {
  afterEach(() => {
    cleanup();
    authState.signOut.mockReset();
    navigate.mockReset();
  });

  it("renders navigation and user info", () => {
    const { getByText } = render(
      <MemoryRouter>
        <AppShell>
          <div>Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    expect(getByText("Dashboard")).not.toBeNull();
    expect(getByText("Ada")).not.toBeNull();
    expect(getByText("Content")).not.toBeNull();
  });

  it("logs the user out", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <AppShell>
          <div>Content</div>
        </AppShell>
      </MemoryRouter>,
    );

    fireEvent.click(getByRole("button", { name: "Sign out" }));

    expect(authState.signOut).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith("/auth");
  });
});
