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
  const iconColor = tone === "income" ? "#1f6f43" : tone === "expense" ? "#dc2626" : "#9333ea";
  const iconMask = `url("/Icon/${icon}.svg") center / contain no-repeat`;

  return (
    <Surface className="flex flex-col gap-5 p-7">
      <div className="flex items-center gap-3">
        <span aria-hidden="true" className="block h-5 w-5 shrink-0" style={{ backgroundColor: iconColor, mask: iconMask, WebkitMask: iconMask }} />
        <span className="text-xs font-medium uppercase tracking-[.06em] text-[#6b7280]">{label}</span>
      </div>
      <strong className="text-[32px] font-bold leading-none text-[#111827]">
        {value}
      </strong>
    </Surface>
  );
}
