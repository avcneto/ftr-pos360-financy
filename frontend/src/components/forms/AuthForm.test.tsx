import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AuthForm } from "./AuthForm";

describe("AuthForm", () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the sign in form and shows validation errors", async () => {
    const onSignIn = vi.fn();

    const { getByLabelText, getByRole, getByText } = render(
      <AuthForm
        isLogin={true}
        onSignIn={onSignIn}
        onSignUp={vi.fn()}
        onToggleMode={vi.fn()}
      />,
    );

    expect(getByText("Lembrar-me")).not.toBeNull();
    expect(getByText("Recuperar senha")).not.toBeNull();

    fireEvent.submit(getByRole("button", { name: "Entrar" }).closest("form")!);

    await waitFor(() => {
      expect(getByText("Enter a valid email")).not.toBeNull();
    });
    expect(
      getByText("Password must contain at least 6 characters"),
    ).not.toBeNull();
    expect(onSignIn).not.toHaveBeenCalled();
  });

  it("submits a sign up flow and toggles the mode", async () => {
    const onSignUp = vi.fn().mockResolvedValue(undefined);
    const onToggleMode = vi.fn();

    const { getByLabelText, getByRole } = render(
      <AuthForm
        isLogin={false}
        onSignIn={vi.fn()}
        onSignUp={onSignUp}
        onToggleMode={onToggleMode}
      />,
    );

    fireEvent.change(getByLabelText("Nome"), {
      target: { value: "Ada Lovelace" },
    });
    fireEvent.change(getByLabelText("E-mail"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(getByLabelText("Senha"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(
      getByRole("button", { name: "Criar conta" }).closest("form")!,
    );

    await waitFor(() => {
      expect(onSignUp).toHaveBeenCalledWith(
        "Ada Lovelace",
        "ada@example.com",
        "secret123",
      );
    });

    fireEvent.click(
      getByRole("button", { name: "Já tem uma conta? Fazer login" }),
    );

    expect(onToggleMode).toHaveBeenCalledTimes(1);
  });

  it("shows submit failures from the authentication handlers", async () => {
    const onSignIn = vi
      .fn()
      .mockRejectedValue(new Error("Authentication failed"));

    const { getByLabelText, getByRole, getByText } = render(
      <AuthForm
        isLogin={true}
        onSignIn={onSignIn}
        onSignUp={vi.fn()}
        onToggleMode={vi.fn()}
      />,
    );

    fireEvent.change(getByLabelText("E-mail"), {
      target: { value: "ada@example.com" },
    });
    fireEvent.change(getByLabelText("Senha"), {
      target: { value: "secret123" },
    });
    fireEvent.submit(getByRole("button", { name: "Entrar" }).closest("form")!);

    await waitFor(() => {
      expect(getByText("Authentication failed")).not.toBeNull();
    });
  });
});
