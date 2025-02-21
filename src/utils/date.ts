/**
 * Formats a breach date string into a human-readable format
 * @param dateStr - Date string in YYYY-MM format, can be null or undefined
 * @returns Formatted date string (e.g., "January 2024") or "Unknown" if no date
 */
export function formatBreachDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Unknown";

  const [year, month] = dateStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });
}
