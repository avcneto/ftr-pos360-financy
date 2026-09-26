import { cleanup, render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const protectedState = vi.hoisted(() => ({
  token: null as string | null,
  loading: false,
}));

vi.mock("../../providers/AuthProvider", () => ({
  useAuth: () => protectedState,
}));

import { ProtectedRoute } from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  afterEach(() => {
    cleanup();
    protectedState.token = null;
    protectedState.loading = false;
  });

  it("redirects unauthenticated users", () => {
    const { queryByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <div>Secret</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(queryByText("Secret")).toBeNull();
  });

  it("shows the loading state", () => {
    protectedState.loading = true;

    const { getByText } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ProtectedRoute>
          <div>Secret</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(getByText("Loading your session...")).not.toBeNull();
  });
});
