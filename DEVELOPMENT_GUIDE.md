# 开发指南

## 跨境开发关键坑点

### 1. 支付集成安全注意事项

#### ⚠️ 支付密钥安全
```typescript
// ❌ 错误：不要将密钥硬编码在代码中
const stripe = new Stripe('sk_live_...');

// ✅ 正确：使用环境变量
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
```

#### ⚠️ 金额单位转换
```typescript
// Stripe 使用分（cents）作为单位，不是元
// ❌ 错误
amount: 89.99  // 这会被视为 89.99 分，而不是 89.99 美元

// ✅ 正确
amount: Math.round(89.99 * 100)  // 8999 分 = 89.99 美元
```

#### ⚠️ 货币代码格式
```typescript
// Stripe 需要小写货币代码
// ❌ 错误
currency: 'USD'

// ✅ 正确
currency: 'usd'
```

#### ⚠️ Webhook 签名验证
```typescript
// 必须验证 webhook 签名，防止伪造请求
const event = stripe.webhooks.constructEvent(
  payload,
  signature,
  webhookSecret
);
```

### 2. 国际物流单号格式规范

不同物流商的追踪单号格式不同：

- **DHL**: `1234567890` (10位数字) 或 `JD1234567890123456` (字母+数字)
- **FedEx**: `123456789012` (12位数字) 或 `123456789012345` (15位数字)
- **UPS**: `1Z999AA10123456784` (字母+数字组合)

**处理建议**：
- 存储物流商信息，根据物流商使用对应的验证规则
- 使用正则表达式验证单号格式
- 提供友好的错误提示

### 3. 汇率更新频率

```typescript
// ❌ 错误：每次请求都获取汇率（浪费 API 调用）
const rate = await fetchExchangeRate();

// ✅ 正确：缓存汇率，定期更新
const CACHE_DURATION = 60 * 60 * 1000; // 1小时
let cachedRate = null;
let lastUpdate = 0;

async function getExchangeRate() {
  if (Date.now() - lastUpdate < CACHE_DURATION && cachedRate) {
    return cachedRate;
  }
  cachedRate = await fetchExchangeRate();
  lastUpdate = Date.now();
  return cachedRate;
}
```

### 4. 国际地址格式处理

不同国家的地址格式不同：

- **美国/加拿大**：需要 State/Province
- **英国**：不需要 State，但需要 County
- **澳大利亚**：需要 State/Territory

**处理建议**：
```typescript
// 根据国家动态显示/隐藏字段
{formData.country === 'US' || formData.country === 'CA' ? (
  <input name="state" required />
) : null}
```

### 5. 关税计算注意事项

- 不同国家的关税税率不同
- 某些商品可能免税（如低价值商品）
- 关税应在结算时明确告知用户
- 建议使用专业关税计算服务（Avalara, TaxJar）

### 6. 时区处理

```typescript
// ❌ 错误：使用本地时区
const deliveryDate = new Date();

// ✅ 正确：使用 UTC 或用户时区
const deliveryDate = new Date().toISOString();
// 或使用 date-fns-tz 处理时区
import { formatInTimeZone } from 'date-fns-tz';
```

## API 集成示例

### Stripe 支付集成

#### 1. 安装依赖
```bash
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

#### 2. 创建支付意图（服务端）
```typescript
// app/api/payment/create-intent/route.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const { amount, currency } = await request.json();
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // 转换为分
    currency: currency.toLowerCase(),
  });
  
  return Response.json({
    clientSecret: paymentIntent.client_secret,
  });
}
```

#### 3. 客户端支付处理
```typescript
// components/CheckoutForm.tsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error, paymentIntent } = await stripe!.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements!.getElement(CardElement)!,
        },
      }
    );
    
    if (error) {
      console.error(error);
    } else if (paymentIntent?.status === 'succeeded') {
      // 支付成功，更新订单状态
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">Pay</button>
    </form>
  );
}
```

### DHL API 集成示例

```typescript
// lib/api/dhl.ts
import axios from 'axios';

const DHL_API_URL = 'https://api.dhl.com/shipment';

export async function createDHLShipment(data: {
  address: ShippingAddress;
  packageInfo: PackageInfo;
}) {
  const response = await axios.post(
    `${DHL_API_URL}/create`,
    {
      receiverAddress: {
        name: `${data.address.firstName} ${data.address.lastName}`,
        addressLine1: data.address.addressLine1,
        city: data.address.city,
        postalCode: data.address.postalCode,
        countryCode: data.address.country,
      },
      package: {
        weight: data.packageInfo.weight,
        dimensions: {
          length: data.packageInfo.length,
          width: data.packageInfo.width,
          height: data.packageInfo.height,
        },
      },
    },
    {
      headers: {
        'DHL-API-Key': process.env.DHL_API_KEY!,
        'Content-Type': 'application/json',
      },
    }
  );
  
  return {
    trackingNumber: response.data.trackingNumber,
    labelUrl: response.data.labelUrl,
  };
}
```

## 性能优化建议

### 1. 图片优化
```typescript
// 使用 Next.js Image 组件
import Image from 'next/image';

<Image
  src="/product.jpg"
  alt="Product"
  width={400}
  height={400}
  loading="lazy"  // 懒加载
  placeholder="blur"  // 模糊占位符
/>
```

### 2. 代码分割
```typescript
// 动态导入大型组件
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
});
```

### 3. API 响应缓存
```typescript
// 使用 Next.js 缓存
export async function GET(request: Request) {
  const data = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // 缓存 1 小时
  });
  
  return Response.json(data);
}
```

## 测试建议

### 1. 支付测试
- 使用 Stripe 测试模式（test mode）
- 测试不同支付场景（成功、失败、退款）
- 测试不同货币的支付

### 2. 物流测试
- 测试不同国家的地址格式
- 测试不同物流方式的费用计算
- 测试物流追踪功能

### 3. 多语言测试
- 测试所有支持的语言
- 测试 RTL（从右到左）语言（如果支持）
- 测试货币符号显示

## 部署检查清单

- [ ] 环境变量已配置（支付、物流 API 密钥）
- [ ] SSL 证书已安装（HTTPS）
- [ ] 支付 webhook URL 已配置
- [ ] 多语言路由已测试
- [ ] 图片 CDN 已配置
- [ ] 错误监控已集成（Sentry）
- [ ] 性能监控已集成（Google Analytics）
- [ ] 备份策略已制定

## 常见问题

### Q: 如何处理支付失败？
A: 实现重试机制，提供友好的错误提示，记录失败原因用于分析。

### Q: 国际订单的退货如何处理？
A: 明确退货政策，提供退货标签，考虑国际退货的物流成本。

### Q: 如何优化跨境网站的加载速度？
A: 使用 CDN、图片优化、代码分割、服务端渲染（SSR）。

### Q: 如何处理汇率波动？
A: 设置汇率缓冲区间，定期更新汇率，考虑使用固定汇率锁定订单价格。

