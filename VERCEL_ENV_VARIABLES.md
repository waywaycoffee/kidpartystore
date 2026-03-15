# Vercel环境变量配置清单

## 📋 必需环境变量

### 基础配置
```env
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-generated-secret-key
```

### 管理员配置
```env
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

### Vercel KV（自动添加，创建KV数据库后）
```env
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your-kv-token
KV_REST_API_READ_ONLY_TOKEN=your-read-only-token
```

---

## 📋 可选环境变量

### Stripe支付
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 邮件服务（SendGrid）
```env
SENDGRID_API_KEY=SG.xxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
```

### AI配置
```env
OPENAI_API_KEY=sk-...
```

### 图片存储（Cloudinary）
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Google验证
```env
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-verification-code
```

---

## 🔑 如何生成NEXTAUTH_SECRET

在本地运行：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

或使用OpenSSL：
```bash
openssl rand -base64 32
```

---

## 📝 在Vercel中配置

1. 进入项目设置
2. 点击 **Environment Variables**
3. 添加每个变量
4. 选择环境（Production/Preview/Development）
5. 保存

---

## ✅ 检查清单

- [ ] NEXTAUTH_URL已配置
- [ ] NEXTAUTH_SECRET已生成并配置
- [ ] ADMIN_EMAIL已配置
- [ ] ADMIN_PASSWORD已配置
- [ ] KV数据库已创建（自动添加KV变量）
- [ ] Stripe密钥已配置（如使用支付）
- [ ] 邮件服务已配置（如使用邮件）
- [ ] 所有变量已添加到正确环境


