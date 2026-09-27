import type { ButtonHTMLAttributes, ReactNode } from "react";

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-70";

const VARIANTS = {
  primary:
    "bg-[#1f6f43] px-4 py-3 text-white hover:bg-[#175936]",
  ghost:
    "border border-[#e5e7eb] bg-white px-3 py-2 text-[#374151] hover:bg-[#f9fafb]",
  danger: "bg-[#dc2626] px-3 py-2 text-white hover:brightness-105",
} as const;

export type ButtonVariant = keyof typeof VARIANTS;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${BASE_CLASS} ${VARIANTS[variant]} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
