import { SEOConfig } from "./types";
import { generateMetaTags } from "./metaTagsGenerator";
import { fetchAltrozSeoConfig } from "./api";

/**
 * Angular Meta and Title types (to avoid requiring @angular/platform-browser as dependency)
 */
export interface AngularMeta {
  updateTag(tag: {
    name?: string;
    property?: string;
    httpEquiv?: string;
    content: string;
    rel?: string;
    href?: string;
  }): void;
  removeTag(attrSelector: string): boolean;
}

export interface AngularTitle {
  setTitle(title: string): void;
}

/**
 * Angular service helper to apply Altroz SEO meta tags
 * Usage: Inject Meta and Title services, then call applyAltrozSeo()
 */
export class AltrozSEOAngularHelper {
  constructor(private meta: AngularMeta, private title: AngularTitle) {}

  /**
   * Apply Altroz SEO meta tags to Angular Meta service
   * Accepts API key to fetch config from API (uses PROD URL by default)
   */
  async applyAltrozSeo(apiKey: string, apiUrl?: string): Promise<void> {
    const config = await fetchAltrozSeoConfig(apiKey, apiUrl);

    if (!config) {
      return;
    }
    const output = generateMetaTags(config);

    // Set title
    if (output.title) {
      this.title.setTitle(output.title);
    }

    // Remove existing meta tags (optional - you may want to keep some)
    // this.meta.removeTag('name="description"');
    // this.meta.removeTag('property="og:title"');

    // Add meta tags
    output.metaTags.forEach((meta) => {
      if (meta.name) {
        this.meta.updateTag({ name: meta.name, content: meta.content });
      } else if (meta.property) {
        this.meta.updateTag({ property: meta.property, content: meta.content });
      } else if (meta.httpEquiv) {
        this.meta.updateTag({
          httpEquiv: meta.httpEquiv,
          content: meta.content,
        });
      }
    });

    // Add link tags
    output.linkTags.forEach((link) => {
      this.meta.updateTag({ rel: link.rel, href: link.href, content: "" });
    });

    // Add JSON-LD scripts
    // Note: For Angular, you may want to use DOCUMENT injection instead
    // This is a simplified version that works in browser environments
    if (typeof document !== "undefined") {
      output.scriptTags.forEach((script) => {
        const scriptElement = document.createElement("script");
        scriptElement.type = script.type;
        scriptElement.textContent = script.children;
        document.head.appendChild(scriptElement);
      });
    }
  }

  /**
   * Get meta tags as objects (for programmatic use)
   */
  getAltrozSeoTags(config: SEOConfig) {
    return generateMetaTags(config);
  }
}

/**
 * Standalone function to get Altroz SEO meta tags for Angular (without service injection)
 * Accepts API key to fetch config from API (uses PROD URL by default)
 */
export async function getAltrozSeoMetaTags(apiKey: string, apiUrl?: string) {
  const config = await fetchAltrozSeoConfig(apiKey, apiUrl);

  if (!config) {
    return {
      title: undefined,
      metaTags: [],
      linkTags: [],
      scriptTags: [],
    };
  }

  return generateMetaTags(config);
}
