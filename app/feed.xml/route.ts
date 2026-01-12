/**
 * RSS Feed Route
 * WordPress-like RSS feed functionality
 */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://partyexpert.com';
const SITE_NAME = 'PartyExpert';
const DATA_DIR = path.join(process.cwd(), 'data');
const BLOG_FILE = path.join(DATA_DIR, 'blog', 'posts.json');

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  categories: string[];
}

async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    await fs.mkdir(path.join(DATA_DIR, 'blog'), { recursive: true });
    const data = await fs.readFile(BLOG_FILE, 'utf-8');
    return JSON.parse(data).slice(0, 20); // Latest 20 posts
  } catch {
    return [];
  }
}

export async function GET() {
  const posts = await getBlogPosts();

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} Blog</title>
    <link>${SITE_URL}</link>
    <description>Party ideas, inspiration, and tips for unforgettable celebrations</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${post.author}</author>
      ${post.categories.map((cat) => `<category><![CDATA[${cat}]]></category>`).join('\n      ')}
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}

