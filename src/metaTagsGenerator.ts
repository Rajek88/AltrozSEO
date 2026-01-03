import {
  SEOConfig,
  MetaTagsOutput,
  MetaTag,
  LinkTag,
  ScriptTag,
} from "./types";
import { escapeHtml } from "./utils";
import { generateJSONLD } from "./jsonLdGenerator";
import { fetchAltrozSeoConfig } from "./api";
import { DEFAULT_API_URL } from "./urlEnums";

/**
 * Generate meta tags as structured objects (for programmatic use)
 */
export function generateMetaTags(config: SEOConfig): MetaTagsOutput {
  const metaTags: MetaTag[] = [];
  const linkTags: LinkTag[] = [];
  const scriptTags: ScriptTag[] = [];

  // Favicon
  if (config.metaTags?.favicon) {
    linkTags.push({
      rel: "icon",
      href: config.metaTags.favicon,
    });
  }

  // Basic Meta Tags
  if (config.metaTags?.title) {
    metaTags.push({
      name: "title",
      content: config.metaTags.title,
    });
  }

  if (config.metaTags?.description) {
    metaTags.push({
      name: "description",
      content: config.metaTags.description,
    });
  }

  if (config.metaTags?.keywords) {
    metaTags.push({
      name: "keywords",
      content: config.metaTags.keywords,
    });
  }

  if (config.metaTags?.author) {
    metaTags.push({
      name: "author",
      content: config.metaTags.author,
    });
  }

  if (config.metaTags?.robots) {
    metaTags.push({
      name: "robots",
      content: config.metaTags.robots,
    });
  }

  if (config.metaTags?.language) {
    metaTags.push({
      httpEquiv: "content-language",
      content: config.metaTags.language,
    });
  }

  if (config.metaTags?.themeColor) {
    metaTags.push({
      name: "theme-color",
      content: config.metaTags.themeColor,
    });
  }

  // Open Graph Tags
  if (config.openGraph?.type) {
    metaTags.push({
      property: "og:type",
      content: config.openGraph.type,
    });
  }

  if (config.openGraph?.url) {
    metaTags.push({
      property: "og:url",
      content: config.openGraph.url,
    });
  }

  if (config.openGraph?.title) {
    metaTags.push({
      property: "og:title",
      content: config.openGraph.title,
    });
  }

  if (config.openGraph?.description) {
    metaTags.push({
      property: "og:description",
      content: config.openGraph.description,
    });
  }

  if (config.openGraph?.image) {
    metaTags.push({
      property: "og:image",
      content: config.openGraph.image,
    });
  }

  if (config.openGraph?.imageWidth) {
    metaTags.push({
      property: "og:image:width",
      content: config.openGraph.imageWidth,
    });
  }

  if (config.openGraph?.imageHeight) {
    metaTags.push({
      property: "og:image:height",
      content: config.openGraph.imageHeight,
    });
  }

  if (config.openGraph?.siteName) {
    metaTags.push({
      property: "og:site_name",
      content: config.openGraph.siteName,
    });
  }

  if (config.openGraph?.locale) {
    metaTags.push({
      property: "og:locale",
      content: config.openGraph.locale,
    });
  }

  // Twitter Card Tags
  if (config.twitterCard?.card) {
    metaTags.push({
      name: "twitter:card",
      content: config.twitterCard.card,
    });
  }

  if (config.twitterCard?.title) {
    metaTags.push({
      name: "twitter:title",
      content: config.twitterCard.title,
    });
  }

  if (config.twitterCard?.description) {
    metaTags.push({
      name: "twitter:description",
      content: config.twitterCard.description,
    });
  }

  if (config.twitterCard?.image) {
    metaTags.push({
      name: "twitter:image",
      content: config.twitterCard.image,
    });
  }

  // Canonical URL
  if (config.additional?.canonicalUrl) {
    linkTags.push({
      rel: "canonical",
      href: config.additional.canonicalUrl,
    });
  }

  // JSON-LD Structured Data
  const jsonLd = generateJSONLD(config);
  if (jsonLd) {
    // Parse JSON-LD scripts from HTML string
    const scriptMatches = jsonLd.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
    if (scriptMatches) {
      scriptMatches.forEach((match) => {
        const contentMatch = match.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        if (contentMatch && contentMatch[1]) {
          scriptTags.push({
            type: "application/ld+json",
            children: contentMatch[1].trim(),
          });
        }
      });
    }
  }

  return {
    title: config.metaTags?.title,
    metaTags,
    linkTags,
    scriptTags,
  };
}

