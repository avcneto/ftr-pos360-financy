import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { transactionSchema } from "../../lib/schemas";
import type { Category, Transaction } from "../../types";
import type { TransactionFormInput } from "../../types/forms";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Surface } from "../ui/Surface";
import { TransactionTypeToggle } from "../transactions/TransactionTypeToggle";
import { INPUT_BASE } from "./formStyles";
import { formatCurrencyInput, parseCurrencyInput, todayForDateInput } from "../../utils/formatters";

type TransactionFormProps = {
  categories: Category[];
  editingTransaction: Transaction | null;
  onSave: (values: TransactionFormInput) => Promise<void>;
};

function caretAfterDigits(value: string, digits: number, end: number) {
  if (digits === 0) return 0;
  let seen = 0;
  for (let index = 0; index < end; index += 1) {
    if (/\d/.test(value[index])) seen += 1;
    if (seen === digits) return index + 1;
  }
  return end;
}

export function TransactionForm({
  categories,
  editingTransaction,
  onSave,
}: TransactionFormProps) {
  const [submitError, setSubmitError] = useState("");
  const [amountText, setAmountText] = useState(() => editingTransaction
    ? formatCurrencyInput(Number(editingTransaction.amount))
    : "");
  const amountInputRef = useRef<HTMLInputElement | null>(null);
  const amountCaretRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (amountCaretRef.current === null || !amountInputRef.current) return;
    amountInputRef.current.setSelectionRange(amountCaretRef.current, amountCaretRef.current);
    amountCaretRef.current = null;
  }, [amountText]);

  const form = useForm<TransactionFormInput>({
    defaultValues: {
      title: "",
      amount: 0,
      type: "EXPENSE",
      date: todayForDateInput(),
      description: "",
      categoryId: "",
    },
  });

  useEffect(() => {
    if (!editingTransaction) {
      setAmountText("");
      form.reset({
        title: "",
        amount: 0,
        type: "EXPENSE",
        date: todayForDateInput(),
        description: "",
        categoryId: "",
      });
      return;
    }

    setAmountText(formatCurrencyInput(Number(editingTransaction.amount)));
    form.reset({
      title: editingTransaction.title,
      amount: Number(editingTransaction.amount),
      type: editingTransaction.type,
      date: new Date(editingTransaction.date).toISOString().slice(0, 10),
      description: editingTransaction.description ?? "",
      categoryId: editingTransaction.categoryId ?? "",
    });
  }, [editingTransaction, form]);

  const selectedType = form.watch("type");

  const handleSubmit = async (values: TransactionFormInput) => {
    const parsed = transactionSchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (
          field === "title" ||
          field === "amount" ||
          field === "type" ||
          field === "date" ||
          field === "description" ||
          field === "categoryId"
        ) {
          form.setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      setSubmitError("");
      await onSave({
        ...parsed.data,
        categoryId: parsed.data.categoryId || null,
        description: parsed.data.description || undefined,
      });
      form.reset({
        title: "",
        amount: 0,
        type: "EXPENSE",
        date: todayForDateInput(),
        description: "",
        categoryId: "",
      });
      setAmountText("");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Não foi possível salvar a transação.",
      );
    }
  };

  return (
    <Surface className="p-6">
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="mb-1 flex flex-col gap-0.5 pr-10">
          <h2 className="m-0 text-[#111827]">
            {editingTransaction ? "Editar transação" : "Nova transação"}
          </h2>
          <p className="text-sm text-[#4b5563]">Registre sua despesa ou receita</p>
        </div>

        <TransactionTypeToggle
          selectedType={selectedType}
          onChange={(type) =>
            form.setValue("type", type, { shouldDirty: true })
          }
        />

        <FormField label="Descrição" error={form.formState.errors.title?.message}>
          <input className={INPUT_BASE} placeholder="Ex.: Almoço" {...form.register("title")} />
        </FormField>

        <div className="grid grid-cols-2 gap-[14px]">
          <FormField label="Data" error={form.formState.errors.date?.message}>
            <input
              type="date"
              className={INPUT_BASE}
              {...form.register("date")}
            />
          </FormField>

          <FormField
            label="Valor"
            error={form.formState.errors.amount?.message}
          >
            <Controller
              name="amount"
              control={form.control}
              render={({ field }) => (
                <div className="relative">
                  <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">R$</span>
                  <input
                    ref={(node) => {
                      field.ref(node);
                      amountInputRef.current = node;
                    }}
                    name={field.name}
                    type="text"
                    aria-label="Valor"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={`${INPUT_BASE} pl-10`}
                    value={amountText}
                    onChange={(event) => {
                      const raw = event.target.value;
                      if (!raw.trim()) {
                        amountCaretRef.current = null;
                        setAmountText("");
                        field.onChange(0);
                        return;
                      }

                      const rawCaret = event.target.selectionStart ?? raw.length;
                      const rawComma = raw.lastIndexOf(",");
                      const editingCents = rawComma >= 0 && rawCaret > rawComma;
                      const digitsBeforeCaret = (editingCents
                        ? raw.slice(rawComma + 1, rawCaret)
                        : raw.slice(0, rawCaret)).replace(/\D/g, "").length;
                      const amount = parseCurrencyInput(raw);
                      const formatted = formatCurrencyInput(amount);
                      const formattedComma = formatted.lastIndexOf(",");
                      amountCaretRef.current = editingCents
                        ? formattedComma + 1 + Math.min(digitsBeforeCaret, 2)
                        : caretAfterDigits(formatted, digitsBeforeCaret, formattedComma);
                      setAmountText(formatted);
                      field.onChange(amount);
                    }}
                    onFocus={(event) => event.currentTarget.select()}
                    onKeyDown={(event) => {
                      if (event.key !== "," && event.key !== ".") return;
                      event.preventDefault();
                      const comma = event.currentTarget.value.lastIndexOf(",");
                      if (comma >= 0) event.currentTarget.setSelectionRange(comma + 1, event.currentTarget.value.length);
                    }}
                    onBlur={() => {
                      field.onBlur();
                      amountCaretRef.current = null;
                      setAmountText(amountText.trim() ? formatCurrencyInput(parseCurrencyInput(amountText)) : "");
                    }}
                  />
                </div>
              )}
            />
          </FormField>
        </div>

        <FormField label="Categoria">
          <select className={INPUT_BASE} {...form.register("categoryId")}>
            <option value="">Sem categoria</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </FormField>

        {submitError && (
          <p className="m-0 text-sm text-[#b91c1c]">{submitError}</p>
        )}

        <Button type="submit">
          Salvar
        </Button>
      </form>
    </Surface>
  );
}
