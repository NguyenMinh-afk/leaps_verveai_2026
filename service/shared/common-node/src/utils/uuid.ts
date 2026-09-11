/**
 * UUID utilities — generation and validation.
 *
 * @module utils/uuid
 */

import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';

/** Generate a new UUID v4. */
export function uuid(): string {
  return uuidv4();
}

/** Validate a string as UUID v4.
 *  Returns true if valid UUID v4, false otherwise.
 */
export function isUUID(value: string): boolean {
  return uuidValidate(value) && uuidVersion(value) === 4;
}

/** Parse a UUID, returning null if invalid. */
export function parseUUID(value: string): string | null {
  return isUUID(value) ? value : null;
}

/**
 * Short ID — 8-char hex string (not a UUID, just for internal IDs).
 * NOT for security-sensitive use cases.
 */
export function shortId(): string {
  return uuid().replace(/-/g, '').slice(0, 8);
}

/** Check if a string looks like a short ID (8 hex chars). */
export function isShortId(value: string): boolean {
  return /^[0-9a-f]{8}$/i.test(value);
}
