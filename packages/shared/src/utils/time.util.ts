/**
 * Get the current UNIX timestamp in seconds.
 *
 * @returns {number} Current epoch time in seconds.
 */
export function nowInSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Get the current UNIX timestamp in milliseconds.
 *
 * @returns {number} Current epoch time in milliseconds.
 */
export function nowInMs(): number {
  return Date.now();
}

/**
 * Get a future UNIX timestamp (s), relative to now.
 *
 * @param {number} seconds - The number of seconds to add.
 * @returns {number} Future epoch time in seconds.
 *
 * @example
 * // Expire in 1 hour
 * const expiry = expiresIn(3600);
 */
export function expiresIn(seconds: number): number {
  return nowInSeconds() + seconds;
}

/**
 * Convert a UNIX timestamp in seconds into a JavaScript Date object.
 *
 * @param {number} sec - UNIX timestamp in seconds.
 * @returns {Date} JavaScript Date object.
 *
 * @example
 * const date = fromUnixSeconds(1757942383);
 */
export function fromUnixSeconds(sec: number): Date {
  return new Date(sec * 1000);
}

/**
 * Convert a JavaScript Date into UNIX timestamp (seconds).
 *
 * @param {Date} date - A JavaScript Date object.
 * @returns {number} UNIX timestamp in seconds.
 *
 * @example
 * const nowSec = toUnixSeconds(new Date());
 */
export function toUnixSeconds(date: Date): number {
  return Math.floor(date.getTime() / 1000);
}

/**
 * Format a UNIX timestamp (seconds) into a human-readable string.
 * Uses ISO date formatting without the milliseconds & Zulu marker.
 *
 * @param {number} sec - UNIX timestamp in seconds.
 * @returns {string} Formatted date string (UTC).
 *
 * @example
 * formatUnixSeconds(1757942383); // "2025-09-17 12:34:03"
 */
export function formatUnixSeconds(sec: number): string {
  return fromUnixSeconds(sec).toISOString().replace("T", " ").split(".")[0];
}

/**
 * Check if a given UNIX timestamp (seconds) has already passed.
 *
 * @param {number} expirySec - UNIX timestamp in seconds.
 * @returns {boolean} True if expired, false otherwise.
 *
 * @example
 * isExpired(1757942383); // false if still in the future
 */
export function isExpired(expirySec: number): boolean {
  return expirySec < nowInSeconds();
}
