# 产品配置完整指南

## 📋 目录
1. [产品字段说明](#产品字段说明)
2. [单个产品配置](#单个产品配置)
3. [批量导入产品](#批量导入产品)
4. [图片要求](#图片要求)
5. [产品配置示例](#产品配置示例)

---

## 📝 产品字段说明

### 必填字段

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `name` | String | 产品名称（英文） | "Disney Princess Party Package" |
| `price` | Number | 价格（USD） | 49.99 |
| `stock` | Number | 库存数量 | 100 |
| `category` | String | 产品分类 | "themePackages" |
| `status` | String | 产品状态 | "active" |

### 可选字段

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `description` | String | 产品描述（英文） | "Complete Disney Princess themed party package..." |
| `image` | String | 产品图片URL | "https://example.com/image.jpg" |
| `images` | Array | 多张产品图片 | `["url1", "url2"]` |
| `theme` | String | 关联主题ID | "disney-princess" |
| `featured` | Boolean | 是否在首页显示 | true |
| `attributes` | Object | 产品属性 | 见下方 |
| `estimatedDelivery` | Number | 预计配送天数 | 7 |
| `freeShipping` | Boolean | 是否免运费 | false |
| `weight` | Number | 重量（磅） | 2.5 |
| `dimensions` | Object | 尺寸 | `{length: 12, width: 8, height: 4}` |

### 产品属性 (attributes)

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `ageRange` | String | 适用年龄 | "3-8 years" |
| `size` | String | 尺寸 | "12-inch" |
| `material` | String | 材质 | "Premium Latex" |
| `certification` | String | 认证 | "ASTM, EN 71" |
| `color` | String | 颜色 | "Pink, Purple, Blue" |
| `quantity` | Number | 数量 | 12 |

### 产品分类代码

| 分类代码 | 分类名称 | 说明 |
|---------|---------|------|
| `themePackages` | 主题套餐 | 完整的主题派对套餐 |
| `balloons` | 气球 | 各种气球产品 |
| `decorations` | 装饰 | 装饰用品 |
| `tableware` | 餐具 | 餐具用品 |
| `interactiveProps` | 互动道具 | 游戏和互动道具 |
| `personalized` | 个性化定制 | 定制产品 |

### 产品状态

| 状态值 | 说明 |
|--------|------|
| `active` | 已发布（前台可见） |
| `draft` | 草稿（仅后台可见） |
| `archived` | 已归档（不显示） |

---

## 🖼️ 图片要求

### 图片格式
- **推荐格式**: JPG, PNG, WebP
- **最大文件大小**: 5MB
- **推荐分辨率**: 
  - 主图：1200x1200px（正方形）
  - 横幅图：1920x600px（横向）
  - 详情图：1200x800px（横向）

### 图片URL要求
- 必须是公开可访问的HTTPS URL
- 推荐使用CDN或图片托管服务：
  - Unsplash: `https://images.unsplash.com/photo-xxx`
  - Cloudinary: `https://res.cloudinary.com/xxx`
  - AWS S3: `https://s3.amazonaws.com/xxx`
  - 自托管: `https://yourdomain.com/images/xxx`

### 图片优化建议
- 使用WebP格式可减少文件大小
- 压缩图片以减少加载时间
- 使用CDN加速图片加载
- 为图片添加alt文本（在描述中说明）

---

## ✏️ 单个产品配置

### 通过管理后台添加

1. **访问产品管理页面**
   ```
   http://localhost:3000/admin/products
   ```

2. **点击"添加产品"按钮**

3. **填写产品信息**

   **基本信息：**
   ```
   产品名称: Disney Princess Party Package
   价格: 49.99
   库存: 100
   状态: active（已发布）
   ```

   **产品描述：**
   ```
   Complete Disney Princess themed party package including:
   - 1x Disney Princess Banner
   - 20x Princess Balloons
   - 1x Princess Tablecloth
   - 12x Princess Plates
   - 12x Princess Cups
   - 1x Princess Cake Topper
   
   Perfect for girls aged 3-8 years. All items are made from 
   premium materials and meet safety standards (ASTM, EN 71).
   ```

   **图片URL：**
   ```
   https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200
   ```

   **分类和主题：**
   ```
   分类: themePackages
   主题: disney-princess
   ```

   **产品属性：**
   ```
   适用年龄: 3-8 years
   尺寸: Standard Party Size
   材质: Premium Cardboard & Latex
   认证: ASTM, EN 71
   ```

4. **保存产品**

---

## 📦 批量导入产品

### 方法1: CSV批量导入（推荐）

#### CSV文件格式

创建文件 `products.csv`：

```csv
name,price,stock,category,status,description,image,theme,featured,ageRange,size,material,certification,estimatedDelivery,freeShipping
Disney Princess Party Package,49.99,100,themePackages,active,"Complete Disney Princess themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,disney-princess,true,"3-8 years",Standard Party Size,"Premium Cardboard & Latex","ASTM, EN 71",7,false
Unicorn Magic Party Package,59.99,50,themePackages,active,"Magical unicorn themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,unicorn,true,"3-8 years",Standard Party Size,"Premium Latex & Cardboard","ASTM, EN 71",7,true
Superhero Party Package,54.99,75,themePackages,active,"Superhero themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,superhero,true,"4-10 years",Standard Party Size,"Premium Materials","ASTM, EN 71",7,false
12-inch Balloons Pack,9.99,200,balloons,active,"Pack of 12 colorful balloons",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,,false,,"12-inch",Latex,"ASTM, EN 71",5,false
Party Banner,12.99,150,decorations,active,"Custom party banner",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,,false,,"6ft x 2ft",Cardboard,"ASTM",5,false
```

#### CSV字段说明

**必填字段：**
- `name` - 产品名称
- `price` - 价格（数字）
- `stock` - 库存（数字）
- `category` - 分类代码
- `status` - 状态（active/draft/archived）

**可选字段：**
- `description` - 描述（用双引号包裹，可包含逗号）
- `image` - 图片URL
- `theme` - 主题ID
- `featured` - 是否特色（true/false）
- `ageRange` - 适用年龄
- `size` - 尺寸
- `material` - 材质
- `certification` - 认证
- `estimatedDelivery` - 配送天数（数字）
- `freeShipping` - 免运费（true/false）

#### 使用批量导入功能

1. 访问 `/admin/products/import`
2. 上传CSV文件
3. 预览导入数据
4. 确认导入

### 方法2: JSON批量导入

#### JSON文件格式

创建文件 `products.json`：

```json
[
  {
    "name": "Disney Princess Party Package",
    "price": 49.99,
    "stock": 100,
    "category": "themePackages",
    "status": "active",
    "description": "Complete Disney Princess themed party package including banner, balloons, tablecloth, plates, cups, and cake topper. Perfect for girls aged 3-8 years.",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    "theme": "disney-princess",
    "featured": true,
    "attributes": {
      "ageRange": "3-8 years",
      "size": "Standard Party Size",
      "material": "Premium Cardboard & Latex",
      "certification": "ASTM, EN 71"
    },
    "estimatedDelivery": 7,
    "freeShipping": false
  },
  {
    "name": "Unicorn Magic Party Package",
    "price": 59.99,
    "stock": 50,
    "category": "themePackages",
    "status": "active",
    "description": "Magical unicorn themed party package with all decorations and accessories.",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    "theme": "unicorn",
    "featured": true,
    "attributes": {
      "ageRange": "3-8 years",
      "size": "Standard Party Size",
      "material": "Premium Latex & Cardboard",
      "certification": "ASTM, EN 71"
    },
    "estimatedDelivery": 7,
    "freeShipping": true
  }
]
```

---

## 📄 产品配置示例

### 示例1: 主题套餐产品

```json
{
  "name": "Disney Princess Party Package",
  "price": 49.99,
  "stock": 100,
  "category": "themePackages",
  "status": "active",
  "description": "Complete Disney Princess themed party package including:\n- 1x Disney Princess Banner\n- 20x Princess Balloons\n- 1x Princess Tablecloth\n- 12x Princess Plates\n- 12x Princess Cups\n- 1x Princess Cake Topper\n\nPerfect for girls aged 3-8 years. All items are made from premium materials and meet safety standards (ASTM, EN 71).",
  "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
  "theme": "disney-princess",
  "featured": true,
  "attributes": {
    "ageRange": "3-8 years",
    "size": "Standard Party Size",
    "material": "Premium Cardboard & Latex",
    "certification": "ASTM, EN 71",
    "quantity": 1
  },
  "estimatedDelivery": 7,
  "freeShipping": false,
  "weight": 2.5,
  "dimensions": {
    "length": 12,
    "width": 8,
    "height": 4
  }
}
```

### 示例2: 单个产品（气球）

```json
{
  "name": "12-inch Colorful Balloons Pack",
  "price": 9.99,
  "stock": 200,
  "category": "balloons",
  "status": "active",
  "description": "Pack of 12 high-quality latex balloons in assorted colors. Perfect for any party decoration.",
  "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
  "featured": false,
  "attributes": {
    "size": "12-inch",
    "material": "Premium Latex",
    "color": "Assorted Colors",
    "quantity": 12,
    "certification": "ASTM, EN 71"
  },
  "estimatedDelivery": 5,
  "freeShipping": false
}
```

### 示例3: 装饰产品

```json
{
  "name": "Custom Party Banner",
  "price": 12.99,
  "stock": 150,
  "category": "decorations",
  "status": "active",
  "description": "Customizable party banner. Size: 6ft x 2ft. Made from premium cardboard. Perfect for birthday parties and celebrations.",
  "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
  "featured": false,
  "attributes": {
    "size": "6ft x 2ft",
    "material": "Premium Cardboard",
    "certification": "ASTM"
  },
  "estimatedDelivery": 5,
  "freeShipping": false
}
```

---

## 📊 产品描述模板

### 主题套餐描述模板

```
[主题名称] Party Package

Complete [主题名称] themed party package including:
- [数量]x [物品1]
- [数量]x [物品2]
- [数量]x [物品3]
- [数量]x [物品4]
- [数量]x [物品5]

Perfect for [年龄段]. All items are made from premium materials and meet safety standards ([认证标准]).

Key Features:
• [特色1]
• [特色2]
• [特色3]

Package Contents:
• [详细列表]

Safety & Quality:
• Certified safe materials
• [具体认证]
• Age-appropriate design
```

### 单个产品描述模板

```
[产品名称]

[简短描述，1-2句话]

Features:
• [特点1]
• [特点2]
• [特点3]

Specifications:
• Size: [尺寸]
• Material: [材质]
• Color: [颜色]
• Quantity: [数量]

Perfect for:
• [使用场景1]
• [使用场景2]

Safety:
• [安全认证]
• [安全说明]
```

---

## ✅ 产品配置检查清单

### 必填项检查
- [ ] 产品名称已填写
- [ ] 价格已设置（> 0）
- [ ] 库存已设置（>= 0）
- [ ] 分类已选择
- [ ] 状态已设置

### 推荐项检查
- [ ] 产品描述已填写（至少50字）
- [ ] 产品图片URL已填写
- [ ] 产品属性已填写
- [ ] 主题关联（如果是主题套餐）
- [ ] 特色产品标记（如果要在首页显示）

### 质量检查
- [ ] 描述无拼写错误
- [ ] 图片URL可访问
- [ ] 价格合理
- [ ] 库存数量准确
- [ ] 属性信息完整

---

## 🚀 快速开始

### 1. 准备产品数据

**选项A: 使用CSV文件**
- 下载CSV模板
- 填写产品信息
- 使用批量导入功能

**选项B: 使用JSON文件**
- 下载JSON模板
- 填写产品信息
- 使用批量导入功能

**选项C: 手动添加**
- 访问 `/admin/products/new`
- 逐个添加产品

### 2. 批量导入步骤

1. 访问 `/admin/products/import`
2. 选择文件（CSV或JSON）
3. 预览导入数据
4. 确认导入
5. 检查导入结果

### 3. 验证产品

1. 访问 `/admin/products` 查看产品列表
2. 访问前台查看产品显示
3. 测试产品详情页
4. 测试添加到购物车

---

## 📞 需要帮助？

如果遇到问题：
1. 检查产品字段格式
2. 验证图片URL可访问
3. 检查必填字段是否完整
4. 查看错误提示信息

---

**准备好开始配置产品了吗？访问 `/admin/products` 开始吧！**

