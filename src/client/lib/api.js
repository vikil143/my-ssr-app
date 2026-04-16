/**
 * Custom error class for non-2xx HTTP responses.
 * Carries the HTTP status code alongside the message.
 */
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name   = 'ApiError';
    this.status = status;
  }
}

/**
 * apiFetch — thin fetch wrapper with structured error handling.
 *
 * - Automatically sets Content-Type: application/json
 * - Throws ApiError for non-2xx responses (tries to read `message` from JSON body)
 * - Throws ApiError with status 0 for network / connection failures
 *
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<any>} Parsed JSON response body
 */
export async function apiFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let message = `Request failed (${res.status} ${res.statusText})`;
      try {
        const body = await res.json();
        message = body.message || body.error || message;
      } catch {
        // Body was not JSON — keep the default message
      }
      throw new ApiError(message, res.status);
    }

    // Handle 204 No Content
    if (res.status === 204) return null;

    return await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    // Network error, CORS failure, server unreachable, etc.
    throw new ApiError(
      'Network error — please check your connection and try again.',
      0
    );
  }
}
