import { Button } from "../ui/Button";
import { Surface } from "../ui/Surface";
import type { Transaction } from "../../types";
import { formatCurrency } from "../../utils/formatters";

type TransactionHistoryListProps = {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  deleteDisabled?: boolean;
};

export function TransactionHistoryList({
  transactions,
  isLoading,
  onEdit,
  onDelete,
  deleteDisabled = false,
}: TransactionHistoryListProps) {
  return (
    <Surface className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="m-0 text-[#111827]">Transaction history</h2>
      </div>

      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {isLoading ? (
          <li className="text-[#6b7280]">Loading transactions...</li>
        ) : transactions.length === 0 ? (
          <li className="text-[#6b7280]">No transactions yet.</li>
        ) : (
          transactions.map((transaction) => (
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
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => onEdit(transaction)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    type="button"
                    disabled={deleteDisabled}
                    onClick={() => onDelete(transaction.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </Surface>
  );
}
