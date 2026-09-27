import type { Transaction } from "../../types";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Surface } from "../ui/Surface";

type Props = { transactions: Transaction[]; isLoading: boolean; onEdit: (transaction: Transaction) => void; onDelete: (id: string) => void; deleteDisabled?: boolean };

export function TransactionHistoryList({ transactions, isLoading, onEdit, onDelete, deleteDisabled = false }: Props) {
  return <Surface className="overflow-hidden"><div className="border-b border-[#e5e7eb] px-6 py-5"><h2 className="m-0 text-base font-semibold text-[#111827]">Histórico de transações</h2></div>
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-[#f9fafb] text-xs uppercase tracking-[.05em] text-[#6b7280]"><tr>{["Descrição", "Data", "Categoria", "Tipo", "Valor", "Ações"].map((label) => <th key={label} scope="col" className="px-6 py-4 font-medium">{label}</th>)}</tr></thead>
      <tbody className="divide-y divide-[#e5e7eb] text-sm text-[#374151]">{isLoading ? <tr><td colSpan={6} className="px-6 py-8">Carregando transações...</td></tr> : transactions.length === 0 ? <tr><td colSpan={6} className="px-6 py-8">Nenhuma transação cadastrada.</td></tr> : transactions.map((transaction) => <tr key={transaction.id}>
        <td className="px-6 py-4 font-medium text-[#111827]">{transaction.title}</td><td className="px-6 py-4">{formatDate(transaction.date)}</td><td className="px-6 py-4">{transaction.category?.title ?? "Sem categoria"}</td><td className="px-6 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium ${transaction.type === "INCOME" ? "bg-[#e0fae9] text-[#15803d]" : "bg-[#fee2e2] text-[#dc2626]"}`}>{transaction.type === "INCOME" ? "Receita" : "Despesa"}</span></td><td className={`px-6 py-4 font-semibold ${transaction.type === "INCOME" ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{transaction.type === "INCOME" ? "+" : "−"}{formatCurrency(Number(transaction.amount))}</td>
        <td className="px-6 py-4"><div className="flex gap-2"><button type="button" aria-label={`Editar ${transaction.title}`} title="Editar" onClick={() => onEdit(transaction)} className="rounded-lg border border-[#d1d5db] p-2 hover:bg-[#f3f4f6]"><img src="/Icon/square-pen.svg" alt="" className="h-4 w-4" /></button><button type="button" aria-label={`Excluir ${transaction.title}`} title="Excluir" disabled={deleteDisabled} onClick={() => onDelete(transaction.id)} className="rounded-lg border border-[#d1d5db] p-2 hover:bg-[#fee2e2] disabled:opacity-50"><img src="/Icon/trash.svg" alt="" className="h-4 w-4" /></button></div></td>
      </tr>)}</tbody></table></div></Surface>;
}
