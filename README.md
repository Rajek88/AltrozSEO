# altroz-seo

Generate SEO meta tags, Open Graph tags, Twitter Cards, and JSON-LD structured data for React and Angular applications by fetching config from your API.

## Installation

```bash
npm install altroz-seo
```

## Features

- ✅ **API Integration**: Fetch SEO config from your API using API key
- ✅ Meta tags (title, description, keywords, author, robots, etc.)
- ✅ Open Graph tags for social media sharing
- ✅ Twitter Card tags
- ✅ JSON-LD structured data (Article, Product, Recipe, Event, FAQ, and more)
- ✅ React components and hooks
- ✅ Angular service helpers
- ✅ HTML string output
- ✅ TypeScript support

## Usage

The library fetches SEO config from your API using an API key. By default, it uses the PROD environment URL.

### React

#### Using the AltrozSEO Component

```tsx
import { AltrozSEO } from "altroz-seo";
import { Helmet } from "react-helmet-async"; // or react-helmet

function MyPage() {
  return (
    <>
      <Helmet>
        <AltrozSEO apiKey="your-api-key-here" />
      </Helmet>
      <div>My page content</div>
    </>
  );
}
```

#### Using the useAltrozSeo Hook

```tsx
import { useAltrozSeo } from "altroz-seo";
import { Helmet } from "react-helmet-async";

function MyPage() {
  const { title, allElements, loading } = useAltrozSeo("your-api-key-here");

  if (loading) {
    return <div>Loading SEO tags...</div>;
  }

  return (
    <>
      <Helmet>{allElements}</Helmet>
      <div>My page content</div>
    </>
  );
}
```

#### Using Next.js

```tsx
import { useAltrozSeo } from "altroz-seo";
import Head from "next/head";

function MyPage() {
  const { allElements, loading } = useAltrozSeo("your-api-key-here");

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>{allElements}</Head>
      <div>My page content</div>
    </>
  );
}
```

### Angular

#### Using the AltrozSEOAngularHelper Service

```typescript
import { Component, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { AltrozSEOAngularHelper } from "altroz-seo";

@Component({
  selector: "app-my-page",
  template: "<div>My page content</div>",
})
export class MyPageComponent implements OnInit {
  private seoHelper: AltrozSEOAngularHelper;

  constructor(private meta: Meta, private title: Title) {
    this.seoHelper = new AltrozSEOAngularHelper(meta, title);
  }

  async ngOnInit() {
    await this.seoHelper.applyAltrozSeo("your-api-key-here");
  }
}
```

#### Using Standalone Function

```typescript
import { Component, OnInit } from "@angular/core";
import { Meta, Title } from "@angular/platform-browser";
import { getAltrozSeoMetaTags } from "altroz-seo";

@Component({
  selector: "app-my-page",
  template: "<div>My page content</div>",
})
export class MyPageComponent implements OnInit {
  constructor(private meta: Meta, private title: Title) {}

  async ngOnInit() {
    const tags = await getAltrozSeoMetaTags("your-api-key-here");

    if (tags.title) {
      this.title.setTitle(tags.title);
    }

    tags.metaTags.forEach((meta) => {
      if (meta.name) {
        this.meta.updateTag({ name: meta.name, content: meta.content });
      } else if (meta.property) {
        this.meta.updateTag({ property: meta.property, content: meta.content });
      }
    });
  }
}
```

### HTML String Output

For server-side rendering or static site generation:

```typescript
import { generateAltrozSeoHTML } from "altroz-seo";

const html = await generateAltrozSeoHTML("your-api-key-here");
// Returns HTML string ready to inject into <head>
```

### Programmatic Use

```typescript
import { fetchAltrozSeoConfig, generateMetaTags } from "altroz-seo";

const config = await fetchAltrozSeoConfig("your-api-key-here");

if (config) {
  const output = generateMetaTags(config);
  // Returns: { title, metaTags[], linkTags[], scriptTags[] }
}
```

## API Configuration

The library fetches SEO config from your API endpoint. By default, it uses:

- **API URL**: `https://altroz-seo-be.vercel.app/v1/client-code/seo-data` (PROD environment - automatically used)
- **API Key**: Passed as query parameter `apiKey` (required)

The API should return a response in this format:

```json
{
  "message": "Success",
  "config": [
    {
      "id": "config-1",
      "metaTags": { ... },
      "openGraph": { ... },
      "twitterCard": { ... },
      "structuredData": { ... }
    }
  ]
}
```

The library uses the first config from the API response. The API should handle which config to return based on the request (e.g., based on the current URL or other request parameters).

## JSON-LD Structured Data

The library supports various structured data types:

Supported structured data types:

- Article
- Product
- Recipe
- Event
- FAQ
- Book
- Video
- LocalBusiness
- JobPosting
- Organization
- Website
- And more...

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import { SEOConfig, MetaTagsOutput } from "altroz-seo";

const config: SEOConfig = await fetchAltrozSeoConfig("api-key");
const output: MetaTagsOutput = generateMetaTags(config);
```

## License

MIT
