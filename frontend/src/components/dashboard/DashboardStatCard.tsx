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
  const toneClass =
    tone === "income"
      ? "text-[#16a34a]"
      : tone === "expense"
        ? "text-[#dc2626]"
        : "text-[#111827]";

  return (
    <Surface className="flex flex-col gap-4 p-6">
      <span className="text-sm text-[#6b7280]">{label}</span>
      <strong className={`text-[30px] font-semibold leading-none ${toneClass}`}>
        {value}
      </strong>
    </Surface>
  );
}
