/**
 * SEO Utility Functions
 * Handles meta tags, structured data, and SEO optimization
 */

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

export interface StructuredData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}

/**
 * Generate meta tags for a page
 */
export function generateMetaTags(data: SEOData): Record<string, string> {
  const metaTags: Record<string, string> = {
    title: data.title,
    description: data.description,
  };

  if (data.keywords && data.keywords.length > 0) {
    metaTags.keywords = data.keywords.join(', ');
  }

  if (data.canonicalUrl) {
    metaTags.canonical = data.canonicalUrl;
  }

  // Open Graph tags
  metaTags['og:title'] = data.title;
  metaTags['og:description'] = data.description;
  metaTags['og:type'] = data.ogType || 'website';
  if (data.ogImage) {
    metaTags['og:image'] = data.ogImage;
  }
  if (data.canonicalUrl) {
    metaTags['og:url'] = data.canonicalUrl;
  }

  // Twitter Card tags
  metaTags['twitter:card'] = 'summary_large_image';
  metaTags['twitter:title'] = data.title;
  metaTags['twitter:description'] = data.description;
  if (data.ogImage) {
    metaTags['twitter:image'] = data.ogImage;
  }

  // Robots meta
  if (data.noindex || data.nofollow) {
    const robots = [];
    if (data.noindex) robots.push('noindex');
    if (data.nofollow) robots.push('nofollow');
    metaTags.robots = robots.join(', ');
  }

  return metaTags;
}

/**
 * Generate Product structured data (Schema.org)
 */
export function generateProductStructuredData(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  image: string | string[];
  availability?: string;
  brand?: string;
  sku?: string;
  rating?: {
    value: number;
    count: number;
  };
}): StructuredData {
  const images = Array.isArray(product.image) ? product.image : [product.image];
  
  const structuredData: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'USD',
      availability: product.availability || 'https://schema.org/InStock',
      url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/products/${product.id}`,
    },
  };

  if (product.brand) {
    structuredData.brand = {
      '@type': 'Brand',
      name: product.brand,
    };
  }

  if (product.sku) {
    structuredData.sku = product.sku;
  }

  if (product.rating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
    };
  }

  return structuredData;
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PartyExpert',
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@partyexpert.com',
    },
    sameAs: [
      // Add social media links here
    ],
  };
}

/**
 * Generate Website structured data
 */
export function generateWebsiteStructuredData(): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PartyExpert',
    url: process.env.NEXT_PUBLIC_SITE_URL || '',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate Breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article structured data (for blog posts)
 */
export function generateArticleStructuredData(article: {
  title: string;
  description: string;
  image?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  url: string;
}): StructuredData {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'PartyExpert',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

/**
 * Generate Product Metadata for Next.js
 */
export function generateProductMetadata(product: {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | string[];
  category?: string;
  theme?: string;
  inStock?: boolean;
}): {
  title: string;
  description: string;
  keywords?: string;
  openGraph?: {
    title: string;
    description: string;
    images: string[];
    type: string;
  };
  twitter?: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
} {
  const images = Array.isArray(product.image) ? product.image : [product.image];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  
  // Generate SEO-optimized title (include keywords naturally)
  const title = `${product.name} - ${product.theme ? `${product.theme} ` : ''}Party Supplies | PartyExpert`;
  
  // Generate SEO-optimized description (include pain points and solution)
  const description = product.description || 
    `Shop ${product.name} - Premium party supplies for kids. ${product.inStock ? 'In stock' : 'Check availability'}. Fast shipping worldwide.`;

  // Generate keywords from product data
  const keywords: string[] = [];
  if (product.name) keywords.push(...product.name.toLowerCase().split(/\s+/));
  if (product.category) keywords.push(product.category);
  if (product.theme) keywords.push(product.theme, `${product.theme} party`);
  keywords.push('party supplies', 'kids party', 'birthday party', 'party decorations');

  return {
    title,
    description: description.substring(0, 160), // Keep under 160 chars
    keywords: [...new Set(keywords)].join(', '),
    openGraph: {
      title,
      description: description.substring(0, 160),
      images: images.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`)),
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description.substring(0, 160),
      images: images.map((img) => (img.startsWith('http') ? img : `${siteUrl}${img}`)),
    },
  };
}

/**
 * Extract keywords from text
 */
export function extractKeywords(text: string, maxKeywords: number = 10): string[] {
  // Simple keyword extraction (can be enhanced with NLP)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3);

  const wordCount: Record<string, number> = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}
