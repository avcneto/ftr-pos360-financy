import { useState } from "react";
import type { Category } from "../../types";
import { useCategories } from "../../hooks/useCategories";
import { PageHeader } from "../ui/PageHeader";
import { CategoryList } from "../categories/CategoryList";
import { CategoryStats } from "../categories/CategoryStats";
import { CategoryForm } from "../forms/CategoryForm";

export function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const {
    categories,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    deletePending,
  } = useCategories();

  const categoriesWithDescription = categories.filter(
    (category) => category.description,
  ).length;
  const categoriesWithCustomColor = categories.filter(
    (category) => category.color && category.color !== "#1f6f43",
  ).length;

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Could not delete category",
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between max-[980px]:flex-col max-[980px]:items-start max-[980px]:gap-3">
        <PageHeader
          eyebrow="Manage"
          title="Categories"
          description="Organize records with clear groups and visual tags."
        />
      </div>

      <CategoryStats
        total={categories.length}
        withDescription={categoriesWithDescription}
        withCustomColor={categoriesWithCustomColor}
      />

      <div className="grid grid-cols-[2fr_1fr] gap-6 max-[980px]:grid-cols-1">
        <CategoryForm
          editingCategory={editingCategory}
          onSave={async (values) => {
            if (editingCategory) {
              await updateCategory({ id: editingCategory.id, values });
              setEditingCategory(null);
              return;
            }

            await createCategory(values);
            setEditingCategory(null);
          }}
        />

        <CategoryList
          categories={categories}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id) => void handleDelete(id)}
          deleteDisabled={deletePending}
        />
      </div>
    </div>
  );
}
