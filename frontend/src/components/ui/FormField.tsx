import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
      <span>{label}</span>
      {children}
      {error ? (
        <small className="text-xs font-semibold text-[#b91c1c]">{error}</small>
      ) : null}
    </label>
  );
}
