/**
 * Usually these would be environment variables, but in the context of a browser
 * extension, everything is public
 */

export const { DEV } = import.meta.env;

export const SERVER_URL = DEV ? "http://localhost:3000" : "https://example.com";

export const MAX_INT = 2147483648;
