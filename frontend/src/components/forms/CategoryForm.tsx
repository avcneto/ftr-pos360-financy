import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categorySchema } from "../../lib/schemas";
import type { Category } from "../../types";
import type { CategoryFormInput } from "../../types/forms";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Surface } from "../ui/Surface";
import { INPUT_BASE } from "./formStyles";
import { CATEGORY_ICON_NAMES, CategoryIcon } from "../categories/CategoryIcon";

const COLORS = ["#16a34a", "#2563eb", "#9333ea", "#db2777", "#dc2626", "#ea580c", "#ca8a04"];
const DEFAULT_COLOR = COLORS[0];

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
      color: DEFAULT_COLOR,
      icon: CATEGORY_ICON_NAMES[0],
    },
  });

  useEffect(() => {
    if (!editingCategory) {
      form.reset({ title: "", description: "", color: DEFAULT_COLOR, icon: CATEGORY_ICON_NAMES[0] });
      return;
    }

    form.reset({
      title: editingCategory.title,
      description: editingCategory.description ?? "",
      color: editingCategory.color ?? DEFAULT_COLOR,
      icon: editingCategory.icon ?? CATEGORY_ICON_NAMES[0],
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
      form.reset({ title: "", description: "", color: DEFAULT_COLOR, icon: CATEGORY_ICON_NAMES[0] });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Não foi possível salvar a categoria.",
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
          <h2 className="m-0 font-semibold text-[#111827]">
            {editingCategory ? "Editar categoria" : "Nova categoria"}
          </h2>
          <p className="text-sm text-[#4b5563]">Organize suas transações com categorias</p>
        </div>

        <FormField label="Título" error={form.formState.errors.title?.message}>
          <input className={INPUT_BASE} placeholder="Ex.: Alimentação" {...form.register("title")} />
        </FormField>

        <div className="flex flex-col gap-2">
          <label htmlFor="category-description" className="text-sm font-medium text-[#374151]">Descrição</label>
          <textarea
            id="category-description"
            aria-describedby="category-description-hint"
            rows={2}
            className={INPUT_BASE}
            placeholder="Descreva a categoria"
            {...form.register("description")}
          />
          <small id="category-description-hint" className="text-xs font-normal text-[#6b7280]">Opcional</small>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-[#374151]">Ícone</p>
          <div role="group" aria-label="Ícone" className="grid grid-cols-8 gap-2">
            {CATEGORY_ICON_NAMES.map((icon) => {
              const selected = form.watch("icon") === icon;
              const selectedColor = form.watch("color");
              return (
                <button
                  key={icon}
                  type="button"
                  aria-label={icon}
                  aria-pressed={selected}
                  onClick={() => form.setValue("icon", icon, { shouldDirty: true })}
                  className={`grid aspect-square place-items-center rounded-lg border ${selected ? "" : "border-[#d1d5db] bg-white hover:bg-[#f3f4f6]"}`}
                  style={selected ? { borderColor: selectedColor, backgroundColor: `${selectedColor}20` } : undefined}
                >
                  <CategoryIcon name={icon} color={selected ? selectedColor : "#374151"} />
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <p className="mb-3 text-base font-medium text-[#374151]">Cor</p>
          <div role="group" aria-label="Cor" className="flex flex-wrap gap-2">
            {COLORS.map((color) => {
              const selectedColor = form.watch("color");
              const selected = selectedColor === color || (color === DEFAULT_COLOR && selectedColor === "#1f6f43");
              return (
                <button
                  key={color}
                  type="button"
                  aria-label={`Cor ${color}`}
                  aria-pressed={selected}
                  onClick={() => form.setValue("color", color, { shouldDirty: true })}
                  className={`h-[34px] w-14 shrink-0 rounded-lg border bg-white p-[5px] transition-colors ${selected ? "" : "border-[#d1d5db] hover:border-[#9ca3af]"}`}
                  style={selected ? { borderColor: "#1f6f43" } : undefined}
                >
                  <span className="block h-full w-full rounded-[5px]" style={{ backgroundColor: color }} />
                </button>
              );
            })}
          </div>
        </div>

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
