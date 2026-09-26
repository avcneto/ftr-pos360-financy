import { act, cleanup, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { STORAGE_KEY } from "../constants/app";
import { AuthProvider, useAuth } from "./AuthProvider";

const { requestGraphQLMock } = vi.hoisted(() => ({
  requestGraphQLMock: vi.fn(),
}));
let currentAuth: ReturnType<typeof useAuth> | null = null;

vi.mock("../api/graphql", () => ({
  requestGraphQL: requestGraphQLMock,
}));

function AuthConsumer() {
  const auth = useAuth();
  currentAuth = auth;

  return (
    <div>
      <span data-testid="loading">{auth.loading ? "loading" : "ready"}</span>
      <span data-testid="token">{auth.token ?? "none"}</span>
      <span data-testid="user">{auth.user?.email ?? "none"}</span>
    </div>
  );
}

describe("AuthProvider", () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    localStorage.clear();
    requestGraphQLMock.mockReset();
    currentAuth = null;
  });

  it("throws when the hook is used outside the provider", () => {
    expect(() => render(<AuthConsumer />)).toThrow("Auth context not found");
  });

  it("loads the stored user and clears invalid sessions", async () => {
    localStorage.setItem(STORAGE_KEY, "stored-token");
    requestGraphQLMock.mockRejectedValueOnce(new Error("invalid token"));

    const view = render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(view.getByTestId("loading").textContent).toBe("ready");
    });
    expect(view.getByTestId("token").textContent).toBe("none");
    expect(view.getByTestId("user").textContent).toBe("none");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("signs in, signs up and signs out", async () => {
    requestGraphQLMock.mockImplementation(
      async (query: string, _variables?: unknown, token?: string) => {
        if (query.includes("SignIn")) {
          return {
            signIn: {
              token: "token-sign-in",
              user: {
                id: "user-1",
                name: "Ada Lovelace",
                email: "ada@example.com",
              },
            },
          };
        }

        if (query.includes("SignUp")) {
          return {
            signUp: {
              token: "token-sign-up",
              user: {
                id: "user-2",
                name: "Grace Hopper",
                email: "grace@example.com",
              },
            },
          };
        }

        if (query.includes("GetMe")) {
          if (token === "token-sign-up") {
            return {
              me: {
                id: "user-2",
                name: "Grace Hopper",
                email: "grace@example.com",
              },
            };
          }

          return {
            me: {
              id: "user-1",
              name: "Ada Lovelace",
              email: "ada@example.com",
            },
          };
        }

        throw new Error(`Unexpected query: ${query}`);
      },
    );

    const view = render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(view.getByTestId("loading").textContent).toBe("ready");
    });

    await act(async () => {
      await currentAuth!.signIn("ada@example.com", "secret");
    });

    await waitFor(() => {
      expect(view.getByTestId("token").textContent).toBe("token-sign-in");
    });
    expect(view.getByTestId("user").textContent).toBe("ada@example.com");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("token-sign-in");

    await act(async () => {
      await currentAuth!.signUp("Grace Hopper", "grace@example.com", "secret");
    });

    await waitFor(() => {
      expect(view.getByTestId("token").textContent).toBe("token-sign-up");
    });
    expect(view.getByTestId("user").textContent).toBe("grace@example.com");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("token-sign-up");

    act(() => {
      currentAuth!.signOut();
    });

    expect(view.getByTestId("token").textContent).toBe("none");
    expect(view.getByTestId("user").textContent).toBe("none");
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
