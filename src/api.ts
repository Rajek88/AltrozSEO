import { SEOConfig } from "./types";
import { DEFAULT_API_URL } from "./urlEnums";

export interface APIResponse {
  message: string;
  config: SEOConfig[];
}

/**
 * Fetch Altroz SEO config from API
 * Returns the first config from the API response (API should handle which config to return)
 */
export async function fetchAltrozSeoConfig(
  apiKey: string,
  apiUrl: string = DEFAULT_API_URL
): Promise<SEOConfig | null> {
  try {
    // Build URL with API key parameter
    const separator = apiUrl.includes("?") ? "&" : "?";
    const url = `${apiUrl}${separator}apiKey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const data: APIResponse = await response.json();

    if (!data.config || data.config.length === 0) {
      return null;
    }

    // Return the first config from the API response
    // The API should handle which config to return based on the request
    return data.config[0];
  } catch (error) {
    console.error("Failed to fetch SEO config:", error);
    return null;
  }
}
