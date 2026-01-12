/**
 * Product Page Layout with SEO Metadata
 */

import { generateBreadcrumbStructuredData, generateProductMetadata, generateProductStructuredData } from '@/lib/seo';
import fs from 'fs/promises';
import type { Metadata } from 'next';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');

async function getProduct(id: string) {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    return products.find((p: { id: string }) => p.id === id);
  } catch {
    return null;
  }
}

export default async function ProductLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return <>{children}</>;
  }

  const productImages = (product as any).images && (product as any).images.length > 0
    ? (product as any).images
    : [product.image || '/placeholder.jpg'];

  const productData = {
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: productImages,
    category: product.category,
    theme: product.theme,
    inStock: product.stock > 0,
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    rating: (product as any).rating ? {
      value: (product as any).rating.average || 0,
      count: (product as any).rating.count || 0,
    } : undefined,
  };

  const productStructuredData = generateProductStructuredData(productData);
  const breadcrumbs = generateBreadcrumbStructuredData([
    { name: 'Home', url: '/' },
    { name: product.category || 'Products', url: product.category ? `/categories/${product.category}` : '/products' },
    { name: product.name, url: `/products/${product.id}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      {children}
    </>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = await getProduct(params.id);

  if (!product) {
    return {
      title: 'Product Not Found | PartyExpert',
    };
  }

  const productImages = (product as any).images && (product as any).images.length > 0
    ? (product as any).images
    : [product.image || '/placeholder.jpg'];

  // Use custom SEO data if available, otherwise generate from product data
  const seoData = (product as any).seo;
  if (seoData && seoData.metaTitle && seoData.metaDescription) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return {
      title: seoData.metaTitle,
      description: seoData.metaDescription,
      keywords: seoData.metaKeywords?.join(', '),
      openGraph: {
        title: seoData.ogTitle || seoData.metaTitle,
        description: seoData.ogDescription || seoData.metaDescription,
        images: seoData.ogImage ? [seoData.ogImage] : productImages.map((img: string) => 
          img.startsWith('http') ? img : `${siteUrl}${img}`
        ),
        type: 'product',
        url: `${siteUrl}/products/${product.id}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: seoData.ogTitle || seoData.metaTitle,
        description: seoData.ogDescription || seoData.metaDescription,
        images: seoData.ogImage ? [seoData.ogImage] : productImages.map((img: string) => 
          img.startsWith('http') ? img : `${siteUrl}${img}`
        ),
      },
      robots: {
        index: !seoData.noindex,
        follow: !seoData.nofollow,
      },
      alternates: {
        canonical: seoData.canonicalUrl || `${siteUrl}/products/${product.id}`,
      },
    };
  }

  return generateProductMetadata({
    id: product.id,
    name: product.name,
    description: product.description || '',
    price: product.price,
    image: productImages,
    category: product.category,
    theme: product.theme,
    inStock: product.stock > 0,
  });
}


