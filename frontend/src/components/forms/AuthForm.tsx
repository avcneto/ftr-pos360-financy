import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signInSchema, signUpSchema } from "../../lib/schemas";
import type { AuthFormInput } from "../../types/forms";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Surface } from "../ui/Surface";
import { INPUT_BASE } from "./formStyles";

type AuthFormProps = {
  isLogin: boolean;
  onSignIn: (email: string, password: string, remember?: boolean) => Promise<void>;
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onToggleMode: () => void;
};

export function AuthForm({
  isLogin,
  onSignIn,
  onSignUp,
  onToggleMode,
}: AuthFormProps) {
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const form = useForm<AuthFormInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    form.clearErrors();
    setSubmitError("");
    setShowPassword(false);
  }, [form, isLogin]);

  const handleSubmit = async (values: AuthFormInput) => {
    try {
      setSubmitError("");
      form.clearErrors();

      if (isLogin) {
        const parsed = signInSchema.safeParse(values);

        if (!parsed.success) {
          parsed.error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (field === "email" || field === "password") {
              form.setError(field, { message: issue.message });
            }
          });
          return;
        }

        await onSignIn(parsed.data.email, parsed.data.password, remember);
      } else {
        const parsed = signUpSchema.safeParse(values);

        if (!parsed.success) {
          parsed.error.issues.forEach((issue) => {
            const field = issue.path[0];
            if (field === "name" || field === "email" || field === "password") {
              form.setError(field, { message: issue.message });
            }
          });
          return;
        }

        await onSignUp(
          parsed.data.name,
          parsed.data.email,
          parsed.data.password,
        );
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      setSubmitError(
        message === "E-mail ou senha incorretos." || message === "Este e-mail já está cadastrado."
          ? message
          : isLogin
            ? "Não foi possível entrar agora. Tente novamente."
            : "Não foi possível criar a conta agora. Tente novamente.",
      );
    }
  };

  return (
    <Surface className="w-full max-w-[448px] bg-white p-8 shadow-[0_8px_24px_rgb(17_24_39_/_6%)]">
      <div className="mb-6 text-center">
        <h1 className="m-0 text-xl font-semibold text-[#111827]">
          {isLogin ? "Fazer login" : "Criar conta"}
        </h1>
        <p className="mt-2 text-[15px] text-[#6b7280]">
          {isLogin
            ? "Entre na sua conta para continuar"
            : "Comece a controlar suas finanças ainda hoje"}
        </p>
      </div>

      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-5"
      >
        {!isLogin && (
          <FormField label="Nome completo" error={form.formState.errors.name?.message}>
            <input
              type="text"
              placeholder="Seu nome completo"
              className={INPUT_BASE}
              {...form.register("name")}
            />
          </FormField>
        )}

        <FormField label="E-mail" error={form.formState.errors.email?.message}>
          <div className="relative">
            <img
              src="/Icon/mail.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
            />
            <input
              type="email"
              placeholder="mail@exemplo.com"
              className={`${INPUT_BASE} pl-10`}
              {...form.register("email")}
            />
          </div>
        </FormField>

        <FormField
          label="Senha"
          error={form.formState.errors.password?.message}
        >
          <div className="relative">
            <img
              src="/Icon/lock.svg"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
            />
            <input
              type={showPassword ? "text" : "password"}
              aria-label="Senha"
              placeholder="Digite sua senha"
              className={`${INPUT_BASE} pl-10 pr-10`}
              {...form.register("password")}
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-[#6b7280]"
              onClick={() => setShowPassword((value) => !value)}
            >
              <img
                src={showPassword ? "/Icon/eye.svg" : "/Icon/eye-closed.svg"}
                alt=""
                aria-hidden="true"
                className="h-4 w-4 opacity-80"
              />
            </button>
          </div>
          {!isLogin && <p className="mt-1 text-xs text-[#6b7280]">A senha deve ter no mínimo 8 caracteres</p>}
        </FormField>

        {isLogin ? (
          <div className="flex items-center justify-between gap-4 text-[14px]">
            <label className="flex items-center gap-2 text-[#374151]">
              <input
                type="checkbox"
                checked={remember}
                onChange={(event) => setRemember(event.target.checked)}
                className="h-4 w-4 rounded border-[#d1d5db] text-[#1f6f43] accent-[#1f6f43]"
              />
              <span>Lembrar-me</span>
            </label>

            <button
              type="button"
              className="font-medium text-[#1f6f43] hover:underline"
              onClick={() => setSubmitError("A recuperação de senha ainda não está disponível.")}
            >
              Recuperar senha
            </button>
          </div>
        ) : null}

        {submitError && (
          <p className="m-0 text-sm text-[#b91c1c]">{submitError}</p>
        )}

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting
            ? "Aguarde..."
            : isLogin
              ? "Entrar"
              : "Cadastrar"}
        </Button>

        {isLogin ? (
          <div className="flex items-center gap-3 py-1">
            <span className="h-px flex-1 bg-[#e5e7eb]" />
            <span className="text-[14px] text-[#9ca3af]">ou</span>
            <span className="h-px flex-1 bg-[#e5e7eb]" />
          </div>
        ) : null}

        {isLogin ? (
          <div className="flex flex-col items-center gap-4 pt-1">
            <p className="text-[15px] text-[#6b7280]">
              Ainda não tem uma conta?
            </p>
            <Button
              type="button"
              variant="ghost"
              className="h-12 w-full gap-2 border-[#cbd5e1] text-[15px] font-medium text-[#111827]"
              onClick={onToggleMode}
            >
              <img
                src="/Icon/user-round-plus.svg"
                alt=""
                aria-hidden="true"
                className="h-4 w-4"
              />
              Criar conta
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            className="mt-1 h-12 w-full text-[15px] font-medium text-[#111827]"
            onClick={onToggleMode}
          >
            Já tem uma conta? Fazer login
          </Button>
        )}
      </form>
    </Surface>
  );
}
