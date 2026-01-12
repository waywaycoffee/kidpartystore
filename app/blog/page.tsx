/**
 * Blog Listing Page
 * WordPress-like blog functionality
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_FILE = path.join(DATA_DIR, 'blog', 'posts.json');

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  categories: string[];
  tags: string[];
  featured?: boolean;
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    await fs.mkdir(path.join(DATA_DIR, 'blog'), { recursive: true });
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Party Ideas & Inspiration Blog | PartyExpert',
  description: 'Get party planning tips, theme ideas, and inspiration for your next celebration. Expert advice on kids birthday parties and decorations.',
  keywords: 'party ideas, birthday party inspiration, party planning tips, kids party themes',
  openGraph: {
    title: 'Party Ideas & Inspiration Blog | PartyExpert',
    description: 'Get party planning tips and inspiration for your next celebration',
    type: 'website',
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const featuredPost = posts.find((p) => p.featured);
  const regularPosts = posts.filter((p) => !p.featured).slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Party Ideas & Inspiration</h1>
          <p className="text-xl text-gray-600">
            Get expert tips, theme ideas, and inspiration for unforgettable celebrations
          </p>
        </div>

        {featuredPost && (
          <div className="mb-12">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="block bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="md:flex">
                {featuredPost.featuredImage && (
                  <div className="md:w-1/2">
                    <Image
                      src={featuredPost.featuredImage}
                      alt={featuredPost.title}
                      width={800}
                      height={400}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                )}
                <div className="md:w-1/2 p-8">
                  <div className="text-sm text-blue-600 font-semibold mb-2">Featured Post</div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{featuredPost.title}</h2>
                  <p className="text-gray-600 mb-4">{featuredPost.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span>{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span>{featuredPost.author}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {post.featuredImage && (
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  <span className="mx-2">•</span>
                  <span>{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

