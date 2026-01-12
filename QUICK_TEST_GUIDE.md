# 快速测试指南

## 🚀 启动项目

```bash
npm run dev
```

访问：http://localhost:3000

---

## ✅ 功能测试快速清单

### 1. 首页功能（P0）

**测试步骤：**
1. ✅ 访问首页 `/`
2. ✅ 检查Hero Banner显示
3. ✅ 检查主题轮播（应显示热门主题）
4. ✅ 点击左右箭头切换主题
5. ✅ 检查年龄段入口（4个卡片）
6. ✅ 点击年龄段卡片跳转
7. ✅ 检查品类快捷入口（5个入口）
8. ✅ 点击品类入口跳转

**预期结果：**
- 所有模块正常显示
- 跳转功能正常
- 数据从API加载

---

### 2. 购物车功能（P0）

**测试步骤：**
1. ✅ 添加商品到购物车
2. ✅ 访问 `/cart`
3. ✅ 检查商品列表
4. ✅ 测试数量修改（+/-）
5. ✅ 测试删除商品
6. ✅ 输入优惠码 `BIRTHDAY10`（需满足$50最低消费）
7. ✅ 点击"应用"按钮
8. ✅ 验证优惠金额显示
9. ✅ 检查运费预估提示

**测试优惠码：**
- `BIRTHDAY10` - 10%折扣，最低$50
- `SAVE20` - $20折扣，最低$100
- `WELCOME15` - 15%折扣，最低$30

---

### 3. 结算流程（P0）

**Step 1: 收货信息**
1. ✅ 购物车有商品，点击"结算"
2. ✅ 验证跳转到 `/checkout/shipping`
3. ✅ 填写收货信息表单
4. ✅ 勾选"保存为常用地址"
5. ✅ 点击"继续选择配送方式"

**Step 2: 配送方式**
1. ✅ 验证跳转到 `/checkout/shipping-method`
2. ✅ 检查3种配送方式
3. ✅ 选择"标准快递"
4. ✅ 验证运费显示
5. ✅ 点击"继续填写付款信息"

**Step 3: 付款信息**
1. ✅ 验证跳转到 `/checkout/payment`
2. ✅ 选择"信用卡"支付
3. ✅ 填写测试卡号：`4242 4242 4242 4242`
4. ✅ 有效期：`12/2025`
5. ✅ CVV：`123`
6. ✅ 勾选"同意条款"
7. ✅ 点击"确认支付"
8. ✅ 验证跳转到支付结果页

---

### 4. 支付结果页（P0）

**测试步骤：**
1. ✅ 完成支付流程
2. ✅ 验证跳转到 `/order-confirmation/[orderId]`
3. ✅ 检查"支付成功"提示
4. ✅ 检查订单号显示
5. ✅ 检查订单信息完整
6. ✅ 点击"查看订单详情"
7. ✅ 点击"继续逛逛"

---

### 5. 儿童生日专题页（P1）

**测试步骤：**
1. ✅ 访问 `/kids-birthday`
2. ✅ 检查页面标题和简介
3. ✅ 点击场景入口按钮（男孩/女孩/中性）
4. ✅ 使用主题筛选器
5. ✅ 检查主题卡片显示
6. ✅ 点击主题卡片跳转

---

### 6. 主题详情页（P1）

**测试步骤：**
1. ✅ 访问 `/themes/disney-princess`
2. ✅ 检查主题头部信息
3. ✅ 检查套餐推荐模块
4. ✅ 点击"一键购买"按钮
5. ✅ 验证商品加入购物车
6. ✅ 检查单品列表（按品类分组）
7. ✅ 检查相关主题推荐

---

### 7. 品类集合页（P1）

**测试步骤：**
1. ✅ 访问 `/categories/balloons`
2. ✅ 检查品类标题和描述
3. ✅ 检查商品展示
4. ✅ 检查搭配推荐模块（如有）
5. ✅ 点击"一键加购"按钮
6. ✅ 验证商品加入购物车

---

### 8. 帮助中心（P2）

**测试步骤：**
1. ✅ 访问 `/help`
2. ✅ 测试Tab切换：
   - FAQ
   - 退货政策
   - 配送说明
   - 联系我们
3. ✅ 在FAQ中搜索"shipping"
4. ✅ 检查搜索结果
5. ✅ 检查政策内容显示
6. ✅ 检查联系信息

---

### 9. 订单管理（P2）

