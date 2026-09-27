import type { Transaction } from "../../types";
import { formatCurrency, formatShortDate } from "../../utils/formatters";
import { CategoryIcon } from "../categories/CategoryIcon";
import { Surface } from "../ui/Surface";

const TRASH_MASK = 'url("/Icon/trash.svg") center / contain no-repeat';

type Pagination = { page: number; pageSize: number; total: number; onPageChange: (page: number) => void };
type Props = { transactions: Transaction[]; isLoading: boolean; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void; deleteDisabled?: boolean; pagination?: Pagination };

export function TransactionHistoryList({ transactions, isLoading, onEdit, onDelete, deleteDisabled = false, pagination }: Props) {
  const pageCount = pagination ? Math.max(1, Math.ceil(pagination.total / pagination.pageSize)) : 1;
  const pageStart = pagination ? Math.max(1, Math.min(pagination.page - 2, pageCount - 4)) : 1;
  const pageNumbers = Array.from({ length: Math.min(5, pageCount) }, (_, index) => pageStart + index);

  return <Surface className="overflow-hidden">
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#f9fafb] text-xs uppercase tracking-[.05em] text-[#6b7280]"><tr>{["Descrição", "Data", "Categoria", "Tipo", "Valor", "Ações"].map((label) => <th key={label} scope="col" className="px-6 py-4 font-medium">{label}</th>)}</tr></thead>
      <tbody className="divide-y divide-[#e5e7eb] text-sm text-[#374151]">
        {isLoading ? <tr><td colSpan={6} className="px-6 py-8">Carregando transações...</td></tr> : transactions.length === 0 ? <tr><td colSpan={6} className="px-6 py-8">Nenhuma transação cadastrada.</td></tr> : transactions.map((transaction) => {
          const categoryColor = transaction.category?.color ?? "#64748b";
          const income = transaction.type === "INCOME";
          const typeColor = income ? "#15803d" : "#dc2626";
          const typeIcon = income ? "circle-arrow-up" : "circle-arrow-down";
          const typeMask = `url("/Icon/${typeIcon}.svg") center / contain no-repeat`;

          return <tr key={transaction.id}>
            <td className="px-6 py-4 font-medium text-[#111827]">
              <div className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md" style={{ backgroundColor: `${categoryColor}20` }}>
                  <CategoryIcon name={transaction.category?.icon} color={categoryColor} className="h-4 w-4" />
                </span>
                <span>{transaction.title}</span>
              </div>
            </td>
            <td className="px-6 py-4">{formatShortDate(transaction.date)}</td>
            <td className="px-6 py-4">
              <span className="inline-block rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}>
                {transaction.category?.title ?? "Sem categoria"}
              </span>
            </td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: typeColor }}>
                <span aria-hidden="true" className="block h-4 w-4 bg-current" style={{ mask: typeMask, WebkitMask: typeMask }} />
                {income ? "Entrada" : "Saída"}
              </span>
            </td>
            <td className="px-6 py-4 font-semibold text-[#111827]">{income ? "+" : "−"} {formatCurrency(Number(transaction.amount))}</td>
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button type="button" aria-label={`Excluir ${transaction.title}`} title="Excluir" disabled={deleteDisabled} onClick={() => onDelete(transaction.id)} className="rounded-lg border border-[#d1d5db] p-2 text-[#dc2626] hover:bg-[#fee2e2] disabled:opacity-50">
                  <span aria-hidden="true" className="block h-4 w-4 bg-current" style={{ mask: TRASH_MASK, WebkitMask: TRASH_MASK }} />
                </button>
                <button type="button" aria-label={`Editar ${transaction.title}`} title="Editar" onClick={() => onEdit(transaction)} className="rounded-lg border border-[#d1d5db] p-2 hover:bg-[#f3f4f6]">
                  <img src="/Icon/square-pen.svg" alt="" className="h-4 w-4" />
                </button>
              </div>
            </td>
          </tr>;
        })}
      </tbody></table></div>
    {pagination && (
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e5e7eb] px-6 py-5 text-sm text-[#475569]">
        <span>
          {pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1} a {Math.min(pagination.page * pagination.pageSize, pagination.total)} | {pagination.total} {pagination.total === 1 ? "resultado" : "resultados"}
        </span>
        <nav aria-label="Paginação de transações" className="flex items-center gap-2">
          <button type="button" aria-label="Página anterior" disabled={pagination.page <= 1} onClick={() => pagination.onPageChange(pagination.page - 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] text-lg disabled:opacity-50">‹</button>
          {pageNumbers.map((pageNumber) => (
            <button key={pageNumber} type="button" aria-label={`Página ${pageNumber}`} aria-current={pagination.page === pageNumber ? "page" : undefined} onClick={() => pagination.onPageChange(pageNumber)} className={`grid h-9 w-9 place-items-center rounded-lg border text-sm ${pagination.page === pageNumber ? "border-[#1f6f43] bg-[#1f6f43] text-white" : "border-[#d1d5db] text-[#334155] hover:bg-[#f3f4f6]"}`}>
              {pageNumber}
            </button>
          ))}
          <button type="button" aria-label="Próxima página" disabled={pagination.page >= pageCount} onClick={() => pagination.onPageChange(pagination.page + 1)} className="grid h-9 w-9 place-items-center rounded-lg border border-[#d1d5db] text-lg disabled:opacity-50">›</button>
        </nav>
      </div>
    )}
  </Surface>;
}
