import { SEOConfig } from "./types";
import { getFirstItem } from "./utils";

export function generateJSONLD(config: SEOConfig): string {
  const structuredData = config.structuredData;
  if (!structuredData) return "";

  const scripts: string[] = [];

  // Organization (always included if data exists)
  if (structuredData.organization?.name) {
    const orgScript = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: structuredData.organization.name,
      ...(structuredData.organization.url && {
        url: structuredData.organization.url,
      }),
      ...(structuredData.organization.logo && {
        logo: structuredData.organization.logo,
      }),
      ...(structuredData.organization.sameAs && {
        sameAs: structuredData.organization.sameAs
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      }),
    };
    scripts.push(JSON.stringify(orgScript, null, 2));
  }

  // Website (always included if data exists)
  if (structuredData.website?.name) {
    const websiteScript: any = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: structuredData.website.name,
      ...(structuredData.website.url && { url: structuredData.website.url }),
      ...(structuredData.website.description && {
        description: structuredData.website.description,
      }),
    };
    if (structuredData.website.potentialActionTarget) {
      websiteScript.potentialAction = {
        "@type": "SearchAction",
        target: structuredData.website.potentialActionTarget,
        ...(structuredData.website.potentialActionQueryInput && {
          "query-input": structuredData.website.potentialActionQueryInput,
        }),
      };
    }
    scripts.push(JSON.stringify(websiteScript, null, 2));
  }

  // Helper function to generate Article JSON-LD
  const generateArticleScript = (article: any): any => {
    const articleScript: any = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.headline,
      ...(article.image && { image: article.image }),
      ...(article.datePublished && { datePublished: article.datePublished }),
      ...(article.dateModified && { dateModified: article.dateModified }),
      ...(article.description && { description: article.description }),
    };
    if (article.authorName) {
      articleScript.author = {
        "@type": "Person",
        name: article.authorName,
        ...(article.authorUrl && { url: article.authorUrl }),
      };
    }
    if (article.publisherName) {
      articleScript.publisher = {
        "@type": "Organization",
        name: article.publisherName,
        ...(article.publisherLogo && {
          logo: {
            "@type": "ImageObject",
            url: article.publisherLogo,
          },
        }),
      };
    }
    return articleScript;
  };

  // Article - support single or array
  if (
    structuredData.enabledTypes?.includes("Article") &&
    structuredData.article
  ) {
    if (Array.isArray(structuredData.article)) {
      structuredData.article.forEach((article) => {
        if (article?.headline) {
          scripts.push(JSON.stringify(generateArticleScript(article), null, 2));
        }
      });
    } else if (structuredData.article.headline) {
      scripts.push(
        JSON.stringify(generateArticleScript(structuredData.article), null, 2)
      );
    }
  }

  // FAQ
  if (
    structuredData.enabledTypes?.includes("FAQ") &&
    structuredData.faq?.questions?.length
  ) {
    const faqScript = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: structuredData.faq.questions
        .filter((q) => q.question && q.answer)
        .map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: q.answer,
          },
        })),
    };
    scripts.push(JSON.stringify(faqScript, null, 2));
  }

  // Helper function to generate Product JSON-LD
  const generateProductScript = (product: any): any => {
    const productScript: any = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      ...(product.description && { description: product.description }),
      ...(product.image && { image: product.image }),
      ...(product.brand && {
        brand: { "@type": "Brand", name: product.brand },
      }),
      ...(product.sku && { sku: product.sku }),
      ...(product.gtin && { gtin: product.gtin }),
      ...(product.mpn && { mpn: product.mpn }),
    };
    if (product.offersPrice) {
      productScript.offers = {
        "@type": "Offer",
        price: product.offersPrice,
        priceCurrency: product.offersPriceCurrency || "USD",
        ...(product.offersAvailability && {
          availability: `https://schema.org/${product.offersAvailability}`,
        }),
        ...(product.offersUrl && { url: product.offersUrl }),
        ...(product.offersSellerName && {
          seller: {
            "@type": "Organization",
            name: product.offersSellerName,
          },
        }),
      };
    }
    if (product.aggregateRatingValue) {
      productScript.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.aggregateRatingValue,
        ...(product.aggregateRatingCount && {
          reviewCount: product.aggregateRatingCount,
        }),
      };
    }
    return productScript;
  };

  // Product - support single or array
  if (
    structuredData.enabledTypes?.includes("Product") &&
    structuredData.product
  ) {
    if (Array.isArray(structuredData.product)) {
      structuredData.product.forEach((product) => {
        if (product?.name) {
          scripts.push(JSON.stringify(generateProductScript(product), null, 2));
        }
      });
    } else if (structuredData.product.name) {
      scripts.push(
        JSON.stringify(generateProductScript(structuredData.product), null, 2)
      );
    }
  }

  // Helper function to generate Recipe JSON-LD
  const generateRecipeScript = (recipe: any): any => {
    const recipeScript: any = {
      "@context": "https://schema.org",
      "@type": "Recipe",
      name: recipe.name,
      ...(recipe.description && { description: recipe.description }),
      ...(recipe.image && { image: recipe.image }),
      ...(recipe.prepTime && { prepTime: recipe.prepTime }),
      ...(recipe.cookTime && { cookTime: recipe.cookTime }),
      ...(recipe.totalTime && { totalTime: recipe.totalTime }),
      ...(recipe.recipeYield && { recipeYield: recipe.recipeYield }),
      ...(recipe.recipeCategory && { recipeCategory: recipe.recipeCategory }),
      ...(recipe.recipeCuisine && { recipeCuisine: recipe.recipeCuisine }),
      ...(recipe.calories && {
        nutrition: {
          "@type": "NutritionInformation",
          calories: recipe.calories,
        },
      }),
    };
    if (recipe.ingredients) {
      recipeScript.recipeIngredient = recipe.ingredients
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean);
    }
    if (recipe.instructions) {
      recipeScript.recipeInstructions = recipe.instructions
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean)
        .map((instruction: string) => ({
          "@type": "HowToStep",
          text: instruction,
        }));
    }
    if (recipe.authorName) {
      recipeScript.author = {
        "@type": "Person",
        name: recipe.authorName,
      };
    }
    if (recipe.datePublished) {
      recipeScript.datePublished = recipe.datePublished;
    }
    if (recipe.aggregateRatingValue) {
      recipeScript.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: recipe.aggregateRatingValue,
        ...(recipe.aggregateRatingCount && {
          reviewCount: recipe.aggregateRatingCount,
        }),
      };
    }
    return recipeScript;
  };

  // Recipe - support single or array
  if (
    structuredData.enabledTypes?.includes("Recipe") &&
    structuredData.recipe
  ) {
    if (Array.isArray(structuredData.recipe)) {
      structuredData.recipe.forEach((recipe) => {
        if (recipe?.name) {
          scripts.push(JSON.stringify(generateRecipeScript(recipe), null, 2));
        }
      });
    } else if (structuredData.recipe.name) {
      scripts.push(
        JSON.stringify(generateRecipeScript(structuredData.recipe), null, 2)
      );
    }
  }

  // Helper function to generate Event JSON-LD
  const generateEventScript = (event: any): any => {
    const eventScript: any = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: event.name,
      ...(event.description && { description: event.description }),
      ...(event.image && { image: event.image }),
      ...(event.startDate && { startDate: event.startDate }),
      ...(event.endDate && { endDate: event.endDate }),
      ...(event.eventStatus && {
        eventStatus: `https://schema.org/${event.eventStatus}`,
      }),
      ...(event.eventAttendanceMode && {
        eventAttendanceMode: `https://schema.org/${event.eventAttendanceMode}`,
      }),
    };
    if (event.locationName || event.locationAddress) {
      eventScript.location = {
        "@type": "Place",
        ...(event.locationName && { name: event.locationName }),
        ...(event.locationAddress && {
          address: {
            "@type": "PostalAddress",
            streetAddress: event.locationAddress,
          },
        }),
      };
    }
    if (event.organizerName) {
      eventScript.organizer = {
        "@type": "Organization",
        name: event.organizerName,
        ...(event.organizerUrl && { url: event.organizerUrl }),
      };
    }
    return eventScript;
  };

  // Event - support single or array
  if (structuredData.enabledTypes?.includes("Event") && structuredData.event) {
    if (Array.isArray(structuredData.event)) {
      structuredData.event.forEach((event) => {
        if (event?.name) {
          scripts.push(JSON.stringify(generateEventScript(event), null, 2));
        }
      });
    } else if (structuredData.event.name) {
      scripts.push(
        JSON.stringify(generateEventScript(structuredData.event), null, 2)
      );
    }
  }

  // Helper function to generate Video JSON-LD
  const generateVideoScript = (video: any): any => {
    return {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      name: video.name,
      ...(video.description && { description: video.description }),
      ...(video.thumbnailUrl && { thumbnailUrl: video.thumbnailUrl }),
      ...(video.uploadDate && { uploadDate: video.uploadDate }),
      ...(video.duration && { duration: video.duration }),
      ...(video.contentUrl && { contentUrl: video.contentUrl }),
      ...(video.embedUrl && { embedUrl: video.embedUrl }),
    };
  };

  // Video - support single or array
  if (structuredData.enabledTypes?.includes("Video") && structuredData.video) {
    if (Array.isArray(structuredData.video)) {
      structuredData.video.forEach((video) => {
        if (video?.name) {
          scripts.push(JSON.stringify(generateVideoScript(video), null, 2));
        }
      });
    } else if (structuredData.video.name) {
      scripts.push(
        JSON.stringify(generateVideoScript(structuredData.video), null, 2)
      );
    }
  }

  // Local Business
  if (
    structuredData.enabledTypes?.includes("LocalBusiness") &&
    structuredData.localBusiness?.name
  ) {
    const localBusinessScript: any = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: structuredData.localBusiness.name,
      ...(structuredData.localBusiness.image && {
        image: structuredData.localBusiness.image,
      }),
      ...(structuredData.localBusiness.telephone && {
        telephone: structuredData.localBusiness.telephone,
      }),
      ...(structuredData.localBusiness.priceRange && {
        priceRange: structuredData.localBusiness.priceRange,
      }),
      ...(structuredData.localBusiness.openingHours && {
        openingHours: structuredData.localBusiness.openingHours,
      }),
    };
    if (
      structuredData.localBusiness.addressStreet ||
      structuredData.localBusiness.addressLocality ||
      structuredData.localBusiness.addressRegion ||
      structuredData.localBusiness.addressPostalCode ||
      structuredData.localBusiness.addressCountry
    ) {
      localBusinessScript.address = {
        "@type": "PostalAddress",
        ...(structuredData.localBusiness.addressStreet && {
          streetAddress: structuredData.localBusiness.addressStreet,
        }),
        ...(structuredData.localBusiness.addressLocality && {
          addressLocality: structuredData.localBusiness.addressLocality,
        }),
        ...(structuredData.localBusiness.addressRegion && {
          addressRegion: structuredData.localBusiness.addressRegion,
        }),
        ...(structuredData.localBusiness.addressPostalCode && {
          postalCode: structuredData.localBusiness.addressPostalCode,
        }),
        ...(structuredData.localBusiness.addressCountry && {
          addressCountry: structuredData.localBusiness.addressCountry,
        }),
      };
    }
    if (
      structuredData.localBusiness.geoLatitude &&
      structuredData.localBusiness.geoLongitude
    ) {
      localBusinessScript.geo = {
        "@type": "GeoCoordinates",
        latitude: structuredData.localBusiness.geoLatitude,
        longitude: structuredData.localBusiness.geoLongitude,
      };
    }
    scripts.push(JSON.stringify(localBusinessScript, null, 2));
  }

  // Helper function to generate JobPosting JSON-LD
  const generateJobPostingScript = (job: any): any => {
    const jobScript: any = {
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: job.title,
      ...(job.description && { description: job.description }),
      ...(job.datePosted && { datePosted: job.datePosted }),
      ...(job.validThrough && { validThrough: job.validThrough }),
      ...(job.employmentType && { employmentType: job.employmentType }),
    };
    if (job.hiringOrganization) {
      jobScript.hiringOrganization = {
        "@type": "Organization",
        name: job.hiringOrganization,
        ...(job.hiringOrganizationLogo && {
          logo: job.hiringOrganizationLogo,
        }),
      };
    }
    if (job.jobLocationName || job.jobLocationAddress) {
      jobScript.jobLocation = {
        "@type": "Place",
        ...(job.jobLocationName && { name: job.jobLocationName }),
        ...(job.jobLocationAddress && {
          address: {
            "@type": "PostalAddress",
            streetAddress: job.jobLocationAddress,
          },
        }),
      };
    }
    if (job.baseSalaryValue) {
      jobScript.baseSalary = {
        "@type": "MonetaryAmount",
        currency: job.baseSalaryCurrency || "USD",
        value: {
          "@type": "QuantitativeValue",
          value: job.baseSalaryValue,
          unitText: job.baseSalaryUnit || "YEAR",
        },
      };
    }
    return jobScript;
  };

  // Job Posting - support single or array
  if (
    structuredData.enabledTypes?.includes("JobPosting") &&
    structuredData.jobPosting
  ) {
    if (Array.isArray(structuredData.jobPosting)) {
      structuredData.jobPosting.forEach((job) => {
        if (job?.title) {
          scripts.push(JSON.stringify(generateJobPostingScript(job), null, 2));
        }
      });
    } else if (structuredData.jobPosting.title) {
      scripts.push(
        JSON.stringify(
          generateJobPostingScript(structuredData.jobPosting),
          null,
          2
        )
      );
    }
  }

  // Book
  if (structuredData.enabledTypes?.includes("Book") && structuredData.book) {
    const book = getFirstItem(structuredData.book);
    if (book?.name) {
      const bookScript: any = {
        "@context": "https://schema.org",
        "@type": "Book",
        name: book.name,
        ...(book.author && {
          author: { "@type": "Person", name: book.author },
        }),
        ...(book.bookFormat && { bookFormat: book.bookFormat }),
        ...(book.isbn && { isbn: book.isbn }),
        ...(book.image && { image: book.image }),
        ...(book.description && { description: book.description }),
      };
      scripts.push(JSON.stringify(bookScript, null, 2));
    }
  }

  // Breadcrumb
  if (
    structuredData.enabledTypes?.includes("Breadcrumb") &&
    structuredData.breadcrumb?.items?.length
  ) {
    const breadcrumbScript = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: structuredData.breadcrumb.items
        .filter((item) => item.name && item.url)
        .map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
    };
    scripts.push(JSON.stringify(breadcrumbScript, null, 2));
  }

  // Course
  if (
    structuredData.enabledTypes?.includes("Course") &&
    structuredData.course
  ) {
    const course = getFirstItem(structuredData.course);
    if (course?.name) {
      const courseScript: any = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.name,
        ...(course.description && { description: course.description }),
        ...(course.provider && {
          provider: {
            "@type": "Organization",
            name: course.provider,
            ...(course.providerUrl && { url: course.providerUrl }),
          },
        }),
        ...(course.courseCode && { courseCode: course.courseCode }),
      };
      scripts.push(JSON.stringify(courseScript, null, 2));
    }
  }

  // Review
  if (
    structuredData.enabledTypes?.includes("Review") &&
    structuredData.review
  ) {
    const review = getFirstItem(structuredData.review);
    if (review?.itemReviewedName) {
      const reviewScript: any = {
        "@context": "https://schema.org",
        "@type": "Review",
        ...(review.itemReviewedType && {
          itemReviewed: {
            "@type": review.itemReviewedType,
            name: review.itemReviewedName,
          },
        }),
        ...(review.reviewRatingValue && {
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.reviewRatingValue,
            ...(review.reviewRatingBestRating && {
              bestRating: review.reviewRatingBestRating,
            }),
            ...(review.reviewRatingWorstRating && {
              worstRating: review.reviewRatingWorstRating,
            }),
          },
        }),
        ...(review.reviewAuthorName && {
          author: {
            "@type": "Person",
            name: review.reviewAuthorName,
          },
        }),
        ...(review.reviewDate && { datePublished: review.reviewDate }),
        ...(review.reviewBody && { reviewBody: review.reviewBody }),
      };
      scripts.push(JSON.stringify(reviewScript, null, 2));
    }
  }

  // Software App
  if (
    structuredData.enabledTypes?.includes("SoftwareApp") &&
    structuredData.softwareApp
  ) {
    const app = getFirstItem(structuredData.softwareApp);
    if (app?.name) {
      const appScript: any = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: app.name,
        ...(app.operatingSystem && { operatingSystem: app.operatingSystem }),
        ...(app.applicationCategory && {
          applicationCategory: app.applicationCategory,
        }),
        ...(app.description && { description: app.description }),
      };
      if (app.offersPrice) {
        appScript.offers = {
          "@type": "Offer",
          price: app.offersPrice,
          priceCurrency: app.offersPriceCurrency || "USD",
        };
      }
      if (app.aggregateRatingValue) {
        appScript.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: app.aggregateRatingValue,
          ...(app.aggregateRatingCount && {
            reviewCount: app.aggregateRatingCount,
          }),
        };
      }
      scripts.push(JSON.stringify(appScript, null, 2));
    }
  }

  // Q&A Page
  if (
    structuredData.enabledTypes?.includes("QAPage") &&
    structuredData.qaPage?.questions?.length
  ) {
    const qaScript = {
      "@context": "https://schema.org",
      "@type": "QAPage",
      mainEntity: {
        "@type": "Question",
        name: structuredData.qaPage.questions[0]?.questionText || "",
        ...(structuredData.qaPage.questions[0]?.acceptedAnswerText && {
          acceptedAnswer: {
            "@type": "Answer",
            text: structuredData.qaPage.questions[0].acceptedAnswerText,
            ...(structuredData.qaPage.questions[0]?.authorName && {
              author: {
                "@type": "Person",
                name: structuredData.qaPage.questions[0].authorName,
              },
            }),
            ...(structuredData.qaPage.questions[0]?.dateCreated && {
              dateCreated: structuredData.qaPage.questions[0].dateCreated,
            }),
          },
        }),
      },
    };
    scripts.push(JSON.stringify(qaScript, null, 2));
  }

  // Profile Page
  if (
    structuredData.enabledTypes?.includes("ProfilePage") &&
    structuredData.profilePage
  ) {
    const profile = getFirstItem(structuredData.profilePage);
    if (profile?.name) {
      const profileScript: any = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        mainEntity: {
          "@type": "Person",
          name: profile.name,
          ...(profile.image && { image: profile.image }),
          ...(profile.description && { description: profile.description }),
          ...(profile.url && { url: profile.url }),
          ...(profile.sameAs && {
            sameAs: profile.sameAs
              .split(",")
              .map((s: string) => s.trim())
              .filter(Boolean),
          }),
        },
      };
      scripts.push(JSON.stringify(profileScript, null, 2));
    }
  }

  // Generate script tags - each script is a separate JSON-LD block
  return scripts
    .map(
      (script) => `<script type="application/ld+json">\n${script}\n</script>`
    )
    .join("\n\n");
}
