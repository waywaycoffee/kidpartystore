# 前后端联调测试方案

## 📋 目录
1. [测试环境配置](#测试环境配置)
2. [测试数据准备](#测试数据准备)
3. [API接口测试](#api接口测试)
4. [前端功能测试](#前端功能测试)
5. [端到端流程测试](#端到端流程测试)
6. [性能测试](#性能测试)
7. [测试报告模板](#测试报告模板)

---

## 测试环境配置

### 1. 开发环境

```bash
# 前端启动
npm run dev
# 访问：http://localhost:3000

# 后端API（Next.js API Routes）
# 自动启动在同一端口
```

### 2. 测试工具

- **API测试：** Postman / Insomnia / curl
- **浏览器测试：** Chrome DevTools, Firefox DevTools
- **自动化测试（可选）：** Playwright, Cypress
- **性能测试：** Lighthouse, Chrome DevTools Performance

### 3. 测试账号准备

```typescript
// 测试用户数据
const testUsers = [
  {
    email: 'test@example.com',
    password: 'test123',
    addresses: [
      {
        id: 'addr1',
        firstName: 'Test',
        lastName: 'User',
        addressLine1: '123 Test St',
        city: 'Test City',
        country: 'US',
        postalCode: '12345'
      }
    ]
  }
];
```

---

## 测试数据准备

### 1. 主题测试数据

创建 `data/themes.json`：

```json
[
  {
    "id": "disney-princess",
    "name": "迪士尼公主",
    "nameEn": "Disney Princess",
    "description": "梦幻公主主题派对，适合3-8岁女孩",
    "descriptionEn": "Magical princess themed party for girls aged 3-8",
    "image": "/themes/disney-princess.jpg",
    "bannerImage": "/themes/disney-princess-banner.jpg",
    "ageRange": { "min": 3, "max": 8 },
    "gender": "girl",
    "recommendedGuests": 10,
    "recommendedVenue": "indoor",
    "featured": true,
    "packages": [
      {
        "id": "disney-basic",
        "name": "基础套餐",
        "level": "basic",
        "price": 49.99,
        "items": [
          { "productId": "prod1", "quantity": 1, "name": "Disney Banner" },
          { "productId": "prod2", "quantity": 10, "name": "Disney Balloons" }
        ],
        "savings": 10.00
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  {
    "id": "superhero",
    "name": "超级英雄",
    "nameEn": "Superhero",
    "description": "勇敢的超级英雄主题，适合4-10岁男孩",
    "descriptionEn": "Brave superhero theme for boys aged 4-10",
    "ageRange": { "min": 4, "max": 10 },
    "gender": "boy",
    "featured": true,
    "packages": []
  }
]
```

### 2. 优惠码测试数据

创建 `data/coupons.json`：

```json
[
  {
    "code": "BIRTHDAY10",
    "type": "percentage",
    "value": 10,
    "minAmount": 50,
    "maxDiscount": 20,
    "validFrom": "2024-01-01T00:00:00Z",
    "validTo": "2024-12-31T23:59:59Z",
    "usageLimit": 1000,
    "usedCount": 0,
    "applicableCategories": []
  },
  {
    "code": "SAVE20",
    "type": "fixed",
    "value": 20,
    "minAmount": 100,
    "validFrom": "2024-01-01T00:00:00Z",
    "validTo": "2024-12-31T23:59:59Z",
    "usedCount": 0
  },
  {
    "code": "EXPIRED",
    "type": "percentage",
    "value": 15,
    "validFrom": "2023-01-01T00:00:00Z",
    "validTo": "2023-12-31T23:59:59Z",
    "usedCount": 0
  }
]
```

### 3. 订单测试数据

更新 `data/orders.json`：

```json
[
  {
    "id": "ORD-20240101001",
    "userId": "user1",
    "email": "test@example.com",
    "status": "pending_payment",
    "items": [
      {
        "productId": "prod1",
        "name": "Disney Princess Banner",
        "price": 19.99,
        "quantity": 1,
        "image": "/products/banner.jpg",
        "theme": "disney-princess"
      }
    ],
    "shippingAddress": {
      "firstName": "Test",
      "lastName": "User",
      "addressLine1": "123 Test St",
      "city": "Test City",
      "country": "US",
      "postalCode": "12345"
    },
    "pricing": {
      "subtotal": 19.99,
      "discount": 0,
      "shipping": 9.99,
      "tax": 2.00,
      "total": 31.98
    },
    "createdAt": "2024-01-01T10:00:00Z",
    "updatedAt": "2024-01-01T10:00:00Z"
  },
  {
    "id": "ORD-20240101002",
    "status": "paid",
    "email": "test@example.com",
    "items": [],
    "pricing": { "subtotal": 49.99, "discount": 0, "shipping": 0, "tax": 5.00, "total": 54.99 },
    "createdAt": "2024-01-01T11:00:00Z"
  }
]
```

---

## API接口测试

### 测试工具：Postman Collection

创建 `tests/postman/Party-Store-API.postman_collection.json`

### 1. 主题相关API测试

#### GET /api/themes

**测试用例：**

```http
### 获取所有主题
GET http://localhost:3000/api/themes

### 获取热门主题
GET http://localhost:3000/api/themes?featured=true

### 按性别筛选
GET http://localhost:3000/api/themes?gender=girl

### 按年龄段筛选
GET http://localhost:3000/api/themes?ageGroup=3-5

### 组合筛选
GET http://localhost:3000/api/themes?category=kids-birthday&gender=boy&ageGroup=6-9
```

**预期结果：**
- 状态码：200
- 返回格式：`{ themes: Theme[] }`
- 数据验证：每个主题包含必需字段

#### GET /api/themes/[id]

```http
### 获取主题详情
GET http://localhost:3000/api/themes/disney-princess
```

**预期结果：**
- 状态码：200
- 返回格式：`{ theme: Theme, packages: ThemePackage[] }`
- 包含套餐信息

**测试脚本（Postman Tests）：**

```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has themes array", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('themes');
    pm.expect(jsonData.themes).to.be.an('array');
});

pm.test("Each theme has required fields", function () {
    var jsonData = pm.response.json();
    jsonData.themes.forEach(function(theme) {
        pm.expect(theme).to.have.property('id');
        pm.expect(theme).to.have.property('name');
        pm.expect(theme).to.have.property('ageRange');
    });
});
```

---

### 2. 购物车优惠码API测试

#### POST /api/cart/apply-coupon

**测试用例：**

```http
### 应用有效优惠码（百分比）
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "BIRTHDAY10",
  "cartTotal": 60.00
}

### 应用有效优惠码（固定金额）
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "SAVE20",
  "cartTotal": 120.00
}

### 应用无效优惠码
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "INVALID",
  "cartTotal": 60.00
}

### 应用已过期优惠码
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "EXPIRED",
  "cartTotal": 60.00
}

### 金额不足
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "BIRTHDAY10",
  "cartTotal": 30.00
}
```

**预期结果：**

- 有效优惠码：`{ success: true, discount: number, type: string, finalAmount: number }`
- 无效优惠码：`{ success: false, error: string }`
- 金额不足：`{ success: false, error: "Minimum amount not met" }`

**测试脚本：**

```javascript
pm.test("Valid coupon returns discount", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData).to.have.property('discount');
    pm.expect(jsonData.discount).to.be.above(0);
});

pm.test("Invalid coupon returns error", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.false;
    pm.expect(jsonData).to.have.property('error');
});
```

---

### 3. 结算流程API测试

#### POST /api/checkout/shipping

```http
### 提交收货信息
POST http://localhost:3000/api/checkout/shipping
Content-Type: application/json

{
  "firstName": "Test",
  "lastName": "User",
  "addressLine1": "123 Test St",
  "city": "Test City",
  "state": "CA",
  "postalCode": "12345",
  "country": "US",
  "phone": "1234567890",
  "email": "test@example.com",
  "saveAddress": true
}
```

**预期结果：**
- 状态码：200
- 返回：`{ addressId: string, shippingOptions: ShippingOption[] }`

#### POST /api/checkout/shipping-method

```http
### 选择配送方式
POST http://localhost:3000/api/checkout/shipping-method
Content-Type: application/json

{
  "addressId": "addr1",
  "method": "standard",
  "cartTotal": 60.00
}
```

**预期结果：**
- 返回：`{ shippingCost: number, estimatedDays: number, estimatedDelivery: string }`

#### POST /api/checkout/payment

```http
### 提交支付
POST http://localhost:3000/api/checkout/payment
Content-Type: application/json

{
  "paymentMethod": "card",
  "cardNumber": "4242424242424242",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "cvv": "123",
  "cartItems": [...],
  "shippingAddress": {...},
  "shippingMethod": {...},
  "couponCode": "BIRTHDAY10"
}
```

**预期结果：**
- 成功：`{ success: true, orderId: string }`
- 失败：`{ success: false, error: string }`

---

### 4. 订单管理API测试

#### GET /api/orders

```http
### 获取订单列表
GET http://localhost:3000/api/orders

### 按状态筛选
GET http://localhost:3000/api/orders?status=pending_payment
```

#### GET /api/orders/[id]

```http
### 获取订单详情
GET http://localhost:3000/api/orders/ORD-20240101001
```

#### POST /api/orders/[id]/cancel

```http
### 取消订单
POST http://localhost:3000/api/orders/ORD-20240101001/cancel
```

---

## 前端功能测试

### 测试用例文档格式

每个测试用例包含：
- **测试ID：** 唯一标识
- **测试名称：** 简短描述
- **优先级：** P0/P1/P2
- **前置条件：** 测试前的状态
- **测试步骤：** 详细操作步骤
- **预期结果：** 期望的输出
- **实际结果：** 测试时的实际输出
- **状态：** Pass/Fail/Blocked

### 1. 首页功能测试用例

#### TC-HOME-001: Hero Banner显示和交互

**优先级：** P0

**前置条件：**
- 访问首页 `/`
- 页面完全加载

**测试步骤：**
1. 检查Hero Banner区域是否显示
2. 检查核心卖点文案是否显示（如"一站式儿童派对用品，一键搞定生日宴"）
3. 检查"立即选主题"按钮是否存在
4. 点击"立即选主题"按钮
5. 验证是否跳转到主题页 `/themes`

**预期结果：**
- Hero Banner正常显示
- 文案内容正确
- 按钮可点击
- 点击后正确跳转

**测试数据：**
- 核心卖点文案：可配置，从CMS或配置文件读取

---

#### TC-HOME-002: 主题轮播功能

**优先级：** P0

**前置条件：**
- 首页已加载
- 至少有6个热门主题数据

**测试步骤：**
1. 检查主题轮播区域是否显示
2. 统计显示的主题卡片数量（应为6-8个）
3. 检查每个主题卡片是否包含：
   - 主题图片
   - 主题名称
   - 氛围文案（1句话）
   - "查看详情"按钮
4. 点击轮播左箭头（如有）
5. 验证主题卡片向左滑动
6. 点击轮播右箭头
7. 验证主题卡片向右滑动
8. 点击某个主题卡片
9. 验证跳转到主题详情页 `/themes/[id]`

**预期结果：**
- 轮播区域正常显示
- 显示6-8个主题卡片
- 卡片信息完整
- 轮播切换正常
- 点击跳转正确

**边界测试：**
- 主题数量少于6个：应正常显示所有主题
- 主题数量超过8个：应显示前8个或支持滚动

---

#### TC-HOME-003: 年龄段入口功能

**优先级：** P0

**前置条件：**
- 首页已加载

**测试步骤：**
1. 检查年龄段入口区域是否显示
2. 检查4个年龄段卡片是否存在：
   - 1岁专区
   - 3-5岁
   - 6-9岁
   - 10+
3. 检查每个卡片是否显示：
   - 年龄段标识
   - 推荐主题数量（可选）
4. 点击"1岁专区"卡片
5. 验证URL跳转到 `/themes?ageGroup=1`
6. 验证主题列表筛选为1岁相关主题
7. 重复步骤4-6，测试其他年龄段

**预期结果：**
- 年龄段入口正常显示
- 4个年龄段卡片都存在
- 点击后正确跳转和筛选

---

#### TC-HOME-004: 品类快捷入口功能

**优先级：** P0

**前置条件：**
- 首页已加载

**测试步骤：**
1. 检查品类快捷入口区域是否显示
2. 检查5个品类入口是否存在：
   - 气球
   - 装饰
   - 餐具
   - 游戏/礼品
   - 彩罐
3. 点击"气球"入口
4. 验证跳转到 `/categories/balloons`
5. 验证页面显示气球相关商品
6. 重复步骤3-5，测试其他品类

**预期结果：**
- 品类入口正常显示
- 所有5个品类都存在
- 点击后正确跳转

---

### 2. 购物车功能测试用例

#### TC-CART-001: 商品列表显示

**优先级：** P0

**前置条件：**
- 购物车中有至少2个商品
- 访问 `/cart`

**测试步骤：**
1. 检查商品列表区域是否显示
2. 检查每个商品是否显示：
   - 商品缩略图
   - 商品名称
   - 主题标签（如有）
   - 单价
   - 数量
   - 小计（单价 × 数量）
3. 验证商品信息是否正确
4. 验证小计计算是否正确

**预期结果：**
- 商品列表正常显示
- 所有商品信息完整
- 价格计算正确

---

#### TC-CART-002: 数量修改功能

**优先级：** P0

**前置条件：**
- 购物车中有商品
- 访问 `/cart`

**测试步骤：**
1. 记录当前商品数量和小计
2. 记录当前订单总计
3. 点击数量增加按钮（+）
4. 验证数量增加1
5. 验证小计更新（单价 × 新数量）
6. 验证订单总计更新
7. 点击数量减少按钮（-）
8. 验证数量减少1
9. 验证小计和总计更新
10. 将数量减少到0
11. 验证是否提示删除商品或自动删除

**预期结果：**
- 数量修改正常
- 价格实时更新
- 总计计算正确

---

#### TC-CART-003: 优惠码功能

**优先级：** P1

**前置条件：**
- 购物车中有商品，总金额 ≥ 50
- 访问 `/cart`

**测试步骤：**

**有效优惠码测试：**
1. 找到优惠码输入框
2. 输入有效优惠码 "BIRTHDAY10"
3. 点击"应用"按钮
4. 等待API响应
5. 验证优惠信息显示：
   - 优惠金额显示
   - 优惠类型显示（如"10% off"）
6. 验证订单摘要更新：
   - 商品小计
   - 优惠金额（负数）
   - 总计 = 小计 - 优惠金额

**无效优惠码测试：**
7. 输入无效优惠码 "INVALID"
8. 点击"应用"按钮
9. 验证错误提示显示（如"优惠码无效"）

**金额不足测试：**
10. 清空购物车，添加低价商品（总金额 < 50）
11. 输入 "BIRTHDAY10"
12. 点击"应用"
13. 验证错误提示（如"订单金额需满$50"）

**移除优惠码测试：**
14. 应用有效优惠码后
15. 点击"移除"按钮（如有）
16. 验证优惠信息消失
17. 验证总计恢复原价

**预期结果：**
- 有效优惠码正确应用
- 无效优惠码正确提示错误
- 金额不足正确提示
- 移除优惠码功能正常

---

### 3. 结算流程测试用例

#### TC-CHECKOUT-001: Step 1 - 收货信息（未登录用户）

**优先级：** P0

**前置条件：**
- 购物车中有商品
- 用户未登录
- 点击"结算"按钮

**测试步骤：**
1. 验证跳转到 `/checkout/shipping`
2. 检查页面顶部是否显示"登录/注册"入口
3. 检查是否显示"游客下单"选项（如有）
4. 填写收货信息表单：
   - 姓名（必填）
   - 手机号（必填）
   - 邮箱（必填）
   - 详细地址（省市区+街道+邮编，必填）
5. 勾选"保存为常用地址"（可选）
6. 检查订单概要区域是否显示：
   - 商品小计
   - 预估运费
   - 预估税费
   - 总金额
7. 点击"继续选择配送方式"按钮
8. 验证跳转到 `/checkout/shipping-method`

**表单验证测试：**
9. 不填写必填字段，直接点击"继续"
10. 验证错误提示显示
11. 填写无效邮箱格式
12. 验证邮箱格式验证

**预期结果：**
- 页面正常加载
- 登录入口显示
- 表单填写正常
- 订单概要正确显示
- 表单验证正常
- 跳转到下一步正常

---

#### TC-CHECKOUT-002: Step 2 - 配送方式选择

**优先级：** P0

**前置条件：**
- 已完成Step 1（收货信息）

**测试步骤：**
1. 验证当前页面为 `/checkout/shipping-method`
2. 检查配送选项是否显示：
   - 标准快递（预计7天，$9.99）
   - 加急快递（预计3天，$19.99）
   - 次日达（预计1天，$39.99）
3. 检查每个选项是否显示：
   - 配送方式名称
   - 预计送达时间
   - 费用
4. 选择"标准快递"
5. 验证订单摘要更新：
   - 运费更新为 $9.99
   - 总金额更新
6. 选择"加急快递"
7. 验证运费和总金额更新
8. 检查是否显示"满X免运费"提示（如购物车金额 ≥ 50）
9. 如果满足免邮条件，验证运费显示为 $0
10. 点击"继续填写付款信息"按钮
11. 验证跳转到 `/checkout/payment`

**运费计算测试：**
12. 修改购物车金额（通过返回购物车）
13. 返回配送方式页
14. 验证运费根据金额重新计算

**预期结果：**
- 配送选项正常显示
- 选择配送方式后价格更新
- 免邮提示正确
- 运费计算准确
- 跳转到下一步正常

---

#### TC-CHECKOUT-003: Step 3 - 付款信息

**优先级：** P0

**前置条件：**
- 已完成Step 2（配送方式）

**测试步骤：**
1. 验证当前页面为 `/checkout/payment`
2. 检查支付方式选项是否显示：
   - PayPal
   - Apple Pay
   - 银联/银行卡
   - 信用卡
3. 选择"信用卡"支付方式
4. 检查信用卡表单是否显示：
   - 卡号输入框
   - 有效期（月/年）
   - CVV安全码
5. 填写信用卡信息：
   - 卡号：4242 4242 4242 4242（测试卡号）
   - 有效期：12/2025
   - CVV：123
6. 检查"保存卡信息"选项（如有）
7. 展开订单详情：
   - 商品明细
   - 配送方式
   - 预计到货时间
   - 价格明细（商品小计、运费、税费、总计）
8. 勾选"我已阅读并同意服务条款与隐私政策"
9. 点击"确认支付"按钮
10. 等待支付处理
11. 验证跳转到支付结果页 `/order-confirmation/[orderId]`

**支付方式切换测试：**
12. 选择PayPal支付方式
13. 验证显示PayPal登录界面（或跳转PayPal）

**表单验证测试：**
14. 不勾选同意条款，点击"确认支付"
15. 验证错误提示
16. 填写无效卡号
17. 验证卡号格式验证

**预期结果：**
- 支付方式选项正常显示
- 信用卡表单正常显示和填写
- 订单详情正确显示
- 表单验证正常
- 支付流程正常
- 跳转到结果页正常

---

### 4. 支付结果页测试用例

#### TC-PAYMENT-001: 支付成功页

**优先级：** P0

**前置条件：**
- 完成支付流程，支付成功

**测试步骤：**
1. 验证当前页面为 `/order-confirmation/[orderId]`
2. 检查"支付成功"提示是否显示（绿色对勾图标）
3. 检查订单号是否显示（格式：ORD-20240101001）
4. 检查预计发货时间是否显示
5. 检查预计到达时间是否显示
6. 检查订单概要是否显示：
   - 商品列表（缩略图、名称、数量、价格）
   - 订单金额
   - 支付方式
   - 配送地址
7. 点击"查看订单详情"按钮
8. 验证跳转到 `/account/orders/[orderId]`
9. 返回支付成功页
10. 点击"继续逛逛"按钮
11. 验证跳转到首页 `/`
12. 检查推荐相关主题/产品区域是否显示（如有）

**预期结果：**
- 成功提示清晰
- 订单信息完整
- 按钮功能正常
- 跳转正确

---

#### TC-PAYMENT-002: 支付失败页

**优先级：** P0

**前置条件：**
- 支付失败（模拟或真实失败场景）

**测试步骤：**
1. 验证当前页面显示支付失败信息
2. 检查失败原因是否显示（如"支付超时"、"余额不足"）
3. 检查"重新支付"按钮是否存在
4. 点击"重新支付"按钮
5. 验证跳转回 `/checkout/payment`
6. 返回失败页
7. 检查"更换支付方式"按钮是否存在
8. 点击"更换支付方式"
9. 验证跳转到支付方式选择
10. 检查订单是否在用户中心标记为"待支付"

**预期结果：**
- 失败信息清晰
- 操作按钮正常
- 跳转正确
- 订单状态正确

---

## 端到端流程测试

### 完整购物流程测试

#### E2E-FLOW-001: 完整购买流程（新用户）

**测试场景：** 新用户从未登录到完成支付的完整流程

**测试步骤：**

1. **浏览首页**
   - 访问首页 `/`
   - 浏览主题轮播
   - 点击某个主题卡片

2. **选择商品**
   - 在主题详情页查看套餐
   - 选择"标准套餐"
   - 点击"加入购物车"
   - 验证购物车图标数量更新

3. **继续购物**
   - 返回首页
   - 点击品类入口"气球"
   - 选择1个气球商品
   - 加入购物车

4. **查看购物车**
   - 点击购物车图标
   - 验证2个商品都在购物车
   - 输入优惠码 "BIRTHDAY10"
   - 应用优惠码
   - 验证优惠金额显示

5. **开始结算**
   - 点击"结算"按钮
   - 验证跳转到 `/checkout/shipping`

6. **填写收货信息**
   - 填写完整收货信息
   - 勾选"保存为常用地址"
   - 点击"继续选择配送方式"

7. **选择配送方式**
   - 选择"标准快递"
   - 验证运费显示
   - 点击"继续填写付款信息"

8. **支付**
   - 选择"信用卡"支付
   - 填写测试卡号
   - 勾选同意条款
   - 点击"确认支付"

9. **支付成功**
   - 验证跳转到支付成功页
   - 验证订单号显示
   - 点击"查看订单详情"
   - 验证订单详情正确

**预期结果：**
- 整个流程顺畅无阻
- 所有数据正确传递
- 订单创建成功
- 状态更新正确

---

### 用户中心流程测试

#### E2E-FLOW-002: 订单管理流程

**测试步骤：**

1. **访问用户中心**
   - 登录账号
   - 访问 `/account/orders`

2. **查看订单列表**
   - 验证订单列表显示
   - 检查订单状态筛选功能
   - 筛选"待支付"订单

3. **查看订单详情**
   - 点击某个订单的"查看详情"
   - 验证订单详情完整显示

4. **取消订单**
   - 选择"待支付"订单
   - 点击"取消订单"
   - 确认取消
   - 验证订单状态更新为"已取消"

5. **地址管理**
   - 切换到"地址管理"标签
   - 点击"新增地址"
   - 填写地址信息
   - 保存地址
   - 验证地址列表更新

---

## 性能测试

### 1. 页面加载性能

**测试指标：**
- First Contentful Paint (FCP) < 1.5s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.5s

**测试方法：**
- 使用 Chrome DevTools Lighthouse
- 使用 WebPageTest

**测试页面：**
- 首页
- 主题详情页
- 购物车页
- 结算页

### 2. API响应时间

**测试指标：**
- API响应时间 < 500ms（正常情况）
- API响应时间 < 2s（大量数据）

**测试方法：**
- Postman性能测试
- 监控工具

**测试API：**
- GET /api/themes
- GET /api/products
- POST /api/checkout/payment

### 3. 并发测试

**测试场景：**
- 100个并发用户访问首页
- 50个并发用户同时结算

**测试工具：**
- Apache Bench (ab)
- k6
- JMeter

---

## 测试报告模板

### 测试执行报告

```
项目名称：Party自建站
测试日期：2024-01-XX
测试人员：XXX
测试环境：Development (localhost:3000)

## 测试概览
- 总测试用例数：XX
- 通过：XX
- 失败：XX
- 阻塞：XX
- 通过率：XX%

## 功能测试结果

### 首页功能
- TC-HOME-001: ✅ Pass
- TC-HOME-002: ✅ Pass
- TC-HOME-003: ❌ Fail - 年龄段筛选不生效
- TC-HOME-004: ✅ Pass

### 购物车功能
- TC-CART-001: ✅ Pass
- TC-CART-002: ✅ Pass
- TC-CART-003: ⚠️ Blocked - 优惠码API未实现

## 发现的问题

### 高优先级Bug
1. **BUG-001**: 年龄段筛选功能不生效
   - 描述：点击年龄段入口后，主题列表未正确筛选
   - 重现步骤：...
   - 预期：...
   - 实际：...

### 中优先级Bug
...

## 性能测试结果
- 首页加载时间：1.2s ✅
- API平均响应时间：350ms ✅

## 建议
1. 优化主题列表加载性能
2. 增加错误边界处理
3. ...
```

---

## 测试检查清单

### 功能完整性
- [ ] 首页所有模块正常
- [ ] 主题轮播功能正常
- [ ] 年龄段筛选正常
- [ ] 品类入口正常
- [ ] 购物车功能完整
- [ ] 优惠码功能正常
- [ ] 结算流程3步正常
- [ ] 支付结果页正常
- [ ] 订单管理功能完整
- [ ] 地址管理功能正常

### 数据一致性
- [ ] 前后端数据格式一致
- [ ] API返回数据正确
- [ ] 订单状态流转正确
- [ ] 价格计算准确

### 用户体验
- [ ] 页面加载速度合理
- [ ] 错误提示友好
- [ ] 表单验证及时
- [ ] 响应式设计正常

### 安全性
- [ ] 支付信息加密
- [ ] 用户数据保护
- [ ] API权限验证
- [ ] XSS/CSRF防护

---

## 测试工具和资源

### 推荐工具
- **API测试：** Postman, Insomnia
- **浏览器测试：** Chrome DevTools
- **自动化测试：** Playwright, Cypress
- **性能测试：** Lighthouse, WebPageTest

### 测试数据
- 测试账号：test@example.com
- 测试优惠码：BIRTHDAY10, SAVE20
- 测试信用卡：4242 4242 4242 4242

### 参考文档
- API文档：`docs/API.md`
- 需求文档：`Party 自建站需求.md`
- 实施计划：`IMPLEMENTATION_PLAN.md`