**测试步骤：**
1. ✅ 访问 `/account/orders`
2. ✅ 检查订单列表显示
3. ✅ 使用状态筛选（如"待支付"）
4. ✅ 点击"查看详情"
5. ✅ 检查订单详情页信息完整
6. ✅ 返回订单列表
7. ✅ 测试取消订单（如有待支付订单）
8. ✅ 测试申请退货（如有已完成订单）

---

### 10. 地址管理（P2）

**测试步骤：**
1. ✅ 访问 `/account/addresses`
2. ✅ 点击"新增地址"
3. ✅ 填写地址信息：
   - 姓名：Test User
   - 地址：123 Test St
   - 城市：Test City
   - 邮编：12345
   - 国家：United States
4. ✅ 点击"保存"
5. ✅ 验证地址列表更新
6. ✅ 点击"编辑"
7. ✅ 修改地址信息
8. ✅ 点击"更新"
9. ✅ 点击"删除"
10. ✅ 确认删除

---

## 🔍 API测试（使用浏览器或Postman）

### 主题API
```bash
# 获取所有主题
GET http://localhost:3000/api/themes

# 获取热门主题
GET http://localhost:3000/api/themes?featured=true

# 按性别筛选
GET http://localhost:3000/api/themes?gender=girl

# 按年龄段筛选
GET http://localhost:3000/api/themes?ageGroup=3-5

# 获取主题详情
GET http://localhost:3000/api/themes/disney-princess
```

### 产品API
```bash
# 获取所有产品
GET http://localhost:3000/api/products

# 按品类筛选
GET http://localhost:3000/api/products?category=balloons

# 按主题筛选
GET http://localhost:0/api/products?theme=disney-princess
```

### 品类API
```bash
# 获取品类商品
GET http://localhost:3000/api/categories/balloons
GET http://localhost:3000/api/categories/decorations
```

### 优惠码API
```bash
# 应用优惠码（有效）
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "BIRTHDAY10",
  "cartTotal": 60
}

# 应用优惠码（无效）
POST http://localhost:3000/api/cart/apply-coupon
Content-Type: application/json

{
  "couponCode": "INVALID",
  "cartTotal": 60
}
```

### 订单API
```bash
# 获取订单列表
GET http://localhost:3000/api/orders?email=test@example.com

# 获取订单详情
GET http://localhost:3000/api/orders/ORD-1234567890

# 取消订单
POST http://localhost:3000/api/orders/ORD-1234567890
Content-Type: application/json

{
  "action": "cancel"
}
```

### 地址API
```bash
# 获取地址列表
GET http://localhost:3000/api/account/addresses?email=test@example.com

# 新增地址
POST http://localhost:3000/api/account/addresses
Content-Type: application/json

{
  "email": "test@example.com",
  "firstName": "Test",
  "lastName": "User",
  "addressLine1": "123 Test St",
  "city": "Test City",
  "postalCode": "12345",
  "country": "US"
}
```

### 帮助中心API
```bash
# 获取FAQ
GET http://localhost:3000/api/help/faq

# 获取政策
GET http://localhost:3000/api/help/policies?type=return
GET http://localhost:3000/api/help/policies?type=shipping
```

---

## 🐛 常见问题排查

### 1. 主题轮播不显示
- 检查 `data/themes.json` 文件是否存在
- 检查主题数据中是否有 `featured: true` 的主题
- 检查浏览器控制台是否有API错误

### 2. 优惠码不生效
- 确认购物车金额满足最低消费要求
- 检查优惠码是否过期
- 检查 `data/coupons.json` 文件

### 3. 订单创建失败
- 检查 `data/orders.json` 文件权限
- 检查表单数据是否完整
- 查看浏览器控制台错误信息

### 4. 地址管理不工作
- 检查 `data/addresses.json` 文件
- 确认email参数正确传递
- 检查API响应状态码

---

## 📝 测试数据准备

### 创建测试订单
完成一次完整的购买流程，订单会自动保存到 `data/orders.json`

### 创建测试地址
在地址管理页面添加地址，或通过API创建

### 测试优惠码
使用以下优惠码：
- `BIRTHDAY10` - 10%折扣（最低$50）
- `SAVE20` - $20折扣（最低$100）
- `WELCOME15` - 15%折扣（最低$30）

---

## ✅ 测试完成检查

- [ ] 所有P0功能测试通过
- [ ] 所有P1功能测试通过
- [ ] 所有P2功能测试通过
- [ ] API接口测试通过
- [ ] 页面跳转正常
- [ ] 表单提交正常
- [ ] 数据持久化正常
- [ ] 错误处理正常

---

**测试完成后，所有功能应正常工作！** 🎉

