/**
 * Format a Date for display in a human-readable, locale-stable form.
 * A fixed locale ("en-US") is used so server and client render identically.
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
