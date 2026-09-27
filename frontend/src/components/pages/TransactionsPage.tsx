import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useTransactions } from "../../hooks/useTransactions";
import type { Transaction } from "../../types";
import { PageHeader } from "../ui/PageHeader";
import { TransactionForm } from "../forms/TransactionForm";
import { TransactionHistoryList } from "../transactions/TransactionHistoryList";
import { TransactionMetrics } from "../transactions/TransactionMetrics";
import { Button } from "../ui/Button";
import { Dialog } from "../ui/Dialog";
import { Surface } from "../ui/Surface";
import { INPUT_BASE } from "../forms/formStyles";

export function TransactionsPage() {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [page, setPage] = useState(1);
  const { categories } = useCategories();
  const {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    deletePending,
  } = useTransactions();

  const totalIncome = transactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);

  const totalExpense = transactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((total, transaction) => total + Number(transaction.amount), 0);
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.title.toLocaleLowerCase("pt-BR").includes(search.toLocaleLowerCase("pt-BR")) &&
    (!typeFilter || transaction.type === typeFilter) &&
    (!categoryFilter || transaction.categoryId === categoryFilter) &&
    (!monthFilter || transaction.date.slice(0, 7) === monthFilter)
  );
  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageTransactions = filteredTransactions.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      setActionError("");
      await deleteTransaction(id);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Não foi possível excluir a transação");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between max-[980px]:flex-col max-[980px]:items-start max-[980px]:gap-3">
        <PageHeader eyebrow="Gestão" title="Transações" description="Acompanhe e organize suas movimentações." />
        <Button type="button" onClick={() => { setEditingTransaction(null); setFormOpen(true); }}>
          <img src="/Icon/plus.svg" alt="" className="h-4 w-4 brightness-0 invert" />Nova transação
        </Button>
      </div>

      <TransactionMetrics income={totalIncome} expense={totalExpense} total={transactions.length} />
      <Surface className="p-6"><div className="grid grid-cols-4 gap-4 max-[900px]:grid-cols-2 max-[500px]:grid-cols-1">
        <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">Buscar<input className={INPUT_BASE} placeholder="Buscar descrição" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} /></label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">Tipo<select className={INPUT_BASE} value={typeFilter} onChange={(event) => { setTypeFilter(event.target.value); setPage(1); }}><option value="">Todos</option><option value="INCOME">Receitas</option><option value="EXPENSE">Despesas</option></select></label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">Categoria<select className={INPUT_BASE} value={categoryFilter} onChange={(event) => { setCategoryFilter(event.target.value); setPage(1); }}><option value="">Todas</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.title}</option>)}</select></label>
        <label className="flex flex-col gap-2 text-sm font-medium text-[#374151]">Período<input type="month" className={INPUT_BASE} value={monthFilter} onChange={(event) => { setMonthFilter(event.target.value); setPage(1); }} /></label>
      </div></Surface>

      {error && <p role="alert" className="text-[#b91c1c]">Não foi possível carregar as transações.</p>}

      {actionError && <p role="alert" className="text-[#b91c1c]">{actionError}</p>}
      <div>
        <TransactionHistoryList
          transactions={pageTransactions}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id) => void handleDelete(id)}
          deleteDisabled={deletePending}
        />
      </div>
      {filteredTransactions.length > pageSize && <nav aria-label="Paginação de transações" className="flex items-center justify-center gap-2"><button type="button" className="rounded-lg border border-[#d1d5db] px-3 py-1" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>‹</button>{Array.from({ length: pageCount }, (_, index) => <button key={index} type="button" aria-current={currentPage === index + 1 ? "page" : undefined} className={`h-8 w-8 rounded-lg border ${currentPage === index + 1 ? "border-[#1f6f43] bg-[#1f6f43] text-white" : "border-[#d1d5db] bg-white"}`} onClick={() => setPage(index + 1)}>{index + 1}</button>)}<button type="button" className="rounded-lg border border-[#d1d5db] px-3 py-1" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>›</button></nav>}
      {formOpen && (
        <Dialog title={editingTransaction ? "Editar transação" : "Nova transação"} onClose={() => setFormOpen(false)}>
          <TransactionForm
            categories={categories}
            editingTransaction={editingTransaction}
            onSave={async (values) => {
              if (editingTransaction) {
                await updateTransaction({ id: editingTransaction.id, values });
              } else {
                await createTransaction(values);
              }
              setFormOpen(false);
              setEditingTransaction(null);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
