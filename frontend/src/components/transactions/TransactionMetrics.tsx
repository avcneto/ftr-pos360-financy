import { Surface } from "../ui/Surface";
import { formatCurrency } from "../../utils/formatters";

type TransactionMetricsProps = {
  income: number;
  expense: number;
  total: number;
};

export function TransactionMetrics({
  income,
  expense,
  total,
}: TransactionMetricsProps) {
  return (
    <section className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Entries</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {formatCurrency(income)}
        </strong>
      </Surface>
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Outflows</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {formatCurrency(expense)}
        </strong>
      </Surface>
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Total records</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {total}
        </strong>
      </Surface>
    </section>
  );
}
