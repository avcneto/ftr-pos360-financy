import { Surface } from "../ui/Surface";

type DashboardStatCardProps = {
  label: string;
  value: string;
  tone: "income" | "expense" | "neutral";
};

export function DashboardStatCard({
  label,
  value,
  tone,
}: DashboardStatCardProps) {
  const icon = tone === "income" ? "circle-arrow-up" : tone === "expense" ? "circle-arrow-down" : "wallet";

  return (
    <Surface className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between"><span className="text-xs font-medium uppercase tracking-[.05em] text-[#6b7280]">{label}</span><img src={`/Icon/${icon}.svg`} alt="" className="h-5 w-5" /></div>
      <strong className="text-[28px] font-bold leading-none text-[#111827]">
        {value}
      </strong>
    </Surface>
  );
}
