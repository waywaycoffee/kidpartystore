# Vercel存储迁移指南

## ⚠️ 重要：Vercel文件系统限制

### 问题

Vercel是无服务器架构，文件系统是**只读的**（除了`/tmp`临时目录）。

**当前项目使用**: `fs.writeFile` 写入JSON文件
**Vercel不支持**: 文件系统写入操作

---

## 🔧 解决方案

### 方案1: Vercel Blob Storage（推荐）⭐

#### 安装

```bash
npm install @vercel/blob
```

#### 创建存储工具函数

创建 `lib/storage.ts`:

```typescript
import { put, get, del, list } from '@vercel/blob';

const BLOB_STORE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function saveToBlob(key: string, data: any) {
  const blob = await put(key, JSON.stringify(data), {
    access: 'public',
    token: BLOB_STORE_TOKEN,
  });
  return blob.url;
}

export async function getFromBlob(key: string) {
  const blob = await get(key, { token: BLOB_STORE_TOKEN });
  const text = await blob.text();
  return JSON.parse(text);
}

export async function deleteFromBlob(key: string) {
  await del(key, { token: BLOB_STORE_TOKEN });
}
```

#### 修改API路由

将 `fs.writeFile` 替换为 `saveToBlob`:

```typescript
// 之前
await fs.writeFile(FILE_PATH, JSON.stringify(data));

// 之后
await saveToBlob('data/products.json', data);
```

#### 成本

- $0.15/GB/月
- 初期几乎免费

---

### 方案2: Vercel KV（Redis）（推荐用于JSON数据）⭐

#### 安装

```bash
npm install @vercel/kv
```

#### 使用

```typescript
import { kv } from '@vercel/kv';

// 保存
await kv.set('products', JSON.stringify(products));

// 读取
const products = JSON.parse((await kv.get('products')) || '[]');
```

#### 成本

- 免费套餐：256MB
- Pro套餐：更多存储

---

### 方案3: Supabase（免费数据库）⭐

#### 优点

- ✅ 完全免费（500MB数据库）
- ✅ PostgreSQL数据库
- ✅ 自动备份
- ✅ 易于迁移

#### 安装

```bash
npm install @supabase/supabase-js
```

---

### 方案4: 继续使用Hostinger（如果必须）

如果必须使用文件系统写入，可以选择Hostinger VPS。

#### 推荐配置

- **套餐**: Business Web Hosting 或 VPS
- **配置**: 4GB RAM, 4 CPU, 80GB SSD
- **价格**: $4.99-9.99/月

#### 需要配置

- Node.js 18+
- PM2进程管理
- Nginx反向代理
- SSL证书（Let's Encrypt）

---

## 🎯 我的最终建议

### **推荐：Vercel + Vercel KV** ⭐⭐⭐⭐⭐

**理由**：

1. ✅ **完全免费** - KV免费256MB足够初期使用
2. ✅ **无缝集成** - Vercel官方服务
3. ✅ **易于迁移** - 只需修改存储函数
4. ✅ **性能优秀** - Redis缓存，速度快

**迁移步骤**：

1. 安装 `@vercel/kv`
2. 创建存储工具函数
3. 替换所有 `fs.writeFile` 为 `kv.set`
4. 替换所有 `fs.readFile` 为 `kv.get`

**成本**：$0/月（免费套餐）

---

## 📝 快速迁移方案

### 步骤1: 安装依赖

```bash
npm install @vercel/kv
```

### 步骤2: 创建存储适配器

创建 `lib/storage-adapter.ts`，统一处理存储操作。

### 步骤3: 替换API路由

批量替换所有文件操作。

---

## 💰 成本对比（最终）

| 方案                  | 初期成本 | 增长后成本 | 迁移难度            |
| --------------------- | -------- | ---------- | ------------------- |
| **Vercel + KV**       | $0/月    | $20/月     | ⭐⭐ 中等           |
| **Vercel + Blob**     | $0-5/月  | $20-50/月  | ⭐⭐ 中等           |
| **Vercel + Supabase** | $0/月    | $25/月     | ⭐⭐⭐ 较难         |
| **Hostinger VPS**     | $5-10/月 | $10-20/月  | ⭐ 简单（无需迁移） |

---

## ✅ 最终推荐

### **选择：Vercel + Vercel KV** 🎯

**原因**：

- ✅ 完全免费（初期）
- ✅ 无缝集成
- ✅ 性能优秀
- ✅ 易于迁移

**需要做的**：

1. 安装 `@vercel/kv`
2. 创建存储适配器
3. 替换文件操作（约2-3小时工作量）

**总成本**：$0/月（初期），$20/月（增长后）

---

**建议立即使用Vercel部署！** 🚀
