import { Link } from "react-router-dom";
import type { Category, Transaction } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Surface } from "../ui/Surface";

type Props = { categories: Category[]; recentTransactions: Transaction[]; transactions?: Transaction[] };

export function DashboardOverviewPanels({ categories, recentTransactions, transactions = recentTransactions }: Props) {
  return <section className="grid grid-cols-[2fr_1fr] gap-6 max-[900px]:grid-cols-1">
    <Surface className="overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5"><h2 className="m-0 text-base font-semibold text-[#111827]">Transações recentes</h2><Link to="/transactions" className="text-sm font-medium text-[#1f6f43]">Ver todas →</Link></div>
      <div className="divide-y divide-[#e5e7eb]">
        {recentTransactions.length === 0 ? <p className="px-6 py-8 text-sm text-[#6b7280]">Nenhuma transação cadastrada.</p> : recentTransactions.map((transaction) => <div key={transaction.id} className="flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#f3f4f6]"><img src={`/Icon/${transaction.type === "INCOME" ? "circle-arrow-up" : "circle-arrow-down"}.svg`} alt="" className="h-5 w-5" /></span><div className="min-w-0"><p className="truncate font-medium text-[#111827]">{transaction.title}</p><p className="text-xs text-[#6b7280]">{transaction.category?.title ?? "Sem categoria"} · {formatDate(transaction.date)}</p></div></div>
          <span className={`shrink-0 text-sm font-semibold ${transaction.type === "EXPENSE" ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{transaction.type === "EXPENSE" ? "−" : "+"}{formatCurrency(Number(transaction.amount))}</span>
        </div>)}
      </div>
    </Surface>
    <Surface className="self-start overflow-hidden">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5"><h2 className="m-0 text-base font-semibold text-[#111827]">Categorias</h2><Link to="/categories" className="text-sm font-medium text-[#1f6f43]">Gerenciar →</Link></div>
      <div className="divide-y divide-[#e5e7eb]">{categories.length === 0 ? <p className="px-6 py-8 text-sm text-[#6b7280]">Nenhuma categoria cadastrada.</p> : categories.slice(0, 5).map((category) => {
        const count = transactions.filter((transaction) => transaction.categoryId === category.id).length;
        return <div key={category.id} className="flex items-center justify-between gap-3 px-6 py-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: `${category.color ?? "#1f6f43"}20` }}><img src={`/Icon/${category.icon || "tag"}.svg`} alt="" className="h-5 w-5" onError={(event) => { event.currentTarget.src = "/Icon/tag.svg"; }} /></span><span className="truncate text-sm font-medium text-[#111827]">{category.title}</span></div><span className="text-xs text-[#6b7280]">{count}</span></div>;
      })}</div>
    </Surface>
  </section>;
}
