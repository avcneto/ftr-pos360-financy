import { Link } from "react-router-dom";
import type { Category, Transaction } from "../../types";
import { formatCurrency, formatShortDate } from "../../utils/formatters";
import { CategoryIcon } from "../categories/CategoryIcon";
import { Surface } from "../ui/Surface";

type Props = {
  categories: Category[];
  recentTransactions: Transaction[];
  transactions?: Transaction[];
  onNewTransaction?: () => void;
};

const CHEVRON_MASK = 'url("/Icon/chevron-right.svg") center / contain no-repeat';
const PLUS_MASK = 'url("/Icon/plus.svg") center / contain no-repeat';

export function DashboardOverviewPanels({ categories, recentTransactions, transactions = recentTransactions, onNewTransaction }: Props) {
  return (
    <section className="grid grid-cols-[2fr_1fr] items-start gap-6 max-[900px]:grid-cols-1">
      <Surface className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <h2 className="m-0 text-xs font-medium uppercase tracking-[.06em] text-[#6b7280]">Transações recentes</h2>
          <Link to="/transactions" className="inline-flex items-center gap-2 text-sm font-medium text-[#1f6f43]">
            Ver todas
            <span aria-hidden="true" className="h-4 w-4 bg-current" style={{ mask: CHEVRON_MASK, WebkitMask: CHEVRON_MASK }} />
          </Link>
        </div>
        <div className="divide-y divide-[#e5e7eb]">
          {recentTransactions.length === 0 ? (
            <p className="px-6 py-8 text-sm text-[#6b7280]">Nenhuma transação cadastrada.</p>
          ) : recentTransactions.map((transaction) => {
            const income = transaction.type === "INCOME";
            const categoryColor = transaction.category?.color || (income ? "#16a34a" : "#64748b");
            const badgeColor = transaction.category?.color || (income ? "#15803d" : "#dc2626");
            const badgeLabel = transaction.category?.title || (income ? "Receita" : "Despesa");
            const typeColor = income ? "#15803d" : "#dc2626";
            const typeIcon = income ? "circle-arrow-up" : "circle-arrow-down";
            const typeMask = `url("/Icon/${typeIcon}.svg") center / contain no-repeat`;

            return (
              <div key={transaction.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-5">
                <div className="flex min-w-[210px] flex-1 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${categoryColor}20` }}>
                    <CategoryIcon name={transaction.category?.icon || (income ? "briefcase-business" : "tag")} color={categoryColor} className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#111827]">{transaction.title}</p>
                    <p className="mt-1 text-xs text-[#6b7280]">{formatShortDate(transaction.date)}</p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${badgeColor}20`, color: badgeColor }}>
                  {badgeLabel}
                </span>
                <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#111827]">
                  {income ? "+" : "−"} {formatCurrency(Number(transaction.amount))}
                  <span aria-hidden="true" className="h-4 w-4 shrink-0" style={{ backgroundColor: typeColor, mask: typeMask, WebkitMask: typeMask }} />
                </span>
              </div>
            );
          })}
        </div>
        {onNewTransaction && (
          <button type="button" onClick={onNewTransaction} className="flex w-full items-center justify-center gap-2 border-t border-[#e5e7eb] px-6 py-5 text-sm font-medium text-[#1f6f43] hover:bg-[#f4fbf6]">
            <span aria-hidden="true" className="h-4 w-4 bg-current" style={{ mask: PLUS_MASK, WebkitMask: PLUS_MASK }} />
            Nova transação
          </button>
        )}
      </Surface>

      <Surface className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <h2 className="m-0 text-xs font-medium uppercase tracking-[.06em] text-[#6b7280]">Categorias</h2>
          <Link to="/categories" className="inline-flex items-center gap-2 text-sm font-medium text-[#1f6f43]">
            Gerenciar
            <span aria-hidden="true" className="h-4 w-4 bg-current" style={{ mask: CHEVRON_MASK, WebkitMask: CHEVRON_MASK }} />
          </Link>
        </div>
        <div className="px-6 py-4">
          {categories.length === 0 ? (
            <p className="py-4 text-sm text-[#6b7280]">Nenhuma categoria cadastrada.</p>
          ) : categories.slice(0, 5).map((category) => {
            const categoryTransactions = transactions.filter((transaction) => transaction.categoryId === category.id);
            const total = categoryTransactions.reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount)), 0);
            const color = category.color || "#64748b";

            return (
              <div key={category.id} className="flex items-center gap-3 py-3">
                <span className="min-w-0 truncate rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: `${color}20`, color }}>
                  {category.title}
                </span>
                <span className="ml-auto shrink-0 text-xs text-[#6b7280]">{categoryTransactions.length} {categoryTransactions.length === 1 ? "item" : "itens"}</span>
                <strong className="min-w-[90px] shrink-0 text-right text-sm font-semibold text-[#111827]">{formatCurrency(total)}</strong>
              </div>
            );
          })}
        </div>
      </Surface>
    </section>
  );
}
