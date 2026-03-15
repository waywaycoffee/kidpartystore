/**
 * Storage Adapter
 * 存储适配器 - 支持文件系统和Vercel KV
 * 可以在Vercel和传统服务器之间无缝切换
 */

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// 检测是否在Vercel环境
const isVercel = process.env.VERCEL === '1' || !!process.env.KV_REST_API_URL;

// Vercel KV存储（如果可用）
let kv: any = null;
if (isVercel && process.env.KV_REST_API_URL) {
  try {
    const { kv: kvClient } = require('@vercel/kv');
    kv = kvClient;
  } catch (error) {
    console.warn('Vercel KV not available, falling back to file system');
  }
}

/**
 * 保存数据
 */
export async function saveData(key: string, data: any): Promise<void> {
  if (isVercel && kv) {
    // 使用Vercel KV
    await kv.set(key, JSON.stringify(data));
  } else {
    // 使用文件系统
    await ensureDataDir();
    const filePath = path.join(DATA_DIR, key);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  }
}

/**
 * 读取数据
 */
export async function getData<T = any>(key: string, defaultValue: T = [] as T): Promise<T> {
  if (isVercel && kv) {
    // 使用Vercel KV
    try {
      const value = await kv.get(key);
      return value ? JSON.parse(value as string) : defaultValue;
    } catch {
      return defaultValue;
    }
  } else {
    // 使用文件系统
    try {
      const filePath = path.join(DATA_DIR, key);
      await fs.access(filePath);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return defaultValue;
    }
  }
}

/**
 * 删除数据
 */
export async function deleteData(key: string): Promise<void> {
  if (isVercel && kv) {
    // 使用Vercel KV
    await kv.del(key);
  } else {
    // 使用文件系统
    try {
      const filePath = path.join(DATA_DIR, key);
      await fs.unlink(filePath);
    } catch {
      // File doesn't exist, ignore
    }
  }
}

/**
 * 确保数据目录存在
 */
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

/**
 * 列出所有数据文件
 */
export async function listDataFiles(): Promise<string[]> {
  if (isVercel && kv) {
    // Vercel KV doesn't support listing, return empty
    return [];
  } else {
    try {
      const files = await fs.readdir(DATA_DIR);
      return files.filter((f) => f.endsWith('.json'));
    } catch {
      return [];
    }
  }
}

