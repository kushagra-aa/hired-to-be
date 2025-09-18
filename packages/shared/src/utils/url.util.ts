/**
 * Convert an object into a redirect URL with query params.
 *
 * @param {string} endpoint - Endpoint to redirect to.
 * @param {Record<string, unknown>} params - Key-value pairs to add as query params.
 * @returns {string} Full URL with encoded query string.
 *
 * @example
 * buildRelativeRedirectUrl("/callback", { success: true, expiresAt: 1757942383 });
 * // "/callback?success=true&expiresAt=1757942383"
 */
export function buildRelativeRedirectUrl(
  endpoint: string,
  params: Record<string, unknown>,
): string {
  const url = new URL(endpoint, "http://dummy-base"); // dummy needed for relative paths
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  return url.pathname + url.search;
}

/**
 * Normalize a base URL so it has no trailing slash.
 *
 * @param {string} url - The base URL.
 * @returns {string} Normalized base URL without trailing slash.
 *
 * @example
 * normalizeBaseUrl("http://local/"); // "http://local"
 */
export function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

/**
 * Normalize a path so it has a leading slash, but no trailing slash.
 *
 * @param {string} path - Path string.
 * @returns {string} Normalized path with exactly one leading slash, no trailing slash.
 *
 * @example
 * normalizePath("callback"); // "/callback"
 * normalizePath("/callback/"); // "/callback"
 */
export function normalizePath(path: string): string {
  if (!path.startsWith("/")) path = "/" + path;
  return path.replace(/\/+$/, "");
}

/**
 * Safely join a base URL and a path.
 *
 * @param {string} baseUrl - The base URL (may end with slash).
 * @param {string} path - The path (may start with slash).
 * @returns {string} Combined safe URL.
 *
 * @example
 * joinUrl("http://local/", "/callback"); // "http://local/callback"
 */
export function joinUrl(baseUrl: string, path: string): string {
  return normalizeBaseUrl(baseUrl) + normalizePath(path);
}

/**
 * Build a URL with query parameters from base + path.
 *
 * @param {string} baseUrl - Base URL.
 * @param {string} path - Path component.
 * @param {Record<string, unknown>} params - Query params object.
 * @returns {string} Full URL string.
 *
 * @example
 * buildUrl("http://api.local", "/users", { page: 2, search: "alex" });
 * // "http://api.local/users?page=2&search=alex"
 */
export function buildUrl(
  baseUrl: string,
  path: string,
  params?: Record<string, unknown>,
): string {
  const url = new URL(joinUrl(baseUrl, path));
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

/**
 * Validate if a string is a valid absolute URL.
 *
 * @param {string} maybeUrl - String to test.
 * @returns {boolean} True if valid URL.
 *
 * @example
 * isValidUrl("http://local"); // true
 * isValidUrl("not-a-url"); // false
 */
export function isValidUrl(maybeUrl: string): boolean {
  try {
    new URL(maybeUrl);
    return true;
  } catch {
    return false;
  }
}
