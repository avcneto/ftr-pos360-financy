import { useState } from "react";
import type { Category } from "../../types";
import { useCategories } from "../../hooks/useCategories";
import { PageHeader } from "../ui/PageHeader";
import { CategoryList } from "../categories/CategoryList";
import { CategoryStats } from "../categories/CategoryStats";
import { CategoryForm } from "../forms/CategoryForm";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { useTransactions } from "../../hooks/useTransactions";

export function CategoriesPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    deletePending,
  } = useCategories();
  const { transactions, isLoading: transactionsLoading } = useTransactions();
  const categoryCounts = Object.fromEntries(categories.map((category) => [category.id, transactions.filter((transaction) => transaction.categoryId === category.id).length]));
  const mostUsed = [...categories].sort((a, b) => categoryCounts[b.id] - categoryCounts[a.id])[0];

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setActionError("");
      await deleteCategory(id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Não foi possível excluir a categoria");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between max-[980px]:flex-col max-[980px]:items-start max-[980px]:gap-3">
        <PageHeader eyebrow="Gestão" title="Categorias" description="Organize suas movimentações por categoria." />
        <Button type="button" onClick={() => { setEditingCategory(null); setFormOpen(true); }}>
          <img src="/Icon/plus.svg" alt="" className="h-4 w-4 brightness-0 invert" />Nova categoria
        </Button>
      </div>

      <CategoryStats
        total={categories.length}
        transactionTotal={transactions.length}
        mostUsedCategory={mostUsed && categoryCounts[mostUsed.id] > 0 ? mostUsed : null}
      />

      {error && <p role="alert" className="text-[#b91c1c]">Não foi possível carregar as categorias.</p>}

      {actionError && <p role="alert" className="text-[#b91c1c]">{actionError}</p>}
      <div>
        <CategoryList
          categories={categories}
          isLoading={isLoading || transactionsLoading}
          transactionCounts={categoryCounts}
          onEdit={handleEdit}
          onDelete={(id) => void handleDelete(id)}
          deleteDisabled={deletePending}
        />
      </div>
      {formOpen && (
        <Dialog title={editingCategory ? "Editar categoria" : "Nova categoria"} onClose={() => setFormOpen(false)} wide>
          <CategoryForm
            editingCategory={editingCategory}
            onSave={async (values) => {
              if (editingCategory) {
                await updateCategory({ id: editingCategory.id, values });
              } else {
                await createCategory(values);
              }
              setFormOpen(false);
              setEditingCategory(null);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
