# 完整测试指南

## 📋 目录

1. [快速开始](#快速开始)
2. [产品配置指南](#产品配置指南)
3. [功能测试清单](#功能测试清单)
4. [API测试](#api测试)
5. [上线前测试](#上线前测试)

---

## 🚀 快速开始

### 1. 启动开发服务器

```bash
npm install
npm run dev
```

访问：http://localhost:3000

### 2. 访问管理后台

访问：http://localhost:3000/admin

---

## 📦 产品配置指南

### 添加新产品

1. **访问产品管理页面**
   - 打开浏览器访问：`http://localhost:3000/admin/products`
   - 点击"添加产品"按钮

2. **填写产品信息**

   **基本信息：**
   - 产品名称\*：例如 "Disney Princess Party Package"
   - 价格 (USD)\*：例如 49.99
   - 库存\*：例如 100
   - 状态：选择 "active"（已发布）或 "draft"（草稿）

   **产品描述：**
   - 描述：详细的产品描述
   - 图片URL：产品图片链接（可以使用Unsplash或其他图片服务）

   **分类和主题：**
   - 分类：选择产品分类
     - `themePackages` - 主题套餐
     - `balloons` - 气球
     - `decorations` - 装饰
     - `tableware` - 餐具
     - `games-gifts` - 游戏/礼品
     - `pinatas` - 彩罐
   - 主题：输入主题ID（例如 "disney-princess"）

   **产品属性：**
   - 年龄范围：例如 "3-8 years"
   - 尺寸：例如 "Standard Party Size"
   - 材质：例如 "Premium Cardboard & Latex"
   - 认证：例如 "ASTM, EN 71"

   **其他设置：**
   - 预计配送天数：例如 7
   - 免运费：勾选如果产品免运费
   - 特色产品：勾选如果要在首页显示

3. **保存产品**
   - 点击"保存产品"按钮
   - 产品将立即出现在产品列表中

### 编辑产品

1. 在产品列表中找到要编辑的产品
2. 点击"编辑"按钮
3. 修改产品信息
4. 点击"保存"

### 删除产品

1. 在产品列表中找到要删除的产品
2. 点击"删除"按钮
3. 确认删除操作

### 产品配置示例

```json
{
  "name": "Unicorn Magic Party Package",
  "price": 59.99,
  "description": "Complete unicorn themed party package with balloons, decorations, and tableware",
  "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
  "category": "themePackages",
  "theme": "unicorn",
  "stock": 50,
  "status": "active",
  "featured": true,
  "attributes": {
    "ageRange": "3-8 years",
    "certification": ["ASTM", "EN 71"]
  },
  "estimatedDelivery": 7,
  "freeShipping": true
}
```

---

## ✅ 功能测试清单

### 1. 首页功能测试

#### TC-HOME-001: 首页加载

- [ ] 访问首页 `/`
- [ ] 检查Hero Banner是否显示
- [ ] 检查Featured Products是否显示
- [ ] 检查主题轮播是否显示
- [ ] 检查年龄段入口是否显示
- [ ] 检查品类快捷入口是否显示

#### TC-HOME-002: Featured Products

- [ ] 检查Featured Products区域
- [ ] 验证显示的产品数量（最多6个）
- [ ] 点击产品卡片跳转到产品详情页
- [ ] 验证产品信息正确显示

#### TC-HOME-003: 主题轮播

- [ ] 检查主题卡片显示
- [ ] 点击左右箭头切换主题
- [ ] 点击主题卡片跳转到主题详情页

#### TC-HOME-004: 年龄段入口

- [ ] 点击"1岁"入口
- [ ] 验证跳转到主题筛选页
- [ ] 测试其他年龄段入口

#### TC-HOME-005: 品类入口

- [ ] 点击各个品类入口
- [ ] 验证跳转到对应品类页

### 2. 产品功能测试

#### TC-PRODUCT-001: 产品列表

- [ ] 访问 `/products` 或通过分类访问
- [ ] 检查产品列表显示
- [ ] 验证产品信息（名称、价格、图片）

#### TC-PRODUCT-002: 产品详情

- [ ] 点击产品进入详情页
- [ ] 检查产品图片轮播
- [ ] 检查产品信息显示
- [ ] 检查"加入购物车"功能
- [ ] 检查数量选择器

#### TC-PRODUCT-003: 添加到购物车

- [ ] 选择产品数量
- [ ] 点击"加入购物车"
- [ ] 验证购物车图标显示数量
- [ ] 验证Toast提示显示

### 3. 购物车功能测试

#### TC-CART-001: 购物车页面

- [ ] 访问 `/cart`
- [ ] 检查购物车商品列表
- [ ] 检查商品信息显示
- [ ] 检查价格计算

#### TC-CART-002: 修改数量

- [ ] 修改商品数量
- [ ] 验证总价更新
- [ ] 验证小计正确

#### TC-CART-003: 删除商品

- [ ] 点击删除按钮
- [ ] 验证商品从购物车移除
- [ ] 验证总价更新

#### TC-CART-004: 优惠码

- [ ] 输入优惠码 "BIRTHDAY10"
- [ ] 点击"应用优惠码"
- [ ] 验证折扣显示
- [ ] 验证总价更新
- [ ] 测试无效优惠码

### 4. 结算流程测试

#### TC-CHECKOUT-001: 收货信息

- [ ] 从购物车点击"结算"
- [ ] 填写收货信息表单
- [ ] 验证必填字段验证
- [ ] 点击"继续"

#### TC-CHECKOUT-002: 配送方式

- [ ] 选择配送方式（标准/加急/次日达）
- [ ] 验证运费计算
- [ ] 验证预计送达时间
- [ ] 点击"继续"

#### TC-CHECKOUT-003: 支付信息

- [ ] 填写支付信息
- [ ] 验证表单验证
- [ ] 点击"完成订单"
- [ ] 验证订单创建成功

#### TC-CHECKOUT-004: 订单确认

- [ ] 检查订单确认页
- [ ] 验证订单信息显示
- [ ] 验证订单号生成
- [ ] 检查"查看订单"链接

### 5. 订单管理测试

#### TC-ORDER-001: 订单列表

- [ ] 访问 `/account/orders`
- [ ] 检查订单列表显示
- [ ] 验证订单状态显示
- [ ] 验证订单信息正确

#### TC-ORDER-002: 订单详情

- [ ] 点击订单查看详情
- [ ] 验证订单信息完整
- [ ] 验证商品列表
- [ ] 验证价格明细

#### TC-ORDER-003: 订单追踪

- [ ] 访问 `/tracking`
- [ ] 输入追踪号或邮箱
- [ ] 验证追踪信息显示
- [ ] 检查追踪历史

### 6. 管理后台测试

#### TC-ADMIN-001: 产品管理

- [ ] 访问 `/admin/products`
- [ ] 检查产品列表
- [ ] 测试搜索功能
- [ ] 测试添加产品
- [ ] 测试编辑产品
- [ ] 测试删除产品

#### TC-ADMIN-002: 订单管理

- [ ] 访问 `/admin/orders`
- [ ] 检查订单列表
- [ ] 测试订单筛选
- [ ] 测试订单详情查看

#### TC-ADMIN-003: 备份管理

- [ ] 访问 `/admin/backup`
- [ ] 创建备份
- [ ] 检查备份列表
- [ ] 测试备份恢复
- [ ] 测试备份下载

#### TC-ADMIN-004: 系统设置

- [ ] 访问 `/admin/settings`
- [ ] 修改站点名称
- [ ] 修改时区
- [ ] 修改默认语言
- [ ] 保存设置
- [ ] 验证设置保存成功

#### TC-ADMIN-005: 销售分析

- [ ] 访问 `/admin/analytics`
- [ ] 检查销售趋势图表
- [ ] 检查产品销售排行
- [ ] 检查主题销售数据
- [ ] 测试时间范围筛选

### 7. 主题功能测试

#### TC-THEME-001: 主题列表

- [ ] 访问 `/themes`
- [ ] 检查主题列表显示
- [ ] 测试性别筛选
- [ ] 测试年龄段筛选

#### TC-THEME-002: 主题详情

- [ ] 点击主题进入详情页
- [ ] 检查主题信息显示
- [ ] 检查套餐推荐
- [ ] 测试"一键购买"功能
- [ ] 检查产品列表

### 8. 分类功能测试

#### TC-CATEGORY-001: 分类页面

- [ ] 访问 `/categories/balloons`
- [ ] 检查产品列表
- [ ] 检查分类信息
- [ ] 测试产品点击

### 9. 帮助中心测试

#### TC-HELP-001: 帮助页面

- [ ] 访问 `/help`
- [ ] 检查FAQ标签
- [ ] 检查政策标签
- [ ] 测试搜索功能
- [ ] 检查联系信息

### 10. 博客功能测试

#### TC-BLOG-001: 博客列表

- [ ] 访问 `/blog`
- [ ] 检查博客文章列表
- [ ] 检查特色文章显示
- [ ] 测试文章点击

#### TC-BLOG-002: 博客详情

- [ ] 点击文章进入详情页
- [ ] 检查文章内容显示
- [ ] 检查分类和标签
- [ ] 检查作者和日期

---

## 🔌 API测试

### 产品API测试

#### GET /api/products

```bash
# 获取所有产品
curl http://localhost:3000/api/products

# 获取特色产品
curl http://localhost:3000/api/products?featured=true&limit=6

# 按分类筛选
curl http://localhost:3000/api/products?category=balloons

# 按主题筛选
curl http://localhost:3000/api/products?theme=disney-princess
```

#### POST /api/admin/products

```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 29.99,
    "description": "Test description",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
    "category": "balloons",
    "stock": 100,
    "status": "active"
  }'
```

### 订单API测试

#### GET /api/orders

```bash
# 获取所有订单
curl http://localhost:3000/api/orders

# 按状态筛选
curl http://localhost:3000/api/orders?status=paid

# 按邮箱筛选
curl http://localhost:3000/api/orders?email=test@example.com
```

#### POST /api/orders

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "items": [
      {
        "id": "prod-1",
        "name": "Test Product",
        "price": 29.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "firstName": "Test",
      "lastName": "User",
      "addressLine1": "123 Test St",
      "city": "Test City",
      "postalCode": "12345",
      "country": "US"
    },
    "pricing": {
      "subtotal": 59.98,
      "discount": 0,
      "shipping": 9.99,
      "tax": 0,
      "total": 69.97
    }
  }'
```

### 优惠码API测试

#### POST /api/cart/apply-coupon

```bash
# 应用有效优惠码
curl -X POST http://localhost:3000/api/cart/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "BIRTHDAY10",
    "cartTotal": 60
  }'

# 应用无效优惠码
curl -X POST http://localhost:3000/api/cart/apply-coupon \
  -H "Content-Type: application/json" \
  -d '{
    "couponCode": "INVALID",
    "cartTotal": 60
  }'
```

### 备份API测试

#### POST /api/admin/backup

```bash
# 创建备份
curl -X POST http://localhost:3000/api/admin/backup

# 获取备份列表
curl http://localhost:3000/api/admin/backup

# 恢复备份
curl -X POST http://localhost:3000/api/admin/backup/backup-2024-01-01T00-00-00-000Z

# 下载备份
curl http://localhost:3000/api/admin/backup/backup-2024-01-01T00-00-00-000Z/download
```

### 物流追踪API测试

#### POST /api/admin/shipping/tracking

```bash
# 更新订单追踪
curl -X POST http://localhost:3000/api/admin/shipping/tracking \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-1234567890",
    "trackingNumber": "DHL-1234567890",
    "carrier": "DHL"
  }'

# 查询追踪信息
curl http://localhost:3000/api/admin/shipping/tracking?trackingNumber=DHL-1234567890
```

---

## 🎯 上线前测试流程

### 阶段1：功能完整性测试（1-2天）

1. **核心流程测试**
   - [ ] 完整购物流程（浏览→加购→结算→支付→订单）
   - [ ] 订单管理流程
   - [ ] 产品管理流程

2. **边界情况测试**
   - [ ] 空购物车结算
   - [ ] 库存为0的产品
   - [ ] 无效优惠码
   - [ ] 无效订单号查询

3. **数据一致性测试**
   - [ ] 产品价格计算
   - [ ] 订单总价计算
   - [ ] 优惠码折扣计算
   - [ ] 运费计算

### 阶段2：兼容性测试（1天）

1. **浏览器测试**
   - [ ] Chrome（最新版）
   - [ ] Firefox（最新版）
   - [ ] Safari（最新版）
   - [ ] Edge（最新版）

2. **设备测试**
   - [ ] 桌面端（1920x1080）
   - [ ] 平板（iPad）
   - [ ] 手机（iPhone, Android）

3. **响应式测试**
   - [ ] 检查所有页面在不同屏幕尺寸下的显示
   - [ ] 检查导航菜单在移动端的表现
   - [ ] 检查表单在移动端的可用性

### 阶段3：性能测试（1天）

1. **页面加载速度**
   - [ ] 首页加载时间 < 2秒
   - [ ] 产品详情页加载时间 < 2秒
   - [ ] API响应时间 < 500ms

2. **图片优化**
   - [ ] 检查图片懒加载
   - [ ] 检查图片格式（WebP/AVIF）
   - [ ] 检查图片大小

3. **API性能**
   - [ ] 测试并发请求
   - [ ] 测试大数据量查询
   - [ ] 检查内存使用

### 阶段4：安全测试（1天）

1. **输入验证**
   - [ ] SQL注入测试
   - [ ] XSS攻击测试
   - [ ] CSRF保护测试

2. **API安全**
   - [ ] Rate limiting测试
   - [ ] 未授权访问测试
   - [ ] 数据验证测试

3. **数据安全**
   - [ ] 敏感信息加密
   - [ ] 支付信息安全
   - [ ] 用户数据保护

---

## 📊 测试报告模板

### 测试执行报告

**测试日期：** [日期]
**测试人员：** [姓名]
**测试环境：** [环境信息]

#### 功能测试结果

| 功能模块 | 测试用例数 | 通过 | 失败 | 通过率 |
| -------- | ---------- | ---- | ---- | ------ |
| 首页功能 | 5          | 5    | 0    | 100%   |
| 产品功能 | 3          | 3    | 0    | 100%   |
| 购物车   | 4          | 4    | 0    | 100%   |
| 结算流程 | 4          | 4    | 0    | 100%   |
| 订单管理 | 3          | 3    | 0    | 100%   |
| 管理后台 | 5          | 5    | 0    | 100%   |

#### 发现的问题

**高优先级：**

1. [问题描述]
   - 重现步骤：...
   - 预期结果：...
   - 实际结果：...

**中优先级：**

1. [问题描述]

**低优先级：**

1. [问题描述]

#### 性能测试结果

- 首页加载时间：1.2s ✅
- 产品详情页：1.5s ✅
- API平均响应：350ms ✅

#### 兼容性测试结果

- Chrome：✅ 通过
- Firefox：✅ 通过
- Safari：✅ 通过
- Edge：✅ 通过
- 移动端：✅ 通过

---

## 🛠️ 测试工具推荐

### API测试

- **Postman** - API测试和文档
- **Insomnia** - 轻量级API客户端
- **curl** - 命令行测试

### 浏览器测试

- **Chrome DevTools** - 调试和性能分析
- **Lighthouse** - 性能、SEO、可访问性测试
- **BrowserStack** - 跨浏览器测试

### 自动化测试（可选）

- **Playwright** - E2E测试
- **Cypress** - E2E测试
- **Jest** - 单元测试

---

## 📝 产品配置快速参考

### 产品分类代码

- `themePackages` - 主题套餐
- `balloons` - 气球
- `decorations` - 装饰
- `tableware` - 餐具
- `games-gifts` - 游戏/礼品
- `pinatas` - 彩罐

### 产品状态

- `active` - 已发布（前台可见）
- `draft` - 草稿（仅后台可见）
- `archived` - 已归档

### 主题ID参考

查看 `data/themes.json` 获取可用主题ID

---

## ✅ 测试检查清单总结

### 必须测试（上线前）

- [x] 所有核心功能
- [x] 支付流程（需要真实支付网关）
- [x] 订单管理
- [x] 产品管理
- [x] 数据备份和恢复

### 推荐测试

- [ ] 性能优化
- [ ] 安全测试
- [ ] 兼容性测试
- [ ] 压力测试

---

**当前状态：所有核心功能已完成，可以开始配置产品和测试！**
