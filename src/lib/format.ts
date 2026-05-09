// Terse relative-time formatter for mono-rendered cells.
// "just now" / "3m" / "2h" / "5d" / "3w" / "4mo" / "2y".
export function formatRelative(iso: string, now: Date = new Date()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return "—";
  const diff = (now.getTime() - t) / 1000;
  if (diff < 0) return "just now";
  if (diff < 45) return "just now";
  if (diff < 90) return "1m";
  if (diff < 60 * 45) return `${Math.round(diff / 60)}m`;
  if (diff < 60 * 90) return "1h";
  if (diff < 60 * 60 * 24) return `${Math.round(diff / 3600)}h`;
  if (diff < 60 * 60 * 36) return "1d";
  if (diff < 60 * 60 * 24 * 7) return `${Math.round(diff / 86400)}d`;
  if (diff < 60 * 60 * 24 * 14) return "1w";
  if (diff < 60 * 60 * 24 * 60) return `${Math.round(diff / (86400 * 7))}w`;
  if (diff < 60 * 60 * 24 * 365) return `${Math.round(diff / (86400 * 30))}mo`;
  return `${Math.round(diff / (86400 * 365))}y`;
}
