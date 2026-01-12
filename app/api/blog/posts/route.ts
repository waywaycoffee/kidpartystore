/**
 * Blog Posts API
 * WordPress-like blog management
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_DIR = path.join(DATA_DIR, 'blog');
const POSTS_FILE = path.join(BLOG_DIR, 'posts.json');

async function ensureBlogDir() {
  try {
    await fs.access(BLOG_DIR);
  } catch {
    await fs.mkdir(BLOG_DIR, { recursive: true });
  }
}

async function getPosts() {
  try {
    await ensureBlogDir();
    const data = await fs.readFile(POSTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function savePosts(posts: any[]) {
  await ensureBlogDir();
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured') === 'true';
    const limit = searchParams.get('limit');

    let posts = await getPosts();

    if (category) {
      posts = posts.filter((p: any) => p.categories.includes(category));
    }

    if (tag) {
      posts = posts.filter((p: any) => p.tags.includes(tag));
    }

    if (featured) {
      posts = posts.filter((p: any) => p.featured);
    }

    // Sort by published date (newest first)
    posts.sort((a: any, b: any) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    if (limit) {
      posts = posts.slice(0, parseInt(limit));
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ posts: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      author,
      categories,
      tags,
      featured,
    } = body;

    if (!title || !slug || !content || !author) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, content, author' },
        { status: 400 }
      );
    }

    const posts = await getPosts();

    // Check if slug already exists
    if (posts.some((p: any) => p.slug === slug)) {
      return NextResponse.json(
        { error: 'Post with this slug already exists' },
        { status: 400 }
      );
    }

    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      title,
      slug,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content,
      featuredImage,
      author,
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      categories: categories || [],
      tags: tags || [],
      featured: featured || false,
    };

    posts.push(newPost);
    await savePosts(posts);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

