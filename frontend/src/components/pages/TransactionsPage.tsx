import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { useTransactions } from "../../hooks/useTransactions";
import type { Transaction } from "../../types";
import { PageHeader } from "../ui/PageHeader";
import { TransactionForm } from "../forms/TransactionForm";
import { TransactionHistoryList } from "../transactions/TransactionHistoryList";
import { TransactionMetrics } from "../transactions/TransactionMetrics";

export function TransactionsPage() {
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const { categories } = useCategories();
  const {
    transactions,
    isLoading,
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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Could not delete transaction",
      );
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between max-[980px]:flex-col max-[980px]:items-start max-[980px]:gap-3">
        <PageHeader
          eyebrow="Flow"
          title="Transactions"
          description="Create, edit and classify all money movements."
        />
      </div>

      <TransactionMetrics
        income={totalIncome}
        expense={totalExpense}
        total={transactions.length}
      />

      <div className="grid grid-cols-[2fr_1fr] gap-6 max-[980px]:grid-cols-1">
        <TransactionForm
          categories={categories}
          editingTransaction={editingTransaction}
          onSave={async (values) => {
            if (editingTransaction) {
              await updateTransaction({ id: editingTransaction.id, values });
              setEditingTransaction(null);
              return;
            }

            await createTransaction(values);
            setEditingTransaction(null);
          }}
        />

        <TransactionHistoryList
          transactions={transactions}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={(id) => void handleDelete(id)}
          deleteDisabled={deletePending}
        />
      </div>
    </div>
  );
}
