export const CATEGORY_ICON_NAMES = [
  "briefcase-business", "car-front", "heart-pulse", "piggy-bank",
  "shopping-cart", "ticket", "tool-case", "utensils",
  "paw-print", "house", "gift", "dumbbell",
  "book-open", "baggage-claim", "mailbox", "receipt-text",
] as const;

const knownIcons = new Set<string>([...CATEGORY_ICON_NAMES, "tag"]);

type CategoryIconProps = {
  name?: string | null;
  color?: string | null;
  className?: string;
};

export function CategoryIcon({ name, color = "#1f6f43", className = "h-5 w-5" }: CategoryIconProps) {
  const iconName = name && knownIcons.has(name) ? name : "tag";
  const mask = `url("/Icon/${iconName}.svg") center / contain no-repeat`;

  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${className}`}
      style={{ backgroundColor: color || "#1f6f43", mask, WebkitMask: mask }}
    />
  );
}
