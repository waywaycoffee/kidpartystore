# Vercel部署配置完整指南

## 🎯 快速开始

### 第1步：注册Vercel账号
1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 使用GitHub账号登录（推荐）

### 第2步：创建Vercel KV数据库
1. 登录Vercel Dashboard
2. 进入你的项目（或创建新项目）
3. 点击 **Storage** 标签
4. 点击 **Create Database**
5. 选择 **KV** (Redis)
6. 输入数据库名称（如：`qiaonai-kv`）
7. 选择区域（推荐：`us-east-1`）
8. 点击 **Create**
9. 创建完成后，Vercel会自动添加环境变量：
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `KV_REST_API_READ_ONLY_TOKEN`

### 第3步：导入项目
1. 在Vercel Dashboard点击 **Add New Project**
2. 选择你的GitHub仓库
3. 点击 **Import**

### 第4步：配置项目
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）
- **Install Command**: `npm install`（默认）

### 第5步：配置环境变量
在 **Environment Variables** 部分，添加以下变量：

#### 必需变量：
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-generated-secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

#### KV变量（自动添加，无需手动配置）：
```env
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

#### 可选变量：
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

**注意**：确保为每个环境（Production, Preview, Development）都添加变量。

### 第6步：部署
1. 点击 **Deploy**
2. 等待2-5分钟
3. 部署完成后，你会获得一个URL（如：`yourproject.vercel.app`）

---

## 🔧 生成NEXTAUTH_SECRET

在本地运行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

或使用OpenSSL：
```bash
openssl rand -base64 32
```

复制生成的密钥，添加到Vercel环境变量中。

---

## 📋 环境变量完整列表

参考 `.env.vercel.example` 文件，包含所有需要的环境变量。

---

## ✅ 部署后检查

### 1. 检查网站
- [ ] 访问部署URL，网站可以正常打开
- [ ] 首页显示正常
- [ ] 产品列表可以访问

### 2. 检查功能
- [ ] 管理后台可以登录（`/admin/login`）
- [ ] 产品管理功能正常
- [ ] 订单创建功能正常
- [ ] 支付功能测试通过

### 3. 检查存储
- [ ] 创建产品后，数据可以保存
- [ ] 创建订单后，数据可以保存
- [ ] 数据可以正常读取

---

## 🐛 常见问题

### Q: 部署失败？
**A**: 检查构建日志，常见原因：
- 环境变量未配置
- 代码错误
- 依赖安装失败

### Q: 数据无法保存？
**A**: 检查：
- KV数据库是否已创建
- KV环境变量是否正确配置
- 存储适配器是否正确使用

### Q: 环境变量不生效？
**A**: 确保：
- 环境变量已添加到正确的环境（Production/Preview/Development）
- 变量名拼写正确
- 重新部署项目

### Q: 如何回滚？
**A**: 在Vercel Dashboard：
1. 进入项目
2. 点击 **Deployments**
3. 找到之前的部署
4. 点击 **...** → **Promote to Production**

---

## 🔄 数据迁移

### 从本地文件系统迁移到Vercel KV

如果你已经有本地数据文件（`data/*.json`），需要迁移到Vercel KV：

1. **导出本地数据**：
   - 复制 `data/` 目录下的所有JSON文件

2. **创建迁移脚本**（可选）：
   ```typescript
   // scripts/migrate-to-kv.ts
   import { saveData } from '@/lib/storage-adapter';
   import fs from 'fs';
   import path from 'path';

   const dataDir = path.join(process.cwd(), 'data');
   const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

   for (const file of files) {
     const data = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
     await saveData(file, data);
     console.log(`Migrated ${file}`);
   }
   ```

3. **或手动迁移**：
   - 在管理后台重新创建数据
   - 或使用导入功能

---

## 📊 监控和维护

### 查看日志
1. 在Vercel Dashboard进入项目
2. 点击 **Deployments**
3. 选择部署，查看 **Logs**

### 查看存储使用
1. 进入 **Storage**
2. 查看KV数据库使用情况
3. 免费套餐：256MB

### 性能监控
- Vercel自动提供性能分析
- 在Dashboard查看 **Analytics**

---

## 🚀 下一步

1. ✅ 配置自定义域名
2. ✅ 设置SSL证书（自动）
3. ✅ 配置CDN（自动）
4. ✅ 设置备份策略

---

## 📝 总结

**部署步骤**：
1. 注册Vercel账号
2. 创建KV数据库
3. 导入GitHub仓库
4. 配置环境变量
5. 部署

**预计时间**：10-15分钟

**成本**：$0/月（免费套餐）

---

**现在就开始部署吧！** 🎉


