/**
 * Backup API
 * WordPress UpdraftPlus equivalent functionality
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { createHash } from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'backups');

async function ensureBackupDir() {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

/**
 * Create a backup of all data files
 */
export async function POST(request: NextRequest) {
  try {
    await ensureBackupDir();

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupId = `backup-${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupId);

    await fs.mkdir(backupPath, { recursive: true });

    // List of data files to backup
    const dataFiles = [
      'products.json',
      'orders.json',
      'addresses.json',
      'coupons.json',
      'themes.json',
      'help/faq.json',
      'help/policies.json',
      'blog/posts.json',
    ];

    const backupManifest: {
      id: string;
      timestamp: string;
      files: Array<{ name: string; size: number; hash: string }>;
      totalSize: number;
    } = {
      id: backupId,
      timestamp: new Date().toISOString(),
      files: [],
      totalSize: 0,
    };

    // Copy each file
    for (const file of dataFiles) {
      const sourcePath = path.join(DATA_DIR, file);
      const targetPath = path.join(backupPath, file);

      try {
        // Check if file exists
        await fs.access(sourcePath);

        // Create directory structure if needed
        const targetDir = path.dirname(targetPath);
        await fs.mkdir(targetDir, { recursive: true });

        // Read and copy file
        const content = await fs.readFile(sourcePath, 'utf-8');
        await fs.writeFile(targetPath, content, 'utf-8');

        // Calculate file hash
        const hash = createHash('sha256').update(content).digest('hex');
        const stats = await fs.stat(sourcePath);

        backupManifest.files.push({
          name: file,
          size: stats.size,
          hash,
        });

        backupManifest.totalSize += stats.size;
      } catch (error) {
        // File doesn't exist, skip
        console.warn(`File not found: ${file}`);
      }
    }

    // Save manifest
    await fs.writeFile(
      path.join(backupPath, 'manifest.json'),
      JSON.stringify(backupManifest, null, 2),
      'utf-8'
    );

    return NextResponse.json({
      success: true,
      backup: {
        id: backupId,
        timestamp: backupManifest.timestamp,
        fileCount: backupManifest.files.length,
        totalSize: backupManifest.totalSize,
        path: backupPath,
      },
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

/**
 * List all backups
 */
export async function GET() {
  try {
    await ensureBackupDir();

    const entries = await fs.readdir(BACKUP_DIR, { withFileTypes: true });
    const backups = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const manifestPath = path.join(BACKUP_DIR, entry.name, 'manifest.json');
        try {
          const manifestContent = await fs.readFile(manifestPath, 'utf-8');
          const manifest = JSON.parse(manifestContent);
          backups.push({
            id: manifest.id,
            timestamp: manifest.timestamp,
            fileCount: manifest.files.length,
            totalSize: manifest.totalSize,
          });
        } catch {
          // Invalid backup, skip
        }
      }
    }

    // Sort by timestamp (newest first)
    backups.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json({ backups });
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ backups: [] }, { status: 200 });
  }
}

