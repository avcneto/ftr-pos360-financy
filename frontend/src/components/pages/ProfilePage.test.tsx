import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

const authState = vi.hoisted(() => ({
  defaultUser: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
  },
  user: {
    name: "Ada Lovelace",
    email: "ada@example.com",
    createdAt: "2025-01-01T00:00:00.000Z",
    updatedAt: "2025-01-02T00:00:00.000Z",
  },
  signOut: vi.fn(),
  updateProfile: vi.fn(),
}));

vi.mock("../../providers/useAuth", () => ({
  useAuth: () => authState,
}));

import { ProfilePage } from "./ProfilePage";

describe("ProfilePage", () => {
  afterEach(() => {
    cleanup();
    authState.user = authState.defaultUser;
    authState.signOut.mockReset();
  });

  it("renders the profile data", () => {
    const { getByRole, getByText } = render(<MemoryRouter><ProfilePage /></MemoryRouter>);

    expect(getByRole("heading", { name: "Perfil" })).not.toBeNull();
    expect(getByText("Ada Lovelace")).not.toBeNull();
    expect(getByRole("textbox", { name: "E-mail" })).not.toBeNull();
  });

  it("calls sign out when the button is clicked", () => {
    const { getByRole } = render(<MemoryRouter><ProfilePage /></MemoryRouter>);

    fireEvent.click(getByRole("button", { name: "Sair da conta" }));

    expect(authState.signOut).toHaveBeenCalledTimes(1);
  });

  it("renders fallback values when the profile is missing", () => {
    authState.user = null as never;

    const { getByText } = render(<MemoryRouter><ProfilePage /></MemoryRouter>);

    expect(getByText("Usuário")).not.toBeNull();
    expect(getByText("Sem e-mail")).not.toBeNull();
  });

  it("updates the current user's name", async () => {
    authState.updateProfile.mockResolvedValueOnce(undefined);
    const { getByLabelText, getByRole } = render(<MemoryRouter><ProfilePage /></MemoryRouter>);
    fireEvent.change(getByLabelText("Nome completo"), { target: { value: "Ada Byron" } });
    fireEvent.click(getByRole("button", { name: "Salvar alterações" }));
    await waitFor(() => expect(authState.updateProfile).toHaveBeenCalledWith("Ada Byron"));
  });
});
