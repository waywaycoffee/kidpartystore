# Kids Birthday Party Supplies E-commerce Platform

面向欧美市场的跨境儿童生日派对用品独立站，基于 Next.js + React + Tailwind CSS 构建。

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写配置：

```bash
cp .env.example .env.local
```

**必需配置：**
- `NEXTAUTH_SECRET` - 生成随机密钥：`openssl rand -base64 32`
- `ADMIN_EMAIL` - 管理员邮箱
- `ADMIN_PASSWORD` - 管理员密码

**可选配置：**
- `STRIPE_SECRET_KEY` - Stripe支付密钥（测试支付）
- `CLOUDINARY_*` - 图片上传服务（可选）

### 3. 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

### 4. 首次登录

访问：http://localhost:3000/admin/login

使用你在 `.env.local` 中配置的管理员账号登录。

---

## ✨ 核心功能

### 前端功能
- ✅ 首页（Hero Banner、主题轮播、年龄段入口、Featured Products）
- ✅ 产品列表和详情页
- ✅ 主题列表和详情页
- ✅ 分类页面
- ✅ 购物车功能
- ✅ 结算流程（3步：收货信息、配送方式、支付）
- ✅ 订单确认页
- ✅ 用户中心（订单管理、地址管理）
- ✅ 帮助中心（FAQ、政策）
- ✅ 博客系统
- ✅ 订单追踪页面

### 后端功能
- ✅ 产品管理API（CRUD）
- ✅ 订单管理API
- ✅ 主题API
- ✅ 分类API
- ✅ 购物车和优惠码API
- ✅ 结算API
- ✅ 地址管理API
- ✅ 帮助中心API
- ✅ 博客API
- ✅ 备份和恢复API
- ✅ 系统设置API
- ✅ 物流追踪API
- ✅ 数据导入/导出API
- ✅ 支付集成（Stripe）
- ✅ 身份验证（NextAuth.js）
- ✅ 图片上传API

### 管理后台
- ✅ 仪表板（统计数据、图表）
- ✅ 产品管理（列表、添加、编辑、删除、批量导入）
- ✅ 订单管理
- ✅ 图片管理
- ✅ 销售分析
- ✅ 备份管理
- ✅ 系统设置
- ✅ 身份验证保护

### SEO和CMS
- ✅ 动态metadata
- ✅ 结构化数据（JSON-LD）
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ RSS Feed
- ✅ 博客系统

### 安全功能
- ✅ Rate Limiting
- ✅ CSRF保护
- ✅ 输入验证和清理
- ✅ 安全日志
- ✅ 身份验证保护

---

## 📁 项目结构

```
├── app/                    # Next.js App Router 页面
│   ├── admin/             # 管理后台
│   ├── api/               # API 路由
│   ├── account/           # 用户中心
│   ├── cart/              # 购物车
│   ├── checkout/          # 结算流程
│   ├── products/          # 产品页面
│   ├── themes/            # 主题页面
│   └── ...
├── components/            # React 组件
├── lib/                   # 工具函数
├── store/                # Redux 状态管理
├── data/                 # 数据文件（JSON）
└── public/               # 静态资源
```

---

## 🔧 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Redux Toolkit
- **认证**: NextAuth.js
- **多语言**: i18next

### 后端
- **API**: Next.js API Routes
- **支付**: Stripe
- **存储**: File System (JSON) / 可迁移到数据库
- **加密**: bcryptjs

### 部署
- **平台**: Vercel（推荐）
- **数据库**: 当前使用JSON文件，可迁移到PostgreSQL/MongoDB

---

## 📚 文档

- `QUICK_START.md` - 快速开始指南
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `PRODUCT_CONFIGURATION_GUIDE.md` - 产品配置指南
- `TESTING_GUIDE.md` - 测试指南
- `PRE_LAUNCH_CHECKLIST.md` - 上线前检查清单
- `LAUNCH_READY_SUMMARY.md` - 上线准备总结

---

## 🎯 下一步

1. **配置环境变量** - 创建 `.env.local`
2. **测试登录** - 访问 `/admin/login`
3. **配置产品** - 使用批量导入或手动添加
4. **测试支付** - 使用Stripe测试卡
5. **部署上线** - 部署到Vercel

---

## 📝 环境变量说明

详细的环境变量配置请查看 `.env.example` 文件。

**必需变量：**
- `NEXTAUTH_SECRET` - NextAuth密钥
- `ADMIN_EMAIL` - 管理员邮箱
- `ADMIN_PASSWORD` - 管理员密码

**推荐变量：**
- `STRIPE_SECRET_KEY` - Stripe支付密钥
- `CLOUDINARY_*` - 图片上传配置

---

## 🐛 常见问题

### Q: 如何创建管理员账号？
A: 首次启动会自动创建，或访问 `/admin/login` 使用环境变量中的账号。

### Q: 如何配置产品？
A: 访问 `/admin/products` 添加产品，或使用批量导入功能。

### Q: 支付如何测试？
A: 使用Stripe测试卡号：4242 4242 4242 4242

### Q: 如何部署？
A: 查看 `DEPLOYMENT_GUIDE.md` 了解详细步骤。

---

## 📄 License

Private - All rights reserved

---

**准备好开始了吗？查看 `QUICK_START.md` 快速开始！**
