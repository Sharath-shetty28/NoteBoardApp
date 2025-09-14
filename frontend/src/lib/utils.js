export function formatDate(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    hour12: true, // optional: true for AM/PM, false for 24h
  });
}
