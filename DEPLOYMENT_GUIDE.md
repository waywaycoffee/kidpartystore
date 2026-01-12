# 部署上线完整指南

## 📋 目录

1. [环境变量配置](#环境变量配置)
2. [支付集成配置](#支付集成配置)
3. [身份验证配置](#身份验证配置)
4. [图片上传配置](#图片上传配置)
5. [Vercel部署](#vercel部署)
6. [域名和SSL配置](#域名和ssl配置)

---

## 🔧 环境变量配置

### 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```env
# 站点配置
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# Stripe 支付配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# NextAuth 配置
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-random-secret-key-here

# 图片上传配置（Cloudinary示例）
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# 邮件服务配置（SendGrid示例）
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# 数据库配置（可选，如果使用数据库）
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

### 生成 NEXTAUTH_SECRET

```bash
# 使用 OpenSSL 生成随机密钥
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## 💳 支付集成配置

### 1. Stripe 账号设置

#### 注册 Stripe 账号

1. 访问 https://stripe.com
2. 注册账号（测试模式）
3. 获取 API 密钥

#### 获取 API 密钥

1. 登录 Stripe Dashboard
2. 进入 **Developers** > **API keys**
3. 复制以下密钥：
   - **Publishable key** (pk*test*...)
   - **Secret key** (sk*test*...)

#### 配置 Webhook（生产环境）

1. 在 Stripe Dashboard 中创建 Webhook
2. 设置 Webhook URL: `https://yourdomain.com/api/webhooks/stripe`
3. 选择事件：
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
4. 复制 Webhook Secret (whsec\_...)

### 2. 测试支付

#### Stripe 测试卡号

```
卡号: 4242 4242 4242 4242
有效期: 任意未来日期
CVC: 任意3位数字
邮编: 任意5位数字
```

#### 测试场景

- ✅ 成功支付：使用 4242 4242 4242 4242
- ❌ 支付失败：使用 4000 0000 0000 0002
- ❌ 需要3D验证：使用 4000 0025 0000 3155

---

## 🔐 身份验证配置

### 1. NextAuth.js 设置

#### 安装依赖

```bash
npm install next-auth
```

#### 配置提供者

支持以下登录方式：

- **Email/Password** - 邮箱密码登录
- **Google** - Google账号登录（可选）
- **GitHub** - GitHub账号登录（可选）

### 2. 管理员账号设置

#### 创建第一个管理员

1. 访问 `/admin/login`
2. 使用邮箱注册
3. 系统会自动设置为管理员（第一个用户）

#### 手动创建管理员

在 `data/users.json` 中添加：

```json
[
  {
    "id": "admin-1",
    "email": "admin@yourdomain.com",
    "password": "$2a$10$hashedpassword",
    "role": "admin",
    "name": "Admin User",
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

---

## 📸 图片上传配置

### 选项1: Cloudinary（推荐）

#### 注册 Cloudinary

1. 访问 https://cloudinary.com
2. 注册免费账号
3. 获取 Cloud Name、API Key、API Secret

#### 配置环境变量

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 选项2: AWS S3

#### 设置 AWS S3

1. 创建 S3 Bucket
2. 配置 CORS
3. 创建 IAM 用户和访问密钥

#### 配置环境变量

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

### 选项3: 本地存储（开发环境）

开发环境可以使用本地存储，生产环境建议使用云存储。

---

## 🚀 Vercel 部署

### 1. 准备工作

#### 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 登录 Vercel

```bash
vercel login
```

### 2. 部署步骤

#### 方法1: 通过 Vercel Dashboard（推荐）

1. **连接 GitHub 仓库**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

2. **配置项目**
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **设置环境变量**
   - 在项目设置中添加所有环境变量
   - 参考上面的 `.env.local` 配置

4. **部署**
   - 点击 "Deploy"
   - 等待部署完成

#### 方法2: 通过 CLI

```bash
# 在项目根目录执行
vercel

# 生产环境部署
vercel --prod
```

### 3. 环境变量设置

在 Vercel Dashboard 中：

1. 进入项目设置
2. 点击 **Environment Variables**
3. 添加所有环境变量（参考 `.env.local`）

---

## 🌐 域名和 SSL 配置

### 1. 添加自定义域名

#### 在 Vercel 中添加域名

1. 进入项目设置
2. 点击 **Domains**
3. 输入你的域名
4. 按照提示配置 DNS

#### DNS 配置

添加以下 DNS 记录：

```
类型: A
名称: @
值: 76.76.21.21

类型: CNAME
名称: www
值: cname.vercel-dns.com
```

### 2. SSL 证书

Vercel 自动提供 SSL 证书，无需手动配置。

---

## 📧 邮件服务配置

### SendGrid 设置

#### 注册 SendGrid

1. 访问 https://sendgrid.com
2. 注册账号（免费套餐：100封/天）
3. 创建 API Key

#### 配置环境变量

```env
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

#### 验证发件人邮箱

1. 在 SendGrid Dashboard 中验证邮箱
2. 完成域名验证（生产环境）

---

## ✅ 部署前检查清单

### 代码检查

- [ ] 所有环境变量已配置
- [ ] `.env.local` 文件已创建（不提交到Git）
- [ ] `.gitignore` 包含 `.env.local`
- [ ] 代码已通过 lint 检查

### 功能检查

- [ ] 支付集成已测试
- [ ] 身份验证已测试
- [ ] 图片上传已测试
- [ ] 所有API路由正常

### 安全检查

- [ ] 管理后台已保护
- [ ] API密钥已设置
- [ ] 敏感信息不在代码中
- [ ] HTTPS已启用

### 性能检查

- [ ] 图片已优化
- [ ] 代码已压缩
- [ ] API响应时间正常
- [ ] 页面加载速度正常

---

## 🧪 部署后测试

### 1. 功能测试

- [ ] 首页加载正常
- [ ] 产品列表显示正常
- [ ] 购物车功能正常
- [ ] 支付流程正常
- [ ] 订单创建正常
- [ ] 管理后台可访问

### 2. 性能测试

- [ ] 页面加载时间 < 2秒
- [ ] API响应时间 < 500ms
- [ ] 图片加载正常
- [ ] 移动端显示正常

### 3. SEO测试

- [ ] 访问 `/sitemap.xml`
- [ ] 访问 `/robots.txt`
- [ ] 检查页面 metadata
- [ ] 检查结构化数据

---

## 🐛 常见问题

### Q: 部署后环境变量不生效？

A: 检查 Vercel Dashboard 中的环境变量设置，确保已添加到生产环境。

### Q: 支付测试失败？

A: 确保使用了正确的 Stripe 测试密钥，并检查 Webhook 配置。

### Q: 图片上传失败？

A: 检查图片存储服务的配置和权限设置。

### Q: 管理后台无法访问？

A: 检查身份验证配置和 NEXTAUTH_SECRET 是否正确设置。

---

## 📞 需要帮助？

如果遇到问题：

1. 查看 Vercel 部署日志
2. 检查浏览器控制台错误
3. 查看服务器日志
4. 参考 Next.js 官方文档

---

**准备好部署了吗？按照上面的步骤，你的网站将在1小时内上线！🚀**
