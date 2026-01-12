# Party自建站前后端更新方案

## 📋 目录

1. [需求分析](#需求分析)
2. [前端更新方案](#前端更新方案)
3. [后端更新方案](#后端更新方案)
4. [数据库/数据结构设计](#数据库数据结构设计)
5. [API接口设计](#api接口设计)
6. [前后端联调测试方案](#前后端联调测试方案)

---

## 需求分析

### 现有功能 vs 需求对比

| 功能模块         | 现有状态    | 需求状态                                       | 优先级 |
| ---------------- | ----------- | ---------------------------------------------- | ------ |
| 首页 Hero Banner | ✅ 基础实现 | ⚠️ 需增强（轮播、年龄段入口）                  | P0     |
| 主题轮播         | ✅ 基础实现 | ⚠️ 需增强（6-8个爆款主题卡片）                 | P0     |
| 年龄段入口       | ❌ 未实现   | ✅ 需新增（1岁、3-5岁、6-9岁、10+）            | P0     |
| 品类快捷入口     | ✅ 部分实现 | ⚠️ 需完善（气球、装饰、餐具、游戏/礼品、彩罐） | P0     |
| 儿童生日专题页   | ❌ 未实现   | ✅ 需新增                                      | P1     |
| 主题集合页       | ✅ 基础实现 | ⚠️ 需增强（套餐推荐）                          | P1     |
| 品类集合页       | ✅ 基础实现 | ⚠️ 需增强（搭配推荐）                          | P1     |
| 帮助中心         | ❌ 未实现   | ✅ 需新增                                      | P2     |
| 购物车优惠码     | ❌ 未实现   | ✅ 需新增                                      | P1     |
| 结算分步流程     | ⚠️ 单页实现 | ✅ 需改为3步流程                               | P0     |
| 支付结果页       | ❌ 未实现   | ✅ 需新增                                      | P0     |
| 用户中心订单管理 | ❌ 未实现   | ✅ 需新增                                      | P0     |

---

## 前端更新方案

### 1. 首页更新 (`app/page.tsx`)

#### 1.1 Hero Banner 增强

**需求：** 核心卖点 + "立即选主题"按钮

**实现方案：**

```typescript
// 新增组件：app/components/HeroBanner.tsx
- 支持轮播图（可配置）
- 核心卖点文案（可配置）
- CTA按钮："立即选主题" / "Choose Theme"
- 响应式设计
```

#### 1.2 主推主题轮播

**需求：** 展示6-8个爆款主题卡片

**实现方案：**

```typescript
// 更新：app/page.tsx
- 使用 Swiper/Embla 实现轮播
- 主题卡片组件：ThemeCard
  - 主题图片
  - 主题名称
  - 氛围文案（1句话）
  - "查看详情"按钮
- 从API获取热门主题数据
```

#### 1.3 年龄段入口

**需求：** 1岁专区、3-5岁、6-9岁、10+ 入口卡片

**实现方案：**

```typescript
// 新增组件：app/components/AgeGroupSection.tsx
- 4个年龄段卡片
- 每个卡片：
  - 年龄段标识
  - 推荐主题数量
  - 点击跳转到筛选页：/themes?ageGroup=1
- 响应式网格布局
```

#### 1.4 品类快捷入口

**需求：** 气球、装饰、餐具、游戏/礼品、彩罐

**实现方案：**

```typescript
// 更新：app/page.tsx
- 品类图标卡片
- 链接到对应品类页：
  - /categories/balloons
  - /categories/decorations
  - /categories/tableware
  - /categories/games-gifts
  - /categories/piñatas
```

**文件清单：**

- `app/page.tsx` - 更新首页结构
- `app/components/HeroBanner.tsx` - 新增
- `app/components/ThemeCarousel.tsx` - 新增
- `app/components/AgeGroupSection.tsx` - 新增
- `app/components/CategoryQuickLinks.tsx` - 新增

---

### 2. 儿童生日专题页 (`app/kids-birthday/page.tsx`)

**需求：** 聚合所有儿童生日相关主题和品类

**实现方案：**

```typescript
// 新增页面：app/kids-birthday/page.tsx
结构：
1. 顶部标题 + 简介
   - 标题：Kids Birthday Party Supplies
   - 简要文案
2. 场景入口按钮区
   - 男孩主题 / 女孩主题 / 中性主题
   - 派对彩罐 / 派对游戏 / 生日灵感 Blog
3. 主题展示区
   - 筛选：按性别、年龄段
   - 主题卡片网格
4. 热门产品推荐
   - 生日相关产品列表
```

**API需求：**

- `GET /api/themes?category=kids-birthday&gender=boy|girl|neutral`
- `GET /api/products?category=kids-birthday`

**文件清单：**

- `app/kids-birthday/page.tsx` - 新增
- `app/components/ThemeFilter.tsx` - 新增（性别筛选）

---

### 3. 主题集合页增强 (`app/themes/[id]/page.tsx`)

**需求：** 单一主题详情页，包含套餐推荐

**实现方案：**

```typescript
// 新增页面：app/themes/[id]/page.tsx
结构：
1. 顶部版头
   - 大图 + 主题名
   - 主题氛围描述（1-2句）
   - 关键标签：适合年龄、适合性别、推荐人数/场地
2. 商品分区
   - "一键购主题套装"模块
     - 基础套餐
     - 标准套餐
     - 豪华套餐
   - 单品列表（按品类分组）
3. 相关主题推荐
```

**文件清单：**

- `app/themes/[id]/page.tsx` - 新增
- `app/components/ThemePackageCard.tsx` - 新增
- `app/components/ThemeHeader.tsx` - 新增

---

### 4. 品类集合页增强 (`app/categories/[slug]/page.tsx`)

**需求：** 按品类分块展示，搭配推荐

**实现方案：**

```typescript
// 新增页面：app/categories/[slug]/page.tsx
结构：
1. 品类标题 + 描述
2. 商品瀑布流
   - 按子品类分块（如：气球 > 氦气球、普通气球）
   - 每个子品类内商品网格展示
3. 搭配推荐模块
   - "常一起购买"组合
   - 一键加购功能
```

**文件清单：**

- `app/categories/[slug]/page.tsx` - 新增
- `app/components/ProductBundle.tsx` - 新增（搭配推荐）

---

### 5. 帮助中心 (`app/help/page.tsx`)

**需求：** FAQ、退货政策、配送说明、联系我们

**实现方案：**

```typescript
// 新增页面：app/help/page.tsx
结构：
1. 帮助中心导航
   - FAQ
   - 退货政策
   - 配送说明
   - 联系我们
2. 内容展示区（Tab切换）
3. 搜索功能（可选）
```

**文件清单：**

- `app/help/page.tsx` - 新增
- `app/components/HelpNav.tsx` - 新增
- `app/components/FAQ.tsx` - 新增
- `app/components/ReturnPolicy.tsx` - 新增
- `app/components/ShippingInfo.tsx` - 新增
- `app/components/ContactUs.tsx` - 新增

---

### 6. 购物车页增强 (`app/cart/page.tsx`)

**需求：** 优惠码输入、运费预估

**实现方案：**

```typescript
// 更新：app/cart/page.tsx
新增功能：
1. 优惠码输入框
   - 输入框 + "应用"按钮
   - 优惠信息显示（满减/满赠提示）
   - 错误提示
2. 运费预估
   - 显示"预计运费范围"或"满X包邮提示"
   - 基于购物车金额动态显示
3. 订单摘要更新
   - 商品小计
   - 优惠金额（如有）
   - 运费预估
   - 总计
```

**API需求：**

- `POST /api/cart/apply-coupon` - 应用优惠码
- `GET /api/shipping/estimate?amount=xxx` - 运费预估

**文件清单：**

- `app/cart/page.tsx` - 更新
- `app/components/CouponInput.tsx` - 新增
- `app/components/ShippingEstimate.tsx` - 新增

---

### 7. 结算流程分步化 (`app/checkout/page.tsx`)

**需求：** 3步流程：收货信息 → 配送方式 → 付款信息

**实现方案：**

```typescript
// 重构：app/checkout/page.tsx
改为多步骤流程：

Step 1: 收货信息 (/checkout/shipping)
- 未登录用户：登录/注册入口（可选游客下单）
- 表单字段：姓名、手机、邮箱、地址（省市区+街道+邮编）
- 地址管理：保存为常用地址
- 已登录用户：选择已有地址或新增
- 订单概要：商品小计、预估运费、预估税费、总金额
- 下一步按钮："继续选择配送方式"

Step 2: 配送方式 (/checkout/shipping-method)
- 配送选项：标准快递、加急/次日达
- 运费计算：根据地址和金额实时计算
- 满X免运费状态显示
- 订单摘要更新
- 下一步按钮："继续填写付款信息"

Step 3: 付款信息 (/checkout/payment)
- 支付方式：PayPal、Apple Pay、银联/银行卡、信用卡
- 信用卡表单：卡号、有效期、CVV
- 保存卡信息选项（需安全说明）
- 订单详情展开
- 同意条款勾选
- "确认支付"按钮
```

**文件清单：**

- `app/checkout/shipping/page.tsx` - 新增（Step 1）
- `app/checkout/shipping-method/page.tsx` - 新增（Step 2）
- `app/checkout/payment/page.tsx` - 新增（Step 3）
- `app/components/CheckoutSteps.tsx` - 新增（步骤指示器）
- `app/components/AddressForm.tsx` - 新增（地址表单）
- `app/components/ShippingMethodSelector.tsx` - 新增
- `app/components/PaymentMethodSelector.tsx` - 新增
- `app/components/OrderSummary.tsx` - 新增（订单摘要）

**状态管理：**

- 使用 Redux 或 Context 保存结算流程状态
- 或使用 URL query params 传递数据

---

### 8. 支付结果页 (`app/order-confirmation/[id]/page.tsx`)

**需求：** 支付成功/失败页面

**实现方案：**

```typescript
// 更新：app/order-confirmation/[id]/page.tsx
结构：

成功页：
1. 支付成功提示
2. 订单号显示
3. 预计发货和到达时间
4. 订单概要：
   - 商品列表
   - 金额
   - 支付方式
   - 配送地址
5. CTA按钮：
   - "查看订单详情"
   - "继续逛逛"
   - 推荐相关主题/产品

失败页：
1. 失败原因简述
2. 重新支付按钮
3. 更换支付方式按钮
4. 订单保留提示（在用户中心标记为"待支付"）
```

**文件清单：**

- `app/order-confirmation/[id]/page.tsx` - 更新
- `app/components/OrderSuccess.tsx` - 新增
- `app/components/OrderFailed.tsx` - 新增
- `app/components/OrderDetails.tsx` - 新增

---

### 9. 用户中心订单管理 (`app/account/orders/page.tsx`)

**需求：** 订单列表、订单详情、地址管理

**实现方案：**

```typescript
// 新增页面：app/account/orders/page.tsx
结构：

1. 订单列表
   - 状态筛选：待支付、待发货、配送中、已完成、已取消
   - 订单卡片：
     - 订单号
     - 订单日期
     - 商品缩略图
     - 订单金额
     - 订单状态
     - 操作按钮：查看详情、下载发票、申请售后/退货

2. 订单详情（Modal或新页面）
   - 订单信息
   - 商品明细
   - 配送信息
   - 支付信息
   - 物流追踪（如有）

3. 个人信息与地址管理（Tab切换）
   - 个人信息：手机号、邮箱
   - 地址管理：常用地址列表、新增/编辑/删除
   - 支付方式管理（可选）
```

**文件清单：**

- `app/account/orders/page.tsx` - 新增
- `app/account/orders/[id]/page.tsx` - 新增（订单详情）
- `app/account/addresses/page.tsx` - 新增（地址管理）
- `app/components/OrderCard.tsx` - 新增
- `app/components/OrderStatusBadge.tsx` - 新增
- `app/components/AddressList.tsx` - 新增
- `app/components/ReturnRequestForm.tsx` - 新增

---

## 后端更新方案

### 1. API路由新增/更新

#### 1.1 主题相关API

```typescript
// app/api/themes/route.ts - 新增
GET /api/themes
- 查询参数：
  - category?: string (kids-birthday等)
  - gender?: 'boy' | 'girl' | 'neutral'
  - ageGroup?: '1' | '3-5' | '6-9' | '10+'
  - featured?: boolean (热门主题)
- 返回：主题列表

GET /api/themes/[id]
- 返回：主题详情 + 套餐信息
```

#### 1.2 品类相关API

```typescript
// app/api/categories/[slug]/route.ts - 新增
GET /api/categories/[slug]
- 返回：品类详情 + 商品列表

GET /api/categories/[slug]/bundles
- 返回：搭配推荐组合
```

#### 1.3 购物车相关API

```typescript
// app/api/cart/apply-coupon/route.ts - 新增
POST /api/cart/apply-coupon
- Body: { couponCode: string, cartTotal: number }
- 返回：优惠信息 { discount: number, type: 'percentage' | 'fixed' }
```

#### 1.4 结算相关API

```typescript
// app/api/checkout/shipping/route.ts - 新增
POST /api/checkout/shipping
- Body: ShippingAddress
- 返回：地址验证结果 + 运费预估

// app/api/checkout/shipping-method/route.ts - 新增
POST /api/checkout/shipping-method
- Body: { addressId: string, method: string }
- 返回：运费详情

// app/api/checkout/payment/route.ts - 新增
POST /api/checkout/payment
- Body: PaymentData
- 返回：支付结果 { success: boolean, orderId: string }
```

#### 1.5 订单相关API

```typescript
// app/api/orders/route.ts - 新增
GET /api/orders
- 查询参数：status?: string
- 返回：订单列表

GET /api/orders/[id]
- 返回：订单详情

POST /api/orders/[id]/cancel
- 取消订单

POST /api/orders/[id]/return
- 申请退货

GET /api/orders/[id]/invoice
- 下载发票
```

#### 1.6 用户地址API

```typescript
// app/api/account/addresses/route.ts - 新增
GET /api/account/addresses
- 返回：地址列表

POST /api/account/addresses
- Body: ShippingAddress
- 返回：新增地址

PUT /api/account/addresses/[id]
- Body: ShippingAddress
- 返回：更新地址

DELETE /api/account/addresses/[id]
- 删除地址
```

#### 1.7 帮助中心API

```typescript
// app/api/help/faq/route.ts - 新增
GET /api/help/faq
- 返回：FAQ列表

// app/api/help/policies/route.ts - 新增
GET /api/help/policies
- 查询参数：type?: 'return' | 'shipping' | 'privacy'
- 返回：政策内容
```

---

### 2. 数据模型设计

#### 2.1 主题数据模型

```typescript
interface Theme {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  bannerImage?: string;
  ageRange: {
    min: number;
    max: number;
  };
  gender: 'boy' | 'girl' | 'neutral';
  recommendedGuests?: number;
  recommendedVenue?: string;
  featured: boolean;
  packages: ThemePackage[];
  createdAt: string;
  updatedAt: string;
}

interface ThemePackage {
  id: string;
  name: string;
  level: 'basic' | 'standard' | 'premium';
  price: number;
  items: PackageItem[];
  savings?: number; // 相比单品总价的节省
  image?: string;
}

interface PackageItem {
  productId: string;
  quantity: number;
  name: string;
}
```

#### 2.2 订单数据模型（更新）

```typescript
interface Order {
  id: string;
  userId?: string; // 游客订单可为空
  email: string;
  status:
    | 'pending_payment'
    | 'paid'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'returned';
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: {
    id: string;
    name: string;
    days: number;
    cost: number;
  };
  paymentMethod: {
    type: 'paypal' | 'apple' | 'card' | 'unionpay';
    last4?: string; // 卡号后4位
  };
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  couponCode?: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  theme?: string;
}
```

#### 2.3 优惠码数据模型

```typescript
interface Coupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // 百分比或固定金额
  minAmount?: number; // 最低消费金额
  maxDiscount?: number; // 最大折扣金额
  validFrom: string;
  validTo: string;
  usageLimit?: number; // 使用次数限制
  usedCount: number;
  applicableCategories?: string[]; // 适用品类
}
```

---

## 数据库/数据结构设计

### 文件存储结构（当前使用JSON文件）

```
data/
├── themes.json          # 主题数据
├── products.json        # 产品数据（已有）
├── orders.json          # 订单数据（已有，需更新结构）
├── coupons.json         # 优惠码数据（新增）
├── addresses.json       # 用户地址（新增，按用户ID分组）
└── help/
    ├── faq.json         # FAQ数据
    └── policies.json    # 政策内容
```

### 数据结构示例

**themes.json:**

```json
[
  {
    "id": "disney-princess",
    "name": "迪士尼公主",
    "nameEn": "Disney Princess",
    "description": "梦幻公主主题派对",
    "ageRange": { "min": 3, "max": 8 },
    "gender": "girl",
    "featured": true,
    "packages": [...]
  }
]
```

**coupons.json:**

```json
[
  {
    "code": "BIRTHDAY10",
    "type": "percentage",
    "value": 10,
    "minAmount": 50,
    "validFrom": "2024-01-01",
    "validTo": "2024-12-31",
    "usedCount": 0
  }
]
```

---

## API接口设计

### 接口清单

| 方法   | 路径                             | 功能         | 优先级 |
| ------ | -------------------------------- | ------------ | ------ |
| GET    | `/api/themes`                    | 获取主题列表 | P0     |
| GET    | `/api/themes/[id]`               | 获取主题详情 | P0     |
| GET    | `/api/categories/[slug]`         | 获取品类商品 | P0     |
| GET    | `/api/categories/[slug]/bundles` | 获取搭配推荐 | P1     |
| POST   | `/api/cart/apply-coupon`         | 应用优惠码   | P1     |
| GET    | `/api/shipping/estimate`         | 运费预估     | P1     |
| POST   | `/api/checkout/shipping`         | 提交收货信息 | P0     |
| POST   | `/api/checkout/shipping-method`  | 选择配送方式 | P0     |
| POST   | `/api/checkout/payment`          | 提交支付     | P0     |
| GET    | `/api/orders`                    | 获取订单列表 | P0     |
| GET    | `/api/orders/[id]`               | 获取订单详情 | P0     |
| POST   | `/api/orders/[id]/cancel`        | 取消订单     | P1     |
| POST   | `/api/orders/[id]/return`        | 申请退货     | P1     |
| GET    | `/api/account/addresses`         | 获取地址列表 | P0     |
| POST   | `/api/account/addresses`         | 新增地址     | P0     |
| PUT    | `/api/account/addresses/[id]`    | 更新地址     | P0     |
| DELETE | `/api/account/addresses/[id]`    | 删除地址     | P0     |
| GET    | `/api/help/faq`                  | 获取FAQ      | P2     |
| GET    | `/api/help/policies`             | 获取政策     | P2     |

---

## 前后端联调测试方案

### 测试环境准备

1. **开发环境**
   - 前端：`npm run dev` (localhost:3000)
   - 后端：Next.js API Routes（同端口）
   - 数据：`data/` 目录下的JSON文件

2. **测试数据准备**
   - 创建测试主题数据（至少10个主题）
   - 创建测试产品数据（至少50个产品）
   - 创建测试优惠码（至少3个不同类型）
   - 创建测试订单（至少5个不同状态）

---

### 测试用例清单

#### 1. 首页功能测试

**TC-HOME-001: Hero Banner显示**

- 前置条件：访问首页
- 测试步骤：
  1. 打开首页 `/`
  2. 检查Hero Banner是否显示
  3. 检查核心卖点文案是否正确
  4. 检查"立即选主题"按钮是否存在且可点击
- 预期结果：Hero Banner正常显示，按钮可点击

**TC-HOME-002: 主题轮播功能**

- 前置条件：首页已加载
- 测试步骤：
  1. 检查主题轮播区域是否显示
  2. 检查是否显示6-8个主题卡片
  3. 点击左右箭头切换主题
  4. 点击主题卡片跳转到主题详情页
- 预期结果：轮播正常，卡片可点击跳转

**TC-HOME-003: 年龄段入口**

- 前置条件：首页已加载
- 测试步骤：
  1. 检查年龄段入口区域是否显示
  2. 检查4个年龄段卡片（1岁、3-5岁、6-9岁、10+）是否存在
  3. 点击每个年龄段卡片
  4. 验证跳转到对应筛选页
- 预期结果：年龄段入口正常，跳转正确

**TC-HOME-004: 品类快捷入口**

- 前置条件：首页已加载
- 测试步骤：
  1. 检查品类快捷入口区域
  2. 检查5个品类入口（气球、装饰、餐具、游戏/礼品、彩罐）
  3. 点击每个品类入口
  4. 验证跳转到对应品类页
- 预期结果：品类入口正常，跳转正确

---

#### 2. 儿童生日专题页测试

**TC-KIDS-001: 页面加载**

- 前置条件：访问 `/kids-birthday`
- 测试步骤：
  1. 检查页面标题和简介是否显示
  2. 检查场景入口按钮区是否显示
  3. 检查主题展示区是否加载
- 预期结果：页面正常加载，所有元素显示

**TC-KIDS-002: 性别筛选**

- 前置条件：在儿童生日页
- 测试步骤：
  1. 点击"男孩主题"按钮
  2. 验证主题列表筛选为男孩主题
  3. 点击"女孩主题"按钮
  4. 验证主题列表筛选为女孩主题
- 预期结果：筛选功能正常

**TC-KIDS-003: 主题展示**

- 前置条件：在儿童生日页
- 测试步骤：
  1. 检查主题卡片是否显示
  2. 点击主题卡片
  3. 验证跳转到主题详情页
- 预期结果：主题展示正常，跳转正确

---

#### 3. 主题详情页测试

**TC-THEME-001: 主题信息显示**

- 前置条件：访问 `/themes/[id]`
- 测试步骤：
  1. 检查主题大图和名称是否显示
  2. 检查主题描述是否显示
  3. 检查关键标签（年龄、性别、人数）是否显示
- 预期结果：主题信息完整显示

**TC-THEME-002: 套餐推荐**

- 前置条件：在主题详情页
- 测试步骤：
  1. 检查"一键购主题套装"模块是否显示
  2. 检查基础/标准/豪华套餐是否显示
  3. 点击套餐卡片
  4. 验证套餐商品加入购物车
- 预期结果：套餐显示正常，加购功能正常

**TC-THEME-003: 单品列表**

- 前置条件：在主题详情页
- 测试步骤：
  1. 检查单品列表是否按品类分组
  2. 点击商品卡片
  3. 验证跳转到商品详情页
- 预期结果：单品列表正常，跳转正确

---

#### 4. 购物车功能测试

**TC-CART-001: 商品显示**

- 前置条件：购物车有商品
- 测试步骤：
  1. 访问 `/cart`
  2. 检查商品列表是否显示
  3. 检查商品信息（图片、名称、价格、数量）是否正确
- 预期结果：商品信息正确显示

**TC-CART-002: 数量修改**

- 前置条件：购物车有商品
- 测试步骤：
  1. 点击数量增加按钮
  2. 验证小计和总计更新
  3. 点击数量减少按钮
  4. 验证小计和总计更新
- 预期结果：数量修改正常，价格实时更新

**TC-CART-003: 删除商品**

- 前置条件：购物车有商品
- 测试步骤：
  1. 点击删除按钮
  2. 确认删除操作
  3. 验证商品从列表移除
  4. 验证总计更新
- 预期结果：删除功能正常

**TC-CART-004: 优惠码应用**

- 前置条件：购物车有商品，金额满足优惠码条件
- 测试步骤：
  1. 输入有效优惠码
  2. 点击"应用"按钮
  3. 验证优惠金额显示
  4. 验证总计更新
  5. 输入无效优惠码
  6. 验证错误提示
- 预期结果：优惠码功能正常，错误提示正确

**TC-CART-005: 运费预估**

- 前置条件：购物车有商品
- 测试步骤：
  1. 检查运费预估区域是否显示
  2. 验证"满X包邮"提示是否正确
  3. 修改购物车金额
  4. 验证运费预估更新
- 预期结果：运费预估正确显示和更新

---

#### 5. 结算流程测试

**TC-CHECKOUT-001: Step 1 - 收货信息（未登录）**

- 前置条件：购物车有商品，未登录
- 测试步骤：
  1. 点击"结算"按钮
  2. 检查是否跳转到 `/checkout/shipping`
  3. 检查登录/注册入口是否显示
  4. 填写收货信息表单
  5. 勾选"保存为常用地址"
  6. 检查订单概要是否显示
  7. 点击"继续选择配送方式"
- 预期结果：表单验证通过，跳转到Step 2

**TC-CHECKOUT-002: Step 1 - 收货信息（已登录）**

- 前置条件：购物车有商品，已登录且有保存地址
- 测试步骤：
  1. 访问 `/checkout/shipping`
  2. 检查已有地址列表是否显示
  3. 选择已有地址
  4. 验证表单自动填充
  5. 点击"继续选择配送方式"
- 预期结果：地址选择正常，跳转到Step 2

**TC-CHECKOUT-003: Step 2 - 配送方式**

- 前置条件：已完成Step 1
- 测试步骤：
  1. 检查是否跳转到 `/checkout/shipping-method`
  2. 检查配送选项是否显示（标准、加急、次日达）
  3. 选择不同配送方式
  4. 验证运费和预计送达时间更新
  5. 验证订单摘要更新
  6. 点击"继续填写付款信息"
- 预期结果：配送方式选择正常，价格更新正确

**TC-CHECKOUT-004: Step 3 - 付款信息**

- 前置条件：已完成Step 2
- 测试步骤：
  1. 检查是否跳转到 `/checkout/payment`
  2. 检查支付方式选项是否显示
  3. 选择支付方式（如PayPal）
  4. 填写支付信息（如信用卡信息）
  5. 勾选"同意条款"
  6. 点击"确认支付"
  7. 验证跳转到支付结果页
- 预期结果：支付流程正常，跳转正确

**TC-CHECKOUT-005: 表单验证**

- 前置条件：在结算流程中
- 测试步骤：
  1. Step 1: 不填写必填字段，点击下一步
  2. 验证错误提示显示
  3. Step 3: 不勾选同意条款，点击确认支付
  4. 验证错误提示显示
- 预期结果：表单验证正常，错误提示正确

---

#### 6. 支付结果页测试

**TC-PAYMENT-001: 支付成功页**

- 前置条件：支付成功
- 测试步骤：
  1. 检查是否跳转到 `/order-confirmation/[id]`
  2. 检查"支付成功"提示是否显示
  3. 检查订单号是否显示
  4. 检查预计发货和到达时间是否显示
  5. 检查订单概要是否显示
  6. 点击"查看订单详情"
  7. 验证跳转到订单详情页
- 预期结果：成功页信息完整，跳转正确

**TC-PAYMENT-002: 支付失败页**

- 前置条件：支付失败
- 测试步骤：
  1. 检查失败原因是否显示
  2. 检查"重新支付"按钮是否存在
  3. 点击"重新支付"
  4. 验证跳转回支付页
  5. 检查"更换支付方式"按钮是否存在
- 预期结果：失败页信息完整，操作正常

---

#### 7. 用户中心订单管理测试

**TC-ACCOUNT-001: 订单列表显示**

- 前置条件：已登录，有订单历史
- 测试步骤：
  1. 访问 `/account/orders`
  2. 检查订单列表是否显示
  3. 检查订单信息（订单号、日期、金额、状态）是否正确
  4. 使用状态筛选
  5. 验证订单列表更新
- 预期结果：订单列表正常显示，筛选功能正常

**TC-ACCOUNT-002: 订单详情**

- 前置条件：在订单列表页
- 测试步骤：
  1. 点击"查看详情"
  2. 检查订单详情是否显示
  3. 检查商品明细是否正确
  4. 检查配送信息是否正确
  5. 检查支付信息是否正确
- 预期结果：订单详情完整显示

**TC-ACCOUNT-003: 取消订单**

- 前置条件：有"待支付"或"待发货"订单
- 测试步骤：
  1. 点击"取消订单"
  2. 确认取消操作
  3. 验证订单状态更新为"已取消"
  4. 验证订单列表更新
- 预期结果：取消订单功能正常

**TC-ACCOUNT-004: 申请退货**

- 前置条件：有"已完成"订单
- 测试步骤：
  1. 点击"申请退货"
  2. 填写退货原因
  3. 提交退货申请
  4. 验证订单状态更新为"退货中"
- 预期结果：退货申请功能正常

**TC-ACCOUNT-005: 地址管理**

- 前置条件：已登录
- 测试步骤：
  1. 访问 `/account/addresses`
  2. 检查地址列表是否显示
  3. 点击"新增地址"
  4. 填写地址信息
  5. 保存地址
  6. 验证地址列表更新
  7. 编辑已有地址
  8. 删除地址
- 预期结果：地址管理功能正常

---

#### 8. API接口测试

**TC-API-001: 主题列表API**

- 测试步骤：
  1. 调用 `GET /api/themes`
  2. 验证返回状态码200
  3. 验证返回数据结构正确
  4. 测试查询参数（category, gender, ageGroup）
- 预期结果：API正常返回数据

**TC-API-002: 优惠码API**

- 测试步骤：
  1. 调用 `POST /api/cart/apply-coupon`，有效优惠码
  2. 验证返回优惠信息
  3. 调用无效优惠码
  4. 验证返回错误信息
- 预期结果：优惠码API正常

**TC-API-003: 订单创建API**

- 测试步骤：
  1. 调用 `POST /api/checkout/payment`，完整订单数据
  2. 验证订单创建成功
  3. 验证返回订单ID
  4. 调用 `GET /api/orders/[id]`
  5. 验证订单详情正确
- 预期结果：订单创建和查询正常

---

### 测试执行计划

#### 阶段1：单元测试（开发阶段）

- **时间：** 开发过程中
- **范围：** 组件功能、工具函数、API路由
- **工具：** Jest, React Testing Library

#### 阶段2：集成测试（功能完成后）

- **时间：** 每个功能模块完成后
- **范围：** 前后端联调、数据流
- **方法：** 手动测试 + Postman API测试

#### 阶段3：端到端测试（全部功能完成后）

- **时间：** 所有功能开发完成
- **范围：** 完整用户流程
- **工具：** Playwright / Cypress（可选）

#### 阶段4：用户验收测试（UAT）

- **时间：** 开发完成后
- **范围：** 真实场景测试
- **参与者：** 产品经理、测试人员

---

### 测试数据准备脚本

创建 `scripts/setup-test-data.ts`：

```typescript
// 用于生成测试数据的脚本
// 运行：npm run setup:test-data

import fs from 'fs/promises';
import path from 'path';

// 生成测试主题数据
// 生成测试产品数据
// 生成测试优惠码
// 生成测试订单
```

---

### 测试检查清单

#### 功能完整性检查

- [ ] 首页所有模块正常显示
- [ ] 主题轮播功能正常
- [ ] 年龄段筛选正常
- [ ] 品类入口跳转正常
- [ ] 购物车功能完整
- [ ] 优惠码功能正常
- [ ] 结算流程3步正常
- [ ] 支付结果页正常
- [ ] 订单管理功能完整
- [ ] 地址管理功能正常

#### 数据一致性检查

- [ ] 前后端数据格式一致
- [ ] API返回数据结构正确
- [ ] 订单状态流转正确
- [ ] 价格计算准确

#### 用户体验检查

- [ ] 页面加载速度合理
- [ ] 错误提示友好
- [ ] 表单验证及时
- [ ] 响应式设计正常

#### 安全性检查

- [ ] 支付信息加密
- [ ] 用户数据保护
- [ ] API权限验证
- [ ] XSS/CSRF防护

---

## 实施时间表

### 第1周：核心功能开发

- 首页增强（Hero、轮播、年龄段、品类）
- 结算流程分步化（Step 1-3）
- 支付结果页

### 第2周：专题页和购物车增强

- 儿童生日专题页
- 主题详情页增强
- 购物车优惠码和运费预估

### 第3周：用户中心和帮助

- 用户中心订单管理
- 地址管理
- 帮助中心

### 第4周：测试和优化

- 前后端联调测试
- Bug修复
- 性能优化
- 文档完善

---

## 注意事项

1. **数据迁移**：如果现有订单数据结构需要更新，需要编写迁移脚本
2. **向后兼容**：API更新时保持向后兼容，或提供版本控制
3. **错误处理**：所有API和前端操作都需要完善的错误处理
4. **日志记录**：关键操作（订单创建、支付）需要记录日志
5. **性能优化**：大量数据时考虑分页、懒加载等优化
6. **国际化**：所有新增页面和组件需要支持多语言

---

## 总结

本方案涵盖了需求文档中的所有功能点，分为前端更新、后端更新、数据结构设计和测试方案四个部分。建议按照优先级（P0 > P1 > P2）逐步实施，确保核心功能（结算流程、支付）优先完成。
