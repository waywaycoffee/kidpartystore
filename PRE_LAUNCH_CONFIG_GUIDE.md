# 🔧 上线前配置完成指南

## ✅ 已完成的配置

### 1. 环境变量配置脚本 ✅

已创建 `setup-env.js` 脚本，自动完成必需配置：

**运行方式**：

```bash
node setup-env.js
```

**功能**：

- ✅ 自动生成 NEXTAUTH_SECRET（32字节随机密钥）
- ✅ 创建 `.env.local` 文件
- ✅ 设置默认管理员账号
- ✅ 保留现有配置（如果已存在）

---

## 📋 配置步骤

### 步骤1：运行配置脚本（必需）

```bash
node setup-env.js
```

这将自动创建 `.env.local` 文件并生成必需的配置。

---

### 步骤2：检查配置（必需）

运行脚本后，检查 `.env.local` 文件：

**必需配置**（已自动生成）：

- ✅ `NEXTAUTH_URL` - 开发环境：http://localhost:3000
- ✅ `NEXTAUTH_SECRET` - 已自动生成随机密钥
- ✅ `ADMIN_EMAIL` - 默认：admin@example.com（建议修改）
- ✅ `ADMIN_PASSWORD` - 默认：admin123456（建议修改）

**建议修改**：

- ⚠️ 修改 `ADMIN_EMAIL` 为您的实际邮箱
- ⚠️ 修改 `ADMIN_PASSWORD` 为更安全的密码（至少8位）

---

### 步骤3：可选配置（推荐）

#### 3.1 配置 Stripe 支付（测试支付需要）

1. **注册 Stripe 账号**：
   - 访问：https://stripe.com
   - 注册账号（测试模式）

2. **获取 API 密钥**：
   - 登录 Stripe Dashboard
   - 进入 **Developers** > **API keys**
   - 复制以下密钥：
     - **Publishable key** (pk*test*...)
     - **Secret key** (sk*test*...)

3. **添加到 `.env.local`**：

   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

4. **测试支付**：
   - 使用测试卡号：4242 4242 4242 4242
   - 任意未来日期、任意CVC、任意邮编

---

#### 3.2 配置 Cloudinary 图片上传（生产环境推荐）

1. **注册 Cloudinary 账号**：
   - 访问：https://cloudinary.com
   - 注册免费账号（25GB存储/月）

2. **获取 API 凭证**：
   - 登录 Cloudinary Dashboard
   - 找到 **Cloud Name**（显示在顶部）
   - 进入 **Settings** > **Security**
   - 找到 **API Key** 和 **API Secret**

3. **添加到 `.env.local`**：
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**注意**：

- 开发环境可以不配置（使用本地存储）
- 生产环境强烈推荐配置

---

### 步骤4：验证配置（必需）

#### 4.1 检查必需配置

运行以下命令检查配置：

```bash
# Windows PowerShell
Get-Content .env.local | Select-String -Pattern "NEXTAUTH_SECRET|ADMIN_EMAIL|ADMIN_PASSWORD"

# Linux/Mac
grep -E "NEXTAUTH_SECRET|ADMIN_EMAIL|ADMIN_PASSWORD" .env.local
```

**确保**：

- ✅ `NEXTAUTH_SECRET` 不是默认值
- ✅ `ADMIN_EMAIL` 已设置
- ✅ `ADMIN_PASSWORD` 已设置

---

#### 4.2 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

---

#### 4.3 测试登录

1. 访问：http://localhost:3000/admin/login
2. 使用配置的账号登录：
   - Email: `ADMIN_EMAIL` 的值
   - Password: `ADMIN_PASSWORD` 的值

**注意**：首次启动会自动创建管理员账号。

---

## 📊 配置状态检查清单

### ✅ 必需配置（必须完成）

