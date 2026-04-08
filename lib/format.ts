export function formatCurrencyGHS(value?: number | string): string {
  const parsed = typeof value === "string" ? Number(value) : value;

  if (typeof parsed !== "number" || Number.isNaN(parsed)) {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 2
  }).format(parsed);
}

export function formatDateRange(start?: string, end?: string): string {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("en-GH", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return `${formatter.format(startDate)} - ${formatter.format(endDate)}`;
}

export function normalizeExternalUrl(url?: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}
