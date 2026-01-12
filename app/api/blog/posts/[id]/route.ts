/**
 * Single Blog Post API
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const posts = await getPosts();
    const post = posts.find((p: any) => p.id === params.id || p.slug === params.id);

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const posts = await getPosts();
    const index = posts.findIndex((p: any) => p.id === params.id);

    if (index === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    posts[index] = {
      ...posts[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    await savePosts(posts);

    return NextResponse.json({ post: posts[index] });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const posts = await getPosts();
    const filtered = posts.filter((p: any) => p.id !== params.id);

    if (filtered.length === posts.length) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    await savePosts(filtered);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

