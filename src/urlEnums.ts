/**
 * URL Enums and Constants for SEO Meta Tags Module
 */

const URL_SET = {
  PROD: "https://altroz-seo-be.vercel.app",
  DEV: "http://localhost:3000",
};

export const BASE_URL = {
  USABLE: URL_SET.PROD,
};

/**
 * Default API endpoint - uses PROD by default
 */
export const DEFAULT_API_URL = `${BASE_URL.USABLE}/v1/client-code/seo-data`;
