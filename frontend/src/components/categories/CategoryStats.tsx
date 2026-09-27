import type { Category } from "../../types";
import { Surface } from "../ui/Surface";
import { CategoryIcon } from "./CategoryIcon";

const TRANSACTION_ICON_MASK = 'url("/Icon/arrow-up-down.svg") center / contain no-repeat';

type CategoryStatsProps = {
  total: number;
  transactionTotal: number;
  mostUsedCategory: Category | null;
};

export function CategoryStats({
  total,
  transactionTotal,
  mostUsedCategory,
}: CategoryStatsProps) {
  return (
    <section className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
      <Surface className="flex items-start gap-4 px-6 py-5">
        <CategoryIcon name="tag" color="#334155" className="mt-1 h-5 w-5" />
        <div className="flex flex-col gap-2">
          <strong className="text-2xl font-bold leading-none text-[#111827]">{total}</strong>
          <span className="text-[11px] font-medium uppercase tracking-[.08em] text-[#667085]">Total de categorias</span>
        </div>
      </Surface>
      <Surface className="flex items-start gap-4 px-6 py-5">
        <span
          aria-hidden="true"
          className="mt-1 block h-5 w-5 shrink-0 bg-[#9333ea]"
          style={{ mask: TRANSACTION_ICON_MASK, WebkitMask: TRANSACTION_ICON_MASK }}
        />
        <div className="flex flex-col gap-2">
          <strong className="text-2xl font-bold leading-none text-[#111827]">{transactionTotal}</strong>
          <span className="text-[11px] font-medium uppercase tracking-[.08em] text-[#667085]">Total de transações</span>
        </div>
      </Surface>
      <Surface className="flex items-center gap-3 px-[18px] py-5">
        {mostUsedCategory && (
          <span className="grid h-12 w-12 shrink-0 place-items-center">
            <CategoryIcon name={mostUsedCategory.icon} color={mostUsedCategory.color} className="h-6 w-6" />
          </span>
        )}
        <div className="flex flex-col gap-2">
          <strong className="text-2xl font-bold leading-none text-[#111827]">
            {mostUsedCategory?.title ?? "—"}
          </strong>
          <span className="text-[11px] font-medium uppercase tracking-[.08em] text-[#667085]">Categoria mais utilizada</span>
        </div>
      </Surface>
    </section>
  );
}
