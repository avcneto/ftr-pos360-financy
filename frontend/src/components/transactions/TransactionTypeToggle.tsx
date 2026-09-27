type TransactionTypeToggleProps = {
  selectedType: "EXPENSE" | "INCOME";
  onChange: (type: "EXPENSE" | "INCOME") => void;
};

function TypeIcon({ name }: { name: "circle-arrow-down" | "circle-arrow-up" }) {
  const mask = `url("/Icon/${name}.svg") center / contain no-repeat`;

  return (
    <span
      aria-hidden="true"
      className="h-5 w-5 shrink-0 bg-current"
      style={{ mask, WebkitMask: mask }}
    />
  );
}

export function TransactionTypeToggle({
  selectedType,
  onChange,
}: TransactionTypeToggleProps) {
  return (
    <div
      className="grid grid-cols-2 gap-2 rounded-[12px] border border-[#e5e7eb] bg-white p-2"
      role="group"
      aria-label="Tipo de transação"
    >
      <button
        type="button"
        className={`flex items-center justify-center gap-2 rounded-[8px] border px-[14px] py-3 text-[15px] font-medium transition ${
          selectedType === "EXPENSE"
            ? "border-[#dc2626] bg-[#f8f9fa] text-[#dc2626]"
            : "border-transparent bg-white text-[#374151]"
        }`}
        onClick={() => onChange("EXPENSE")}
      >
        <TypeIcon name="circle-arrow-down" />Despesa
      </button>
      <button
        type="button"
        className={`flex items-center justify-center gap-2 rounded-[8px] border px-[14px] py-3 text-[15px] font-medium transition ${
          selectedType === "INCOME"
            ? "border-[#16a34a] bg-[#f8f9fa] text-[#16a34a]"
            : "border-transparent bg-white text-[#374151]"
        }`}
        onClick={() => onChange("INCOME")}
      >
        <TypeIcon name="circle-arrow-up" />Receita
      </button>
    </div>
  );
}
