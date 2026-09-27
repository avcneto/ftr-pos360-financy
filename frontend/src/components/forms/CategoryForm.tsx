import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categorySchema } from "../../lib/schemas";
import type { Category } from "../../types";
import type { CategoryFormInput } from "../../types/forms";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Surface } from "../ui/Surface";
import { INPUT_BASE } from "./formStyles";

const ICONS = ["briefcase-business", "car-front", "heart-pulse", "piggy-bank", "shopping-cart", "ticket", "tool-case", "utensils", "paw-print", "house", "gift", "dumbbell", "book-open", "baggage-claim", "mailbox", "receipt-text"];
const COLORS = ["#1f6f43", "#dc2626", "#ea580c", "#ca8a04", "#2563eb", "#7e22ce", "#db2777"];

type CategoryFormProps = {
  editingCategory: Category | null;
  onSave: (values: CategoryFormInput) => Promise<void>;
};

export function CategoryForm({ editingCategory, onSave }: CategoryFormProps) {
  const [submitError, setSubmitError] = useState("");

  const form = useForm<CategoryFormInput>({
    defaultValues: {
      title: "",
      description: "",
      color: "#1f6f43",
      icon: ICONS[0],
    },
  });

  useEffect(() => {
    if (!editingCategory) {
      form.reset({ title: "", description: "", color: "#1f6f43", icon: ICONS[0] });
      return;
    }

    form.reset({
      title: editingCategory.title,
      description: editingCategory.description ?? "",
      color: editingCategory.color ?? "#1f6f43",
      icon: editingCategory.icon ?? ICONS[0],
    });
  }, [editingCategory, form]);

  const handleSubmit = async (values: CategoryFormInput) => {
    const parsed = categorySchema.safeParse(values);
    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (
          field === "title" ||
          field === "description" ||
          field === "color" ||
          field === "icon"
        ) {
          form.setError(field, { message: issue.message });
        }
      });
      return;
    }

    try {
      setSubmitError("");
      await onSave(parsed.data);
      form.reset({ title: "", description: "", color: "#1f6f43", icon: ICONS[0] });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not save category",
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
            {editingCategory ? "Editar categoria" : "Nova categoria"}
          </h2>
          <p className="text-sm text-[#4b5563]">Organize suas transações com categorias</p>
        </div>

        <FormField label="Título" error={form.formState.errors.title?.message}>
          <input className={INPUT_BASE} placeholder="Ex.: Alimentação" {...form.register("title")} />
        </FormField>

        <FormField label="Descrição (opcional)">
          <textarea
            rows={2}
            className={INPUT_BASE}
            placeholder="Descreva a categoria"
            {...form.register("description")}
          />
        </FormField>

        <div><p className="mb-3 text-sm font-medium text-[#374151]">Ícone</p><div role="group" aria-label="Ícone" className="grid grid-cols-8 gap-2">{ICONS.map((icon) => <button key={icon} type="button" aria-label={icon} aria-pressed={form.watch("icon") === icon} onClick={() => form.setValue("icon", icon, { shouldDirty: true })} className={`grid aspect-square place-items-center rounded-lg border ${form.watch("icon") === icon ? "border-[#1f6f43] bg-[#e0fae9]" : "border-[#d1d5db] bg-white hover:bg-[#f3f4f6]"}`}><img src={`/Icon/${icon}.svg`} alt="" className="h-5 w-5" /></button>)}</div></div>
        <div><p className="mb-3 text-sm font-medium text-[#374151]">Cor</p><div role="group" aria-label="Cor" className="flex flex-wrap gap-3">{COLORS.map((color) => <button key={color} type="button" aria-label={`Cor ${color}`} aria-pressed={form.watch("color") === color} onClick={() => form.setValue("color", color, { shouldDirty: true })} className={`h-8 w-8 rounded-full border-2 ${form.watch("color") === color ? "border-[#111827] ring-2 ring-white ring-offset-1" : "border-transparent"}`} style={{ backgroundColor: color }} />)}</div></div>

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
