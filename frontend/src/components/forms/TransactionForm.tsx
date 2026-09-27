import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { transactionSchema } from "../../lib/schemas";
import type { Category, Transaction } from "../../types";
import type { TransactionFormInput } from "../../types/forms";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Surface } from "../ui/Surface";
import { TransactionTypeToggle } from "../transactions/TransactionTypeToggle";
import { INPUT_BASE } from "./formStyles";
import { todayForDateInput } from "../../utils/formatters";

type TransactionFormProps = {
  categories: Category[];
  editingTransaction: Transaction | null;
  onSave: (values: TransactionFormInput) => Promise<void>;
};

export function TransactionForm({
  categories,
  editingTransaction,
  onSave,
}: TransactionFormProps) {
  const [submitError, setSubmitError] = useState("");

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
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not save transaction",
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
            <input
              type="number"
              step="0.01"
              className={INPUT_BASE}
              {...form.register("amount", { valueAsNumber: true })}
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
