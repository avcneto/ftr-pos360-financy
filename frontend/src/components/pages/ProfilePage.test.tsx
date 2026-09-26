import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
}));

vi.mock("../../providers/AuthProvider", () => ({
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
    const { getByRole, getByText } = render(<ProfilePage />);

    expect(getByRole("heading", { name: "Profile" })).not.toBeNull();
    expect(getByText("Ada Lovelace")).not.toBeNull();
    expect(getByText("ada@example.com")).not.toBeNull();
  });

  it("calls sign out when the button is clicked", () => {
    const { getByRole } = render(<ProfilePage />);

    fireEvent.click(getByRole("button", { name: "Sign out" }));

    expect(authState.signOut).toHaveBeenCalledTimes(1);
  });

  it("renders fallback values when the profile is missing", () => {
    authState.user = null as never;

    const { getByText } = render(<ProfilePage />);

    expect(getByText("User")).not.toBeNull();
    expect(getByText("No email")).not.toBeNull();
  });
});
