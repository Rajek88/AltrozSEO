import React, { useEffect, useState } from "react";
import { SEOConfig } from "./types";
import { generateMetaTags } from "./metaTagsGenerator";
import { fetchAltrozSeoConfig } from "./api";

/**
 * React component that renders Altroz SEO meta tags
 * Accepts API key to fetch config from API (uses PROD URL by default)
 */
export function AltrozSEO({
  apiKey,
  apiUrl,
}: {
  apiKey: string;
  apiUrl?: string;
}) {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (apiKey) {
      setLoading(true);
      fetchAltrozSeoConfig(apiKey, apiUrl)
        .then((fetchedConfig) => {
          setSeoConfig(fetchedConfig);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [apiKey, apiUrl]);

  if (loading || !seoConfig) {
    return null;
  }

  const output = generateMetaTags(seoConfig);

  return (
    <>
      {output.title && <title>{output.title}</title>}
      {output.metaTags.map((meta, index) => (
        <meta
          key={index}
          {...(meta.name && { name: meta.name })}
          {...(meta.property && { property: meta.property })}
          {...(meta.httpEquiv && { httpEquiv: meta.httpEquiv })}
          content={meta.content}
        />
      ))}
      {output.linkTags.map((link, index) => (
        <link key={index} rel={link.rel} href={link.href} />
      ))}
      {output.scriptTags.map((script, index) => (
        <script
          key={index}
          type={script.type}
          dangerouslySetInnerHTML={{ __html: script.children }}
        />
      ))}
    </>
  );
}

/**
 * React hook that returns Altroz SEO meta tags as JSX elements
 * Accepts API key to fetch config from API (uses PROD URL by default)
 */
export function useAltrozSeo(apiKey: string, apiUrl?: string) {
  const [seoConfig, setSeoConfig] = useState<SEOConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (apiKey) {
      setLoading(true);
      fetchAltrozSeoConfig(apiKey, apiUrl)
        .then((fetchedConfig) => {
          setSeoConfig(fetchedConfig);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [apiKey, apiUrl]);

  if (loading || !seoConfig) {
    return {
      title: undefined,
      metaElements: [],
      linkElements: [],
      scriptElements: [],
      allElements: null,
      loading: true,
    };
  }

  const output = generateMetaTags(seoConfig);

  const metaElements = output.metaTags.map((meta, index) => (
    <meta
      key={index}
      {...(meta.name && { name: meta.name })}
      {...(meta.property && { property: meta.property })}
      {...(meta.httpEquiv && { httpEquiv: meta.httpEquiv })}
      content={meta.content}
    />
  ));

  const linkElements = output.linkTags.map((link, index) => (
    <link key={index} rel={link.rel} href={link.href} />
  ));

  const scriptElements = output.scriptTags.map((script, index) => (
    <script
      key={index}
      type={script.type}
      dangerouslySetInnerHTML={{ __html: script.children }}
    />
  ));

  return {
    title: output.title,
    metaElements,
    linkElements,
    scriptElements,
    allElements: (
      <>
        {output.title && <title>{output.title}</title>}
        {metaElements}
        {linkElements}
        {scriptElements}
      </>
    ),
    loading: false,
  };
}
