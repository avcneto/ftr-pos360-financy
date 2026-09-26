type TransactionTypeToggleProps = {
  selectedType: "EXPENSE" | "INCOME";
  onChange: (type: "EXPENSE" | "INCOME") => void;
};

export function TransactionTypeToggle({
  selectedType,
  onChange,
}: TransactionTypeToggleProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-[12px] border border-[#e5e7eb] bg-[#f8f9fa] p-2"
      role="group"
      aria-label="Transaction type"
    >
      <button
        type="button"
        className={`rounded-[8px] px-[14px] py-3 text-[15px] font-medium transition ${
          selectedType === "EXPENSE"
            ? "bg-[#fee2e2] text-[#dc2626]"
            : "bg-[#f8f9fa] text-[#374151]"
        }`}
        onClick={() => onChange("EXPENSE")}
      >
        Expense
      </button>
      <button
        type="button"
        className={`rounded-[8px] px-[14px] py-3 text-[15px] font-medium transition ${
          selectedType === "INCOME"
            ? "bg-[#e0fae9] text-[#16a34a]"
            : "bg-[#f8f9fa] text-[#374151]"
        }`}
        onClick={() => onChange("INCOME")}
      >
        Income
      </button>
    </div>
  );
}
