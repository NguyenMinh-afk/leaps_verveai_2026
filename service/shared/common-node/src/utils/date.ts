/**
 * Date utilities — ISO 8601, timezone, and duration helpers.
 *
 * @module utils/date
 */

export type ISO8601 = string; // e.g. '2026-09-10T09:00:00.000Z'

/** Get current time as ISO 8601 string (UTC). */
export function now(): ISO8601 {
  return new Date().toISOString();
}

/** Parse an ISO 8601 string to Date. */
export function parseDate(value: string): Date {
  return new Date(value);
}

/** Format a Date to ISO 8601 string. */
export function formatDate(date: Date): ISO8601 {
  return date.toISOString();
}

/** Format a Date to date-only string (YYYY-MM-DD). */
export function formatDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Format a Date to time-only string (HH:MM:SS). */
export function formatTimeOnly(date: Date): string {
  return date.toISOString().slice(11, 19);
}

/** Get start of day (00:00:00 UTC) for a given date. */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/** Get end of day (23:59:59.999 UTC) for a given date. */
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

/** Check if a date is in the past (before now). */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/** Check if a date is in the future (after now). */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}

/** Add days to a date. */
export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/** Add hours to a date. */
export function addHours(date: Date, hours: number): Date {
  const d = new Date(date);
  d.setUTCHours(d.getUTCHours() + hours);
  return d;
}

/** Add minutes to a date. */
export function addMinutes(date: Date, minutes: number): Date {
  const d = new Date(date);
  d.setUTCMinutes(d.getUTCMinutes() + minutes);
  return d;
}

/** Get difference in days between two dates. */
export function diffDays(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((b.getTime() - a.getTime()) / msPerDay);
}

/** Get difference in hours between two dates. */
export function diffHours(a: Date, b: Date): number {
  const msPerHour = 1000 * 60 * 60;
  return Math.round((b.getTime() - a.getTime()) / msPerHour);
}

/** Parse a duration string like '1d', '7d', '15m' to milliseconds. */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([dhms])$/);
  if (!match) throw new Error(`Invalid duration: ${duration}`);
  const value = parseInt(match[1], 10);
  switch (match[2]) {
    case 'd': return value * 86_400_000;
    case 'h': return value * 3_600_000;
    case 'm': return value * 60_000;
    case 's': return value * 1_000;
    default: throw new Error(`Unknown duration unit: ${match[2]}`);
  }
}

/** Format milliseconds to a human-readable duration string. */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  if (ms < 3_600_000) return `${(ms / 60_000).toFixed(1)}m`;
  if (ms < 86_400_000) return `${(ms / 3_600_000).toFixed(1)}h`;
  return `${(ms / 86_400_000).toFixed(1)}d`;
}
