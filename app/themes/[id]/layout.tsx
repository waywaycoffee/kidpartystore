/**
 * Theme Page Layout with SEO Metadata
 */

import type { Metadata } from 'next';
import { generateThemeMetadata } from '@/lib/seo';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const THEMES_FILE = path.join(DATA_DIR, 'themes.json');

async function getTheme(id: string) {
  try {
    const data = await fs.readFile(THEMES_FILE, 'utf-8');
    const themes = JSON.parse(data);
    return themes.find((t: { id: string }) => t.id === id);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const theme = await getTheme(params.id);

  if (!theme) {
    return {
      title: 'Theme Not Found | PartyExpert',
    };
  }

  return generateThemeMetadata({
    id: theme.id,
    name: theme.name,
    nameEn: theme.nameEn,
    description: theme.description,
    descriptionEn: theme.descriptionEn,
    image: theme.image || theme.bannerImage || '/placeholder.jpg',
    ageRange: theme.ageRange,
    gender: theme.gender,
  });
}

export default function ThemeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

