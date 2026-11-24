// ══════════════════════════════════════════════════════════════
//  DATE UTILITIES
// ══════════════════════════════════════════════════════════════
export const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const DAY_MS = 24 * 60 * 60 * 1000;
const pad2 = (n: number): string => String(n).padStart(2, '0');

export function isValidDate(d: Date): boolean {
  return !isNaN(d.getTime());
}

// Parses a date string that may be ISO ("2026-08-13") or the M/D/YYYY
// format Google Sheets CSV exports use ("8/13/2026"). ISO date-only
// strings need a local-midnight anchor or they parse as UTC and can
// display as the previous day; M/D/YYYY already parses as local time.
export function parseEventDate(dateStr: string | null | undefined): Date {
  if (!dateStr) return new Date(NaN);
  const s = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + 'T00:00:00');
  return new Date(s);
}

export function formatEventDate(dateStr: string, endDateStr?: string | null): string {
  const d = parseEventDate(dateStr);
  if (!isValidDate(d)) return '';
  const label = MONTH_NAMES[d.getMonth()] + ' ' + pad2(d.getDate());
  if (!endDateStr) return label;
  const e = parseEventDate(endDateStr);
  if (!isValidDate(e)) return label;
  if (e.getFullYear() === d.getFullYear() && e.getMonth() === d.getMonth()) {
    return MONTH_NAMES[d.getMonth()] + ' ' + pad2(d.getDate()) + '-' + pad2(e.getDate());
  }
  return label + ' - ' + MONTH_NAMES[e.getMonth()] + ' ' + pad2(e.getDate());
}

// Parse "Month DD" (no year) lead date strings, assuming current year.
// If the result is >6 months in the past it wraps to next year.
export function parseLeadDate(dateStr: string): Date {
  const now = new Date();
  const d = new Date(dateStr + ' ' + now.getFullYear());
  if (now.getTime() - d.getTime() > 180 * DAY_MS) d.setFullYear(d.getFullYear() + 1);
  return d;
}

export function isUpcomingLead(dateStr: string): boolean {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return parseLeadDate(dateStr) >= today;
}

// Whole days between today and a given Date (positive = date is in the past).
export function daysAgo(date: Date): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(date); d.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - d.getTime()) / DAY_MS);
}

// Format a Date object as "Month DD" (no year), e.g. "July 18".
export function formatShortDate(date: Date): string {
  return MONTH_NAMES[date.getMonth()] + ' ' + pad2(date.getDate());
}
