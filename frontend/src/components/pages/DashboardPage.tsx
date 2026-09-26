import { formatCurrency } from "../../utils/formatters";
import { useDashboardSummary } from "../../hooks/useDashboardSummary";
import { PageHeader } from "../ui/PageHeader";
import { DashboardOverviewPanels } from "../dashboard/DashboardOverviewPanels";
import { DashboardStatCard } from "../dashboard/DashboardStatCard";

export function DashboardPage() {
  const { categories, recentTransactions, income, expense, balance, isLoading } =
    useDashboardSummary();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between max-[980px]:flex-col max-[980px]:items-start max-[980px]:gap-3">
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          description="Track your financial health in one place."
        />
      </div>

      {isLoading ? (
        <p className="text-[#6b7280]">Loading overview...</p>
      ) : (
        <>
          <section className="grid grid-cols-3 gap-6 max-[980px]:grid-cols-1">
            <DashboardStatCard
              label="Income"
              value={formatCurrency(income)}
              tone="income"
            />
            <DashboardStatCard
              label="Expenses"
              value={formatCurrency(expense)}
              tone="expense"
            />
            <DashboardStatCard
              label="Balance"
              value={formatCurrency(balance)}
              tone="neutral"
            />
          </section>

          <DashboardOverviewPanels
            categories={categories}
            recentTransactions={recentTransactions}
          />
        </>
      )}
    </div>
  );
}
