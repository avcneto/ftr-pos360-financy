import type { Category, Transaction } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Surface } from "../ui/Surface";

type DashboardOverviewPanelsProps = {
  categories: Category[];
  recentTransactions: Transaction[];
};

export function DashboardOverviewPanels({
  categories,
  recentTransactions,
}: DashboardOverviewPanelsProps) {
  return (
    <section className="grid grid-cols-[2fr_1fr] gap-6 max-[980px]:grid-cols-1">
      <Surface className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="m-0 text-[#111827]">Recent transactions</h2>
        </div>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {recentTransactions.length === 0 ? (
            <li className="text-[#6b7280]">No transactions yet.</li>
          ) : (
            recentTransactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-3 rounded-[8px] border border-[#e5e7eb] p-[14px]"
              >
                <div>
                  <strong>{transaction.title}</strong>
                  <small className="text-[#6b7280]">
                    {transaction.category?.title ?? "General"}
                  </small>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span
                    className={
                      transaction.type === "EXPENSE"
                        ? "text-[#dc2626]"
                        : "text-[#16a34a]"
                    }
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    {formatCurrency(Number(transaction.amount))}
                  </span>
                  <small className="text-[#6b7280]">
                    {formatDate(transaction.date)}
                  </small>
                </div>
              </li>
            ))
          )}
        </ul>
      </Surface>

      <Surface className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="m-0 text-[#111827]">Categories</h2>
          <span className="grid h-[26px] min-w-[26px] place-items-center rounded-full bg-[#e0fae9] px-1 text-xs font-semibold text-[#124b2b]">
            {categories.length}
          </span>
        </div>
        <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
          {categories.length === 0 ? (
            <li className="text-[#6b7280]">No categories available.</li>
          ) : (
            categories.map((category) => (
              <li
                key={category.id}
                className="inline-flex items-center gap-2 rounded-full px-2.5 py-2 text-xs font-semibold text-[#111827]"
                style={{ background: category.color || "#e2e8f0" }}
              >
                {category.icon || "•"} {category.title}
              </li>
            ))
          )}
        </ul>
      </Surface>
    </section>
  );
}
