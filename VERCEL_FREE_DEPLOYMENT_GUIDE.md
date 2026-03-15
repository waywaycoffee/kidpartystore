# Vercel免费套餐部署完整指引

## 📋 目录

1. [准备工作](#准备工作)
2. [注册Vercel账号](#注册vercel账号)
3. [创建KV数据库](#创建kv数据库)
4. [导入GitHub项目](#导入github项目)
5. [配置环境变量](#配置环境变量)
6. [部署项目](#部署项目)
7. [部署后检查](#部署后检查)
8. [常见问题](#常见问题)

---

## 📦 准备工作

### 1. 确保代码已推送到GitHub

```bash
# 检查Git状态
git status

# 如果还有未提交的更改
git add .
git commit -m "准备部署到Vercel"
git push origin main
```

### 2. 准备环境变量

准备以下信息：
- 你的域名（如果有，如：`yourdomain.com`）
- 管理员邮箱和密码
- Stripe密钥（如果使用支付）
- 其他服务API密钥

---

## 🚀 注册Vercel账号

### 步骤1: 访问Vercel官网

1. 打开浏览器，访问：**https://vercel.com**
2. 点击右上角的 **"Sign Up"** 或 **"登录"**

### 步骤2: 选择登录方式

**推荐使用GitHub登录**（最简单）：
1. 点击 **"Continue with GitHub"**
2. 授权Vercel访问你的GitHub账号
3. 完成注册

**或使用邮箱注册**：
1. 输入邮箱和密码
2. 验证邮箱
3. 完成注册

### 步骤3: 进入Dashboard

注册成功后，会自动进入Vercel Dashboard（控制台）

---

## 💾 创建KV数据库

### 步骤1: 进入Storage页面

1. 在Vercel Dashboard顶部，点击 **"Storage"** 标签
2. 或访问：https://vercel.com/dashboard/storage

### 步骤2: 创建KV数据库

1. 点击 **"Create Database"** 按钮
2. 选择 **"KV"**（Redis数据库）
3. 填写信息：
   - **Name**: 输入数据库名称（如：`qiaonai-kv`）
   - **Region**: 选择区域
     - 推荐：**`Washington, D.C. (iad1)`**（美国东部，速度较快）
     - 或选择离你最近的区域
4. 点击 **"Create"** 创建数据库

### 步骤3: 等待创建完成

- 创建过程需要10-30秒
- 创建完成后，会显示数据库信息
- **重要**：Vercel会自动为你的项目添加以下环境变量：
  - `KV_REST_API_URL`
  - `KV_REST_API_TOKEN`
  - `KV_REST_API_READ_ONLY_TOKEN`

### 步骤4: 记录数据库信息（可选）

你可以看到：
- Database URL
- REST API URL
- Token

**注意**：这些信息会自动添加到项目环境变量中，无需手动配置。

---

## 📥 导入GitHub项目

### 步骤1: 添加新项目

1. 在Vercel Dashboard，点击 **"Add New..."** 按钮
2. 选择 **"Project"**

### 步骤2: 连接GitHub仓库

1. 如果是第一次，需要连接GitHub：
   - 点击 **"Import Git Repository"**
   - 选择 **"Continue with GitHub"**
   - 授权Vercel访问你的GitHub仓库
   - 选择要授权的仓库（可以选择所有仓库或特定仓库）

2. 在仓库列表中，找到你的项目（如：`qiaonai`）
3. 点击 **"Import"** 按钮

### 步骤3: 配置项目

Vercel会自动检测项目类型，通常会自动配置：

- **Framework Preset**: `Next.js`（自动检测）
- **Root Directory**: `./`（默认，无需修改）
- **Build Command**: `npm run build`（默认）
- **Output Directory**: `.next`（默认）
- **Install Command**: `npm install`（默认）

**通常不需要修改这些设置**，直接使用默认值即可。

### 步骤4: 选择KV数据库（重要）

1. 在 **"Storage"** 部分，找到你刚才创建的KV数据库
2. 勾选该数据库
3. 这样Vercel会自动将KV环境变量添加到项目中

---

## ⚙️ 配置环境变量

### 步骤1: 进入环境变量设置

在项目配置页面，找到 **"Environment Variables"** 部分

### 步骤2: 添加必需环境变量

点击 **"Add"** 按钮，逐个添加以下变量：

#### 1. NEXTAUTH_URL
- **Key**: `NEXTAUTH_URL`
- **Value**: 
  - 如果有域名：`https://yourdomain.com`
  - 如果没有域名：先使用Vercel提供的域名（部署后获得，如：`https://yourproject.vercel.app`）
- **Environment**: 选择 **Production, Preview, Development**（全选）

#### 2. NEXTAUTH_SECRET
- **Key**: `NEXTAUTH_SECRET`
- **Value**: 生成随机密钥（见下方）
- **Environment**: 全选

**生成密钥方法**：

在本地终端运行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

或使用OpenSSL：
```bash
openssl rand -base64 32
```

复制生成的密钥，粘贴到Value中。

#### 3. ADMIN_EMAIL
- **Key**: `ADMIN_EMAIL`
- **Value**: 你的管理员邮箱（如：`admin@yourdomain.com`）
- **Environment**: 全选

#### 4. ADMIN_PASSWORD
- **Key**: `ADMIN_PASSWORD`
- **Value**: 你的管理员密码（建议使用强密码）
- **Environment**: 全选

### 步骤3: 添加可选环境变量

如果需要以下功能，继续添加：

#### Stripe支付（如果使用）
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: `pk_live_...`
- `STRIPE_SECRET_KEY`: `sk_live_...`
- `STRIPE_WEBHOOK_SECRET`: `whsec_...`

#### 邮件服务（如果使用）
- `SENDGRID_API_KEY`: `SG.xxx`
- `SENDGRID_FROM_EMAIL`: `noreply@yourdomain.com`

#### AI功能（如果使用）
- `OPENAI_API_KEY`: `sk-...`

#### 图片存储（如果使用Cloudinary）
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: `your-cloud-name`
- `CLOUDINARY_API_KEY`: `your-api-key`
- `CLOUDINARY_API_SECRET`: `your-api-secret`

### 步骤4: 确认KV变量（自动添加）

检查环境变量列表，应该能看到：
- `KV_REST_API_URL`（自动添加）
- `KV_REST_API_TOKEN`（自动添加）
- `KV_REST_API_READ_ONLY_TOKEN`（自动添加）

**如果看不到**，回到Storage页面，确保已选择KV数据库。

### 步骤5: 保存配置

1. 检查所有环境变量
2. 确保每个变量都选择了正确的环境（Production/Preview/Development）
3. 点击 **"Deploy"** 按钮

---

## 🚀 部署项目

### 步骤1: 开始部署

点击 **"Deploy"** 按钮后，Vercel会：
1. 克隆你的GitHub仓库
2. 安装依赖（`npm install`）
3. 构建项目（`npm run build`）
4. 部署到全球CDN

### 步骤2: 查看部署进度

部署过程中，你可以看到：
- **Building...** - 正在构建
- **Deploying...** - 正在部署
- **Ready** - 部署完成

**预计时间**：2-5分钟

### 步骤3: 部署完成

部署完成后，你会看到：
- ✅ **Success** 状态
- 项目URL（如：`https://yourproject.vercel.app`）
- 部署详情

### 步骤4: 访问网站

1. 点击项目URL，访问你的网站
2. 检查网站是否正常显示

---

## ✅ 部署后检查

### 1. 基础功能检查

- [ ] 首页可以正常打开
- [ ] 产品列表可以访问
- [ ] 页面样式正常显示
- [ ] 没有错误提示

### 2. 管理后台检查

- [ ] 访问 `/admin/login`
- [ ] 使用配置的管理员邮箱和密码登录
- [ ] 登录成功，进入管理后台

### 3. 核心功能检查

- [ ] 创建产品功能正常
- [ ] 产品数据可以保存
- [ ] 订单创建功能正常
- [ ] 订单数据可以保存

### 4. 支付功能检查（如果配置）

- [ ] 支付流程可以正常进行
- [ ] 测试支付成功
- [ ] 订单状态正确更新

### 5. 数据存储检查

- [ ] 创建的数据可以保存
- [ ] 保存的数据可以读取
- [ ] 数据持久化正常

---

## 🔧 更新NEXTAUTH_URL（如果使用自定义域名）

### 步骤1: 添加自定义域名

1. 在项目设置中，进入 **"Domains"** 标签
2. 输入你的域名（如：`yourdomain.com`）
3. 按照提示配置DNS记录

### 步骤2: 更新环境变量

1. 进入 **"Environment Variables"**
2. 找到 `NEXTAUTH_URL`
3. 更新为你的自定义域名：`https://yourdomain.com`
4. 保存

### 步骤3: 重新部署

1. 进入 **"Deployments"** 标签
2. 找到最新的部署
3. 点击 **"Redeploy"**

---

## 🐛 常见问题

### Q1: 部署失败，显示构建错误？

**A**: 检查以下几点：
1. **查看构建日志**：
   - 进入项目 → Deployments → 点击失败的部署 → 查看Logs
   - 找到错误信息

2. **常见原因**：
   - 环境变量未配置
   - 代码有语法错误
   - 依赖安装失败

3. **解决方法**：
   - 检查并配置所有必需的环境变量
   - 在本地运行 `npm run build` 测试
   - 修复代码错误后重新部署

---

### Q2: 网站可以打开，但管理后台无法登录？

**A**: 检查：
1. **环境变量**：
   - `NEXTAUTH_URL` 是否正确配置
   - `NEXTAUTH_SECRET` 是否已生成并配置
   - `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 是否正确

2. **重新部署**：
   - 更新环境变量后，需要重新部署
   - 进入Deployments → 点击最新部署 → Redeploy

---

### Q3: 数据无法保存？

**A**: 检查：
1. **KV数据库**：
   - 确认KV数据库已创建
   - 确认在项目配置中选择了KV数据库
   - 检查KV环境变量是否存在

2. **查看日志**：
   - 进入项目 → Deployments → 查看Logs
   - 查找错误信息

3. **测试存储**：
   - 在管理后台创建产品
   - 检查是否保存成功

---

### Q4: 如何查看部署日志？

**A**: 
1. 进入项目
2. 点击 **"Deployments"** 标签
3. 选择要查看的部署
4. 点击 **"View Function Logs"** 或查看 **"Logs"** 部分

---

### Q5: 如何回滚到之前的版本？

**A**:
1. 进入项目 → **"Deployments"**
2. 找到之前的成功部署
3. 点击部署右侧的 **"..."** 菜单
4. 选择 **"Promote to Production"**

---

### Q6: 免费套餐有什么限制？

**A**: Vercel免费套餐限制：
- **带宽**: 100GB/月
- **函数执行时间**: 10秒
- **存储**: KV免费256MB
- **请求**: 无限

**通常足够初期使用**，如果超出限制，可以升级到Pro套餐（$20/月）。

---

### Q7: 如何更新代码？

**A**: 
1. 在本地修改代码
2. 提交到GitHub：
   ```bash
   git add .
   git commit -m "更新说明"
   git push origin main
   ```
3. Vercel会自动检测并部署新版本
4. 等待2-5分钟，部署完成

---

### Q8: 如何配置自定义域名？

**A**:
1. 在项目设置 → **"Domains"**
2. 输入你的域名
3. 按照提示配置DNS：
   - 添加A记录：`@` → `76.76.21.21`
   - 添加CNAME记录：`www` → `cname.vercel-dns.com`
4. 等待DNS生效（通常几分钟到几小时）
5. Vercel会自动配置SSL证书

---

## 📊 免费套餐资源监控

### 查看使用情况

1. 进入项目 → **"Analytics"**
2. 查看：
   - 带宽使用量
   - 请求数量
   - 函数执行时间

### 查看存储使用

1. 进入 **"Storage"**
2. 查看KV数据库使用情况
3. 免费套餐：256MB

---

## 🎯 部署检查清单

### 部署前
- [ ] 代码已推送到GitHub
- [ ] 已注册Vercel账号
- [ ] 已创建KV数据库
- [ ] 已准备环境变量

### 部署中
- [ ] 已导入GitHub项目
- [ ] 已选择KV数据库
- [ ] 已配置所有环境变量
- [ ] 已点击Deploy

### 部署后
- [ ] 网站可以正常访问
- [ ] 管理后台可以登录
- [ ] 核心功能正常
- [ ] 数据可以保存

---

## 📚 相关文档

- **详细配置指南**: `VERCEL_SETUP_GUIDE.md`
- **环境变量清单**: `VERCEL_ENV_VARIABLES.md`
- **API迁移状态**: `API_MIGRATION_STATUS.md`
- **配置完成总结**: `VERCEL_CONFIGURATION_COMPLETE.md`

---

## 🎉 完成！

恭喜！你的网站已经部署到Vercel了！

**免费套餐包含**：
- ✅ 100GB带宽/月
- ✅ 无限请求
- ✅ 自动SSL
- ✅ 全球CDN
- ✅ 自动部署

**完全免费，无需信用卡！**

---

## 💡 需要帮助？

如果遇到问题：
1. 查看本文档的"常见问题"部分
2. 查看Vercel官方文档：https://vercel.com/docs
3. 查看项目日志：项目 → Deployments → Logs

---

**祝你部署顺利！** 🚀


