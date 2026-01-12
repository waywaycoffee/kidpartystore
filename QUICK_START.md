# 🚀 快速开始指南

## 第一步：安装依赖

```bash
npm install
```

## 第二步：配置环境变量

1. 复制环境变量示例文件：
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`，至少配置以下必需项：

```env
# 必需配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password

# Stripe配置（测试支付需要）
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### 生成 NEXTAUTH_SECRET

```bash
# Windows PowerShell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 或使用在线工具生成随机字符串
```

## 第三步：启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

## 第四步：首次登录

1. 访问管理后台：http://localhost:3000/admin/login
2. 使用你在 `.env.local` 中配置的账号登录：
   - Email: `admin@example.com`（或你设置的）
   - Password: `your-secure-password`（或你设置的）

**注意**：首次启动会自动创建管理员账号。

## 第五步：开始配置产品

1. 登录后访问：http://localhost:3000/admin/products
2. 点击"批量导入"或"添加产品"
3. 开始配置你的产品数据

---

## 📝 产品配置快速参考

### 单个产品添加
- 访问：`/admin/products/new`
- 填写产品信息
- 保存

### 批量导入
- 访问：`/admin/products/import`
- 下载CSV或JSON模板
- 填写产品信息
- 上传文件

### 产品字段说明
- **必填**：名称、价格、库存、分类、状态
- **推荐**：描述、图片、主题、属性

详细说明请查看：`PRODUCT_CONFIGURATION_GUIDE.md`

---

## 🔧 常见问题

### Q: 登录失败？
A: 检查 `.env.local` 中的 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD` 是否正确。

### Q: 支付测试失败？
A: 确保已配置 Stripe 测试密钥，并使用测试卡号：4242 4242 4242 4242

### Q: 图片上传失败？
A: 开发环境可以使用本地存储，或配置 Cloudinary。

---

## 📚 相关文档

- `DEPLOYMENT_GUIDE.md` - 部署指南
- `PRODUCT_CONFIGURATION_GUIDE.md` - 产品配置指南
- `TESTING_GUIDE.md` - 测试指南
- `PRE_LAUNCH_CHECKLIST.md` - 上线前检查清单

---

**准备好了吗？开始配置你的产品吧！🎉**
