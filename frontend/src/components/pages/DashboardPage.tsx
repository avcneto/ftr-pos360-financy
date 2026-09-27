import { formatCurrency } from "../../utils/formatters";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { DashboardOverviewPanels } from "../dashboard/DashboardOverviewPanels";
import { DashboardStatCard } from "../dashboard/DashboardStatCard";
import { useState } from "react";
import { Dialog } from "../ui/Dialog";
import { TransactionForm } from "../forms/TransactionForm";

export function DashboardPage() {
  const [formOpen, setFormOpen] = useState(false);
  const {
    categories,
    recentTransactions,
    transactions,
    monthlyIncome,
    monthlyExpense,
    balance,
    isLoading,
    error,
    createTransaction,
  } = useDashboardSummary();

  return (
    <div className="flex flex-col gap-6">
      {error ? (
        <p role="alert" className="text-[#b91c1c]">Não foi possível carregar o resumo financeiro.</p>
      ) : isLoading ? (
        <p className="text-[#6b7280]">Carregando resumo...</p>
      ) : (
        <>
          <section className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-1">
            <DashboardStatCard
              label="Saldo total"
              value={formatCurrency(balance)}
              tone="neutral"
              negative={balance < 0}
            />
            <DashboardStatCard label="Receitas do mês" value={formatCurrency(monthlyIncome)} tone="income" />
            <DashboardStatCard label="Despesas do mês" value={formatCurrency(monthlyExpense)} tone="expense" />
          </section>

          <DashboardOverviewPanels
            categories={categories}
            recentTransactions={recentTransactions}
            transactions={transactions}
            onNewTransaction={() => setFormOpen(true)}
          />
        </>
      )}
      {formOpen && <Dialog title="Nova transação" onClose={() => setFormOpen(false)}><TransactionForm categories={categories} editingTransaction={null} onSave={async (values) => { await createTransaction(values); setFormOpen(false); }} /></Dialog>}
    </div>
  );
}
