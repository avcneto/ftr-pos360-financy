export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCurrencyInput(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function parseCurrencyInput(input: string) {
  const cleaned = input.replace(/[^\d,.-]/g, "");
  const negative = cleaned.startsWith("-");
  const unsigned = cleaned.replace(/-/g, "");
  if (!/\d/.test(unsigned)) return 0;

  const lastComma = unsigned.lastIndexOf(",");
  const lastDot = unsigned.lastIndexOf(".");
  const decimalIndex = lastComma >= 0
    ? Math.max(lastComma, lastDot)
    : lastDot >= 0 && unsigned.length - lastDot - 1 <= 2
      ? lastDot
      : -1;
  const integerPart = (decimalIndex >= 0 ? unsigned.slice(0, decimalIndex) : unsigned)
    .replace(/[.,]/g, "");
  const decimalPart = decimalIndex >= 0
    ? unsigned.slice(decimalIndex + 1).replace(/[.,]/g, "").slice(0, 2)
    : "";
  const cents = Number(integerPart || "0") * 100 + Number(decimalPart.padEnd(2, "0"));
  return (negative ? -1 : 1) * cents / 100;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(value));
}

export function todayForDateInput() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
