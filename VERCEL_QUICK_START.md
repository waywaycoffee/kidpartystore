# Vercel免费套餐快速开始 🚀

## ⚡ 5分钟快速部署

### 1️⃣ 注册账号（1分钟）
- 访问 https://vercel.com
- 点击 "Sign Up" → 使用GitHub登录

### 2️⃣ 创建KV数据库（1分钟）
- Dashboard → **Storage** → **Create Database**
- 选择 **KV** → 输入名称 → 选择区域 → **Create**

### 3️⃣ 导入项目（1分钟）
- Dashboard → **Add New Project**
- 选择GitHub仓库 → **Import**
- 在Storage部分，勾选刚才创建的KV数据库

### 4️⃣ 配置环境变量（2分钟）
添加以下4个必需变量：

```env
NEXTAUTH_URL=https://yourproject.vercel.app
NEXTAUTH_SECRET=生成密钥（见下方）
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-password
```

**生成NEXTAUTH_SECRET**：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5️⃣ 部署（自动）
- 点击 **Deploy**
- 等待2-5分钟
- 完成！✅

---

## 📋 必需环境变量清单

| 变量名 | 说明 | 如何获取 |
|--------|------|----------|
| `NEXTAUTH_URL` | 网站URL | 部署后获得，或使用自定义域名 |
| `NEXTAUTH_SECRET` | 密钥 | 运行命令生成 |
| `ADMIN_EMAIL` | 管理员邮箱 | 自己设置 |
| `ADMIN_PASSWORD` | 管理员密码 | 自己设置 |

**KV变量会自动添加**（创建KV数据库后）

---

## ✅ 部署后检查

1. 访问网站URL
2. 访问 `/admin/login` 登录管理后台
3. 测试创建产品，确认数据可以保存

---

## 🆘 遇到问题？

查看详细指南：`VERCEL_FREE_DEPLOYMENT_GUIDE.md`

---

**详细步骤请查看：`VERCEL_FREE_DEPLOYMENT_GUIDE.md`** 📖


