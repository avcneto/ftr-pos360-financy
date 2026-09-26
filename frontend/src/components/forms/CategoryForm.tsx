import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { categorySchema } from "../../lib/schemas";
import type { Category } from "../../types";
import type { CategoryFormInput } from "../../types/forms";
import { Button } from "../ui/Button";
import { FormField } from "../ui/FormField";
import { Surface } from "../ui/Surface";
import { INPUT_BASE } from "./formStyles";

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
      icon: "✦",
    },
  });

  useEffect(() => {
    if (!editingCategory) {
      form.reset({ title: "", description: "", color: "#1f6f43", icon: "✦" });
      return;
    }

    form.reset({
      title: editingCategory.title,
      description: editingCategory.description ?? "",
      color: editingCategory.color ?? "#1f6f43",
      icon: editingCategory.icon ?? "✦",
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
      form.reset({ title: "", description: "", color: "#1f6f43", icon: "✦" });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not save category",
      );
    }
  };

  return (
    <Surface className="p-6">
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <div className="mb-1 flex items-center justify-between">
          <h2 className="m-0 text-[#111827]">
            {editingCategory ? "Edit category" : "New category"}
          </h2>
        </div>

        <FormField label="Title" error={form.formState.errors.title?.message}>
          <input className={INPUT_BASE} {...form.register("title")} />
        </FormField>

        <FormField label="Description">
          <textarea
            rows={3}
            className={INPUT_BASE}
            {...form.register("description")}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-[14px] max-[980px]:grid-cols-1">
          <FormField label="Color">
            <input
              type="color"
              className="h-[46px] w-full rounded-md border border-[#d1d5db] bg-white px-2 py-2"
              {...form.register("color")}
            />
          </FormField>

          <FormField label="Icon">
            <input
              maxLength={2}
              className={INPUT_BASE}
              {...form.register("icon")}
            />
          </FormField>
        </div>

        {submitError && (
          <p className="m-0 text-sm text-[#b91c1c]">{submitError}</p>
        )}

        <Button type="submit">
          {editingCategory ? "Update category" : "Create category"}
        </Button>
      </form>
    </Surface>
  );
}
