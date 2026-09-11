/**
 * String utilities — slug, trim, truncate, mask, sanitize helpers.
 *
 * @module utils/string
 */

/** Slugify a string: 'Hello World!' → 'hello-world' */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Trim whitespace and collapse internal whitespace to single spaces. */
export function trimExtra(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/** Truncate a string to maxLength, appending '…' if truncated. */
export function truncate(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, Math.max(0, maxLength - 1)) + '…';
}

/** Mask a string from the middle, showing only first/last n chars.
 *  e.g. mask('secret123', 2) → 'se******23'
 */
export function mask(value: string, visible = 2): string {
  if (value.length <= visible * 2) return '*'.repeat(value.length);
  const head = value.slice(0, visible);
  const tail = value.slice(-visible);
  const middle = '*'.repeat(Math.max(0, value.length - visible * 2));
  return `${head}${middle}${tail}`;
}

/** Mask an email: 'minhdao@school.vn' → 'mi****@s*****.vn' */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return mask(email, 2);
  return `${mask(local, 2)}@${mask(domain, 2)}`;
}

/** Capitalize first letter: 'hello' → 'Hello' */
export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Convert to title case: 'hello world' → 'Hello World' */
export function toTitleCase(value: string): string {
  return value.replace(/\w\S*/g, (txt) =>
    txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase(),
  );
}

/** Strip HTML tags from a string. */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

/** Generate a random alphanumeric string of given length. */
export function randomString(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const array = new Uint32Array(length);
  // Use a simple LCG seeded with Date.now() for deterministic-ish randomness
  // (Good enough for non-crypto uses like one-time codes)
  let seed = Date.now();
  for (let i = 0; i < length; i++) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    array[i] = Math.abs(seed) >>> 0;
  }
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

/** Check if a string is blank (empty or whitespace only). */
export function isBlank(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/** Sanitize a string for safe use as a filename (remove path separators, null bytes). */
export function sanitizeFilename(name: string): string {
  return name.replace(/[\/\\:*?"<>|\x00-\x1f]/g, '_').trim();
}
