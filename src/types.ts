// Rich Result Types supported by Google
export type RichResultType =
  | "Article"
  | "Book"
  | "Breadcrumb"
  | "Carousel"
  | "Course"
  | "Dataset"
  | "DiscussionForum"
  | "EducationQA"
  | "EmployerAggregateRating"
  | "Event"
  | "FAQ"
  | "ImageMetadata"
  | "JobPosting"
  | "LocalBusiness"
  | "MathSolver"
  | "Movie"
  | "Organization"
  | "PracticeProblem"
  | "Product"
  | "ProfilePage"
  | "QAPage"
  | "Recipe"
  | "Review"
  | "SoftwareApp"
  | "Speakable"
  | "SubscriptionPaywall"
  | "VacationRental"
  | "Video"
  | "Website";

// Structured Data Interfaces
export interface ArticleData {
  headline?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  publisherName?: string;
  publisherLogo?: string;
  description?: string;
}

export interface BookData {
  name?: string;
  author?: string;
  bookFormat?: string;
  isbn?: string;
  image?: string;
  description?: string;
}

export interface BreadcrumbData {
  items?: Array<{ name: string; url: string }>;
}

export interface CourseData {
  name?: string;
  description?: string;
  provider?: string;
  providerUrl?: string;
  courseCode?: string;
}

export interface EventData {
  name?: string;
  startDate?: string;
  endDate?: string;
  locationName?: string;
  locationAddress?: string;
  image?: string;
  description?: string;
  organizerName?: string;
  organizerUrl?: string;
  eventStatus?: string;
  eventAttendanceMode?: string;
}

export interface FAQData {
  questions?: Array<{ question: string; answer: string }>;
}

export interface JobPostingData {
  title?: string;
  description?: string;
  datePosted?: string;
  validThrough?: string;
  employmentType?: string;
  hiringOrganization?: string;
  hiringOrganizationLogo?: string;
  jobLocationName?: string;
  jobLocationAddress?: string;
  baseSalaryCurrency?: string;
  baseSalaryValue?: string;
  baseSalaryUnit?: string;
}

export interface LocalBusinessData {
  name?: string;
  image?: string;
  addressStreet?: string;
  addressLocality?: string;
  addressRegion?: string;
  addressPostalCode?: string;
  addressCountry?: string;
  telephone?: string;
  priceRange?: string;
  openingHours?: string;
  geoLatitude?: string;
  geoLongitude?: string;
}

export interface OrganizationData {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string;
  contactPointPhone?: string;
  contactPointContactType?: string;
  contactPointAreaServed?: string;
}

export interface ProductData {
  name?: string;
  image?: string;
  description?: string;
  brand?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  offersPrice?: string;
  offersPriceCurrency?: string;
  offersAvailability?: string;
  offersUrl?: string;
  offersSellerName?: string;
  aggregateRatingValue?: string;
  aggregateRatingCount?: string;
  reviewAuthor?: string;
  reviewDate?: string;
  reviewRatingValue?: string;
  reviewBody?: string;
}

export interface RecipeData {
  name?: string;
  image?: string;
  description?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string;
  recipeCategory?: string;
  recipeCuisine?: string;
  calories?: string;
  authorName?: string;
  datePublished?: string;
  ingredients?: string;
  instructions?: string;
  aggregateRatingValue?: string;
  aggregateRatingCount?: string;
}

export interface ReviewData {
  itemReviewedName?: string;
  itemReviewedType?: string;
  reviewRatingValue?: string;
  reviewRatingBestRating?: string;
  reviewRatingWorstRating?: string;
  reviewAuthorName?: string;
  reviewDate?: string;
  reviewBody?: string;
}

export interface VideoData {
  name?: string;
  description?: string;
  thumbnailUrl?: string;
  uploadDate?: string;
  duration?: string;
  contentUrl?: string;
  embedUrl?: string;
}

export interface SoftwareAppData {
  name?: string;
  operatingSystem?: string;
  applicationCategory?: string;
  offersPrice?: string;
  offersPriceCurrency?: string;
  aggregateRatingValue?: string;
  aggregateRatingCount?: string;
  description?: string;
}

export interface QAPageData {
  questions?: Array<{
    questionText?: string;
    acceptedAnswerText?: string;
    authorName?: string;
    dateCreated?: string;
  }>;
}

export interface ProfilePageData {
  name?: string;
  image?: string;
  description?: string;
  url?: string;
  sameAs?: string;
}

export interface WebsiteData {
  name?: string;
  url?: string;
  description?: string;
  potentialActionTarget?: string;
  potentialActionQueryInput?: string;
}

export interface StructuredDataConfig {
  enabledTypes?: RichResultType[];
  organization?: OrganizationData;
  website?: WebsiteData;
  article?: ArticleData | ArticleData[];
  book?: BookData | BookData[];
  breadcrumb?: BreadcrumbData;
  course?: CourseData | CourseData[];
  event?: EventData | EventData[];
  faq?: FAQData;
  jobPosting?: JobPostingData | JobPostingData[];
  localBusiness?: LocalBusinessData;
  product?: ProductData | ProductData[];
  recipe?: RecipeData | RecipeData[];
  review?: ReviewData | ReviewData[];
  video?: VideoData | VideoData[];
  softwareApp?: SoftwareAppData | SoftwareAppData[];
  qaPage?: QAPageData;
  profilePage?: ProfilePageData | ProfilePageData[];
}

export interface SEOConfig {
  id?: string;
  urlRegex?: string;
  metaTags?: {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    robots?: string;
    language?: string;
    geoRegion?: string;
    geoPlacename?: string;
    geoPosition?: string;
    themeColor?: string;
    favicon?: string;
  };
  openGraph?: {
    type?: string;
    url?: string;
    title?: string;
    description?: string;
    image?: string;
    imageWidth?: string;
    imageHeight?: string;
    siteName?: string;
    locale?: string;
  };
  twitterCard?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
  };
  structuredData?: StructuredDataConfig;
  additional?: {
    canonicalUrl?: string;
    robotsTxt?: string;
  };
}

// Output types
export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface LinkTag {
  rel: string;
  href: string;
}

export interface ScriptTag {
  type: string;
  children: string;
}

export interface MetaTagsOutput {
  title?: string;
  metaTags: MetaTag[];
  linkTags: LinkTag[];
  scriptTags: ScriptTag[];
}

