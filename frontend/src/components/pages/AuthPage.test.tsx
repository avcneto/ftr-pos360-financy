import { cleanup, render, waitFor } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

const navigate = vi.fn();
const authState = vi.hoisted(() => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  token: null as string | null,
}));

vi.mock("../../providers/useAuth", () => ({
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

import { AuthPage } from "./AuthPage";

describe("AuthPage", () => {
  afterEach(() => {
    cleanup();
    authState.token = null;
    navigate.mockReset();
  });

  it("renders the sign in form", () => {
    const { getByAltText, getByRole } = render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );

    expect(getByAltText("Financy")).not.toBeNull();
    expect(getByRole("heading", { name: "Fazer login" })).not.toBeNull();
    expect(getByRole("button", { name: "Entrar" })).not.toBeNull();
  });

  it("toggles between login and signup modes", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );

    fireEvent.click(getByRole("button", { name: "Criar conta" }));

    expect(getByRole("heading", { name: "Criar conta" })).not.toBeNull();
  });

  it("redirects authenticated users back to the dashboard", async () => {
    authState.token = "token-1";

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith("/");
    });
  });
});
