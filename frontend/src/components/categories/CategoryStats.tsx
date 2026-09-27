import { Surface } from "../ui/Surface";

type CategoryStatsProps = {
  total: number;
  transactionTotal: number;
  mostUsedCategory: string;
};

export function CategoryStats({
  total,
  transactionTotal,
  mostUsedCategory,
}: CategoryStatsProps) {
  return (
    <section className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Total de categorias</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {total}
        </strong>
      </Surface>
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Total de transações</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {transactionTotal}
        </strong>
      </Surface>
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Categoria mais utilizada</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {mostUsedCategory}
        </strong>
      </Surface>
    </section>
  );
}