- [ ] 运行 `node setup-env.js` 生成配置
- [ ] 检查 `.env.local` 文件已创建
- [ ] 验证 `NEXTAUTH_SECRET` 已生成
- [ ] 修改 `ADMIN_EMAIL`（建议）
- [ ] 修改 `ADMIN_PASSWORD`（建议）
- [ ] 启动开发服务器测试
- [ ] 测试管理员登录

### ⚠️ 推荐配置（生产环境必需）

- [ ] 配置 Stripe 支付密钥（测试支付）
- [ ] 配置 Cloudinary 图片上传（生产环境）
- [ ] 设置 `NEXT_PUBLIC_SITE_URL`（生产环境）
- [ ] 配置 Google Search Console（SEO）

---

## 🔒 安全建议

### 1. 密码安全

**当前默认密码**：`admin123456`

**建议**：

- ✅ 使用至少12位密码
- ✅ 包含大小写字母、数字、特殊字符
- ✅ 不要使用常见密码

**示例安全密码**：

```
MySecure@Password2024!
```

---

### 2. 密钥安全

**NEXTAUTH_SECRET**：

- ✅ 已自动生成随机密钥
- ✅ 不要泄露给他人
- ✅ 不要提交到Git仓库（已在.gitignore中）

---

### 3. 环境变量安全

**检查清单**：

- ✅ `.env.local` 在 `.gitignore` 中
- ✅ 不要将密钥提交到Git
- ✅ 生产环境使用安全的密钥管理

---

## 🚀 快速配置命令

### 一键配置（推荐）

```bash
# 1. 运行配置脚本
node setup-env.js

# 2. 编辑配置文件（可选，修改管理员账号）
# 使用文本编辑器打开 .env.local

# 3. 启动开发服务器
npm run dev

# 4. 测试登录
# 访问 http://localhost:3000/admin/login
```

---

## 📝 配置文件示例

### 最小配置（开发环境）

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=AXKHMVSoO+1Nf57nCQAEbUv3sCm7wR62PuTqXAkwU28=
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123456
```

### 完整配置（生产环境）

```env
# 必需配置
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=AXKHMVSoO+1Nf57nCQAEbUv3sCm7wR62PuTqXAkwU28=
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=YourSecurePassword123!

# 站点配置
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# Stripe配置
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary配置
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🎯 配置完成后的下一步

### 1. 测试功能

- [ ] 测试管理员登录
- [ ] 测试产品管理
- [ ] 测试订单创建
- [ ] 测试支付流程（如果配置了Stripe）

### 2. 配置产品数据

- [ ] 访问 `/admin/products`
- [ ] 添加或导入产品
- [ ] 配置产品图片

### 3. 准备部署

- [ ] 查看 `DEPLOYMENT_GUIDE.md`
- [ ] 配置生产环境变量
- [ ] 部署到 Vercel 或其他平台

---

## ❓ 常见问题

### Q: 配置脚本运行失败？

**A**: 检查：

1. Node.js 是否已安装：`node --version`
2. 是否有写入权限
3. 是否在项目根目录运行

---

### Q: 如何重新生成配置？

**A**:

```bash
# 删除现有配置
rm .env.local  # Linux/Mac
del .env.local  # Windows

# 重新运行脚本
node setup-env.js
```

---

### Q: 忘记管理员密码？

**A**:

1. 删除 `data/users.json` 文件
2. 修改 `.env.local` 中的 `ADMIN_PASSWORD`
3. 重启服务器（会自动创建新账号）

---

### Q: 配置了但登录失败？

**A**: 检查：

1. `.env.local` 文件是否存在
2. `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 是否正确
3. 服务器是否已重启（修改环境变量后需要重启）

---

## 📚 相关文档

- `QUICK_START.md` - 快速开始指南
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `PRE_LAUNCH_CHECKLIST.md` - 上线前检查清单
- `TEST_PREPARATION_CHECKLIST.md` - 测试准备清单

---

**配置完成后，可以开始测试和部署了！** 🎉
