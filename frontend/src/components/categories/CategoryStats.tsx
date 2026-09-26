import { Surface } from "../ui/Surface";

type CategoryStatsProps = {
  total: number;
  withDescription: number;
  withCustomColor: number;
};

export function CategoryStats({
  total,
  withDescription,
  withCustomColor,
}: CategoryStatsProps) {
  return (
    <section className="grid grid-cols-3 gap-4 max-[980px]:grid-cols-1">
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Total categories</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {total}
        </strong>
      </Surface>
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">With description</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {withDescription}
        </strong>
      </Surface>
      <Surface className="flex flex-col gap-2 px-[18px] py-5">
        <span className="text-[13px] text-[#6b7280]">Custom colors</span>
        <strong className="text-2xl leading-tight text-[#111827]">
          {withCustomColor}
        </strong>
      </Surface>
    </section>
  );
}
