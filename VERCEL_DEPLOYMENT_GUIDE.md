# Vercel部署完整指南

## 🎯 为什么选择Vercel？

- ✅ **完全免费** - 初期零成本
- ✅ **专为Next.js** - 最佳性能和体验
- ✅ **零配置** - 5分钟即可上线
- ✅ **自动扩展** - 无需担心流量增长
- ✅ **全球CDN** - 访问速度快
- ✅ **自动SSL** - 安全有保障

---

## 📋 部署前准备

### 1. 代码准备
- ✅ 代码已推送到GitHub
- ✅ `.gitignore` 已配置（排除`.env.local`）
- ✅ 所有功能已测试

### 2. 环境变量准备
准备以下环境变量：
```env
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-password
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
OPENAI_API_KEY=sk-...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 3. 文件存储方案
⚠️ **重要**: Vercel是无服务器架构，文件系统是只读的

**解决方案**：
1. **Vercel Blob Storage**（推荐）
2. **Cloudinary**（图片）
3. **AWS S3**（文件）
4. **Vercel Postgres**（数据库）

---

## 🚀 部署步骤

### 方法1: 通过Vercel Dashboard（推荐）

#### 第1步：注册Vercel账号
1. 访问 https://vercel.com
2. 点击 "Sign Up"
3. 使用GitHub账号登录（推荐）

#### 第2步：导入项目
1. 点击 "Add New..." → "Project"
2. 选择你的GitHub仓库
3. 点击 "Import"

#### 第3步：配置项目
- **Framework Preset**: Next.js（自动检测）
- **Root Directory**: `./`（默认）
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）
- **Install Command**: `npm install`（默认）

#### 第4步：配置环境变量
在 "Environment Variables" 部分：
1. 添加所有环境变量
2. 选择环境（Production, Preview, Development）
3. 点击 "Save"

#### 第5步：部署
1. 点击 "Deploy"
2. 等待部署完成（约2-5分钟）
3. 获得部署URL（如：`yourproject.vercel.app`）

---

### 方法2: 通过Vercel CLI

#### 第1步：安装Vercel CLI
```bash
npm install -g vercel
```

#### 第2步：登录
```bash
vercel login
```

#### 第3步：部署
```bash
# 在项目根目录
vercel

# 生产环境部署
vercel --prod
```

---

## ⚙️ 配置说明

### 1. 项目配置（vercel.json）

创建 `vercel.json` 文件（可选）：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

### 2. 环境变量配置

在Vercel Dashboard中配置：
- **Production**: 生产环境变量
- **Preview**: 预览环境变量
- **Development**: 开发环境变量

### 3. 域名配置

#### 添加自定义域名：
1. 进入项目设置 → Domains
2. 输入你的域名
3. 按照提示配置DNS

#### DNS配置：
```
类型: A
名称: @
值: 76.76.21.21

类型: CNAME
名称: www
值: cname.vercel-dns.com
```

---

## 🔧 文件存储解决方案

### 方案1: Vercel Blob Storage（推荐）

#### 安装
```bash
npm install @vercel/blob
```

#### 使用
```typescript
import { put } from '@vercel/blob';

// 上传文件
const blob = await put('filename.txt', file, {
  access: 'public',
});
```

#### 成本
- $0.15/GB/月
- 适合小到中型项目

---

### 方案2: Cloudinary（图片）

#### 配置
```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

#### 成本
- 免费套餐：25GB存储，25GB带宽/月
- 适合图片存储

---

### 方案3: 迁移到数据库

#### Vercel Postgres
- 免费套餐：256MB存储
- Pro套餐：更多存储
- 适合数据量大时

---

## 📊 Vercel套餐对比

### Free套餐（推荐初期使用）
- ✅ **价格**: $0/月
- ✅ **带宽**: 100GB/月
- ✅ **函数执行**: 10秒
- ✅ **请求**: 无限
- ✅ **SSL**: 自动
- ✅ **CDN**: 全球

**适合**: 初期运营，月访问量 < 10万

### Pro套餐（业务增长后）
- 💰 **价格**: $20/月
- ✅ **带宽**: 1TB/月
- ✅ **函数执行**: 60秒
- ✅ **更多功能**: 团队协作、高级分析

**适合**: 业务增长，需要更多资源

---

## 🎯 推荐配置

### 初期配置（免费）
- **平台**: Vercel Free
- **存储**: Cloudinary免费套餐（图片）
- **数据**: JSON文件 → Vercel Blob Storage
- **成本**: $0/月

### 增长后配置
- **平台**: Vercel Pro ($20/月)
- **存储**: Vercel Blob Storage
- **数据库**: Vercel Postgres（如需要）
- **成本**: $20-50/月

---

## ✅ 部署检查清单

### 部署前：
- [ ] 代码已推送到GitHub
- [ ] 环境变量已准备
- [ ] 文件存储方案已确定
- [ ] `.gitignore` 已配置
- [ ] 所有功能已测试

### 部署后：
- [ ] 网站可以访问
- [ ] 环境变量已配置
- [ ] 支付功能测试通过
- [ ] 管理后台可以登录
- [ ] 图片上传功能正常
- [ ] API路由正常

---

## 🐛 常见问题

### Q: 文件写入失败？
**A**: Vercel文件系统是只读的，需要使用Vercel Blob Storage或外部存储

### Q: 环境变量不生效？
**A**: 检查Vercel Dashboard中的环境变量设置，确保已添加到正确环境

### Q: 部署失败？
**A**: 查看部署日志，检查构建错误

### Q: 如何回滚？
**A**: 在Vercel Dashboard中，选择之前的部署版本，点击"Promote to Production"

---

## 🚀 开始部署

1. **注册Vercel账号**: https://vercel.com
2. **连接GitHub仓库**
3. **配置环境变量**
4. **点击Deploy**
5. **完成！**

**预计时间**: 5-10分钟

---

**推荐立即使用Vercel部署！完全免费，专为Next.js优化！** 🎉

