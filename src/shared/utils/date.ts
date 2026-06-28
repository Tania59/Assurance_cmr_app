export const TODAY_STR = "2026-06-21";
export const TODAY = new Date(TODAY_STR);

export function fmtDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysUntil(date: string): number {
  return Math.round((new Date(date).getTime() - TODAY.getTime()) / 86400000);
}