/**
 * Generate meta tags as HTML string
 */
export function generateMetaTagsHTML(config: SEOConfig): string {
  let html = "";

  // Favicon
  if (config.metaTags?.favicon) {
    html += `<link rel="icon" href="${escapeHtml(
      config.metaTags.favicon
    )}" />\n`;
  }

  // Title
  if (config.metaTags?.title) {
    html += `<meta name="title" content="${escapeHtml(
      config.metaTags.title
    )}" />\n`;
    html += `<title>${escapeHtml(config.metaTags.title)}</title>\n`;
  }

  // Basic Meta Tags
  if (config.metaTags?.description) {
    html += `<meta name="description" content="${escapeHtml(
      config.metaTags.description
    )}" />\n`;
  }

  if (config.metaTags?.keywords) {
    html += `<meta name="keywords" content="${escapeHtml(
      config.metaTags.keywords
    )}" />\n`;
  }

  if (config.metaTags?.author) {
    html += `<meta name="author" content="${escapeHtml(
      config.metaTags.author
    )}" />\n`;
  }

  if (config.metaTags?.robots) {
    html += `<meta name="robots" content="${escapeHtml(
      config.metaTags.robots
    )}" />\n`;
  }

  if (config.metaTags?.language) {
    html += `<meta http-equiv="content-language" content="${escapeHtml(
      config.metaTags.language
    )}" />\n`;
  }

  if (config.metaTags?.themeColor) {
    html += `<meta name="theme-color" content="${escapeHtml(
      config.metaTags.themeColor
    )}" />\n`;
  }

  // Open Graph Tags
  if (config.openGraph?.type) {
    html += `<meta property="og:type" content="${escapeHtml(
      config.openGraph.type
    )}" />\n`;
  }

  if (config.openGraph?.url) {
    html += `<meta property="og:url" content="${escapeHtml(
      config.openGraph.url
    )}" />\n`;
  }

  if (config.openGraph?.title) {
    html += `<meta property="og:title" content="${escapeHtml(
      config.openGraph.title
    )}" />\n`;
  }

  if (config.openGraph?.description) {
    html += `<meta property="og:description" content="${escapeHtml(
      config.openGraph.description
    )}" />\n`;
  }

  if (config.openGraph?.image) {
    html += `<meta property="og:image" content="${escapeHtml(
      config.openGraph.image
    )}" />\n`;
  }

  if (config.openGraph?.imageWidth) {
    html += `<meta property="og:image:width" content="${escapeHtml(
      config.openGraph.imageWidth
    )}" />\n`;
  }

  if (config.openGraph?.imageHeight) {
    html += `<meta property="og:image:height" content="${escapeHtml(
      config.openGraph.imageHeight
    )}" />\n`;
  }

  if (config.openGraph?.siteName) {
    html += `<meta property="og:site_name" content="${escapeHtml(
      config.openGraph.siteName
    )}" />\n`;
  }

  if (config.openGraph?.locale) {
    html += `<meta property="og:locale" content="${escapeHtml(
      config.openGraph.locale
    )}" />\n`;
  }

  // Twitter Card Tags
  if (config.twitterCard?.card) {
    html += `<meta name="twitter:card" content="${escapeHtml(
      config.twitterCard.card
    )}" />\n`;
  }

  if (config.twitterCard?.title) {
    html += `<meta name="twitter:title" content="${escapeHtml(
      config.twitterCard.title
    )}" />\n`;
  }

  if (config.twitterCard?.description) {
    html += `<meta name="twitter:description" content="${escapeHtml(
      config.twitterCard.description
    )}" />\n`;
  }

  if (config.twitterCard?.image) {
    html += `<meta name="twitter:image" content="${escapeHtml(
      config.twitterCard.image
    )}" />\n`;
  }

  // Canonical URL
  if (config.additional?.canonicalUrl) {
    html += `<link rel="canonical" href="${escapeHtml(
      config.additional.canonicalUrl
    )}" />\n`;
  }

  // JSON-LD Structured Data
  const jsonLd = generateJSONLD(config);
  if (jsonLd) {
    html += `\n${jsonLd}\n`;
  }

  return html;
}

/**
 * Generate Altroz SEO meta tags as HTML string from API
 * Fetches config from API using API key and generates HTML
 */
export async function generateAltrozSeoHTML(
  apiKey: string,
  apiUrl: string = DEFAULT_API_URL
): Promise<string> {
  const config = await fetchAltrozSeoConfig(apiKey, apiUrl);
  if (!config) {
    return "";
  }
  return generateMetaTagsHTML(config);
}
