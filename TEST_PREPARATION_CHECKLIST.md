# 📋 测试准备清单

## ✅ 测试前需要准备的文件

### 1. 产品数据文件（必需）

#### 选项A：使用现有示例数据（快速开始）

**项目已包含示例数据**：

- ✅ `data/products.json` - 已有8个示例产品
- ✅ `data/themes.json` - 已有8个主题

**可以直接开始测试，无需准备！**

---

#### 选项B：准备自己的产品数据

### 📄 产品数据文件格式

#### 方法1：CSV文件（推荐批量导入）

**文件要求**：

- 文件名：`products.csv`
- 编码：UTF-8
- 格式：CSV（逗号分隔）

**CSV模板**：

```csv
name,price,stock,category,status,description,image,theme,featured,ageRange,size,material,certification,estimatedDelivery,freeShipping
Disney Princess Party Package,49.99,100,themePackages,active,"Complete Disney Princess themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,disney-princess,true,"3-8 years",Standard Party Size,"Premium Cardboard & Latex","ASTM, EN 71",7,false
Unicorn Magic Party Package,59.99,50,themePackages,active,"Magical unicorn themed party package",https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200,unicorn,true,"3-8 years",Standard Party Size,"Premium Latex & Cardboard","ASTM, EN 71",7,true
```

**必填字段**：

- `name` - 产品名称（英文）
- `price` - 价格（数字，USD）
- `stock` - 库存（数字）
- `category` - 分类代码（见下方）
- `status` - 状态（active/draft/archived）

**可选字段**：

- `description` - 产品描述（用双引号包裹）
- `image` - 图片URL
- `theme` - 主题ID
- `featured` - 是否特色（true/false）
- `ageRange` - 适用年龄
- `size` - 尺寸
- `material` - 材质
- `certification` - 认证
- `estimatedDelivery` - 配送天数
- `freeShipping` - 免运费（true/false）

---

#### 方法2：JSON文件

**文件要求**：

- 文件名：`products.json`
- 编码：UTF-8
- 格式：JSON数组

**JSON模板**：

```json
[
  {
    "name": "Disney Princess Party Package",
    "price": 49.99,
    "stock": 100,
    "category": "themePackages",
    "status": "active",
    "description": "Complete Disney Princess themed party package including banner, balloons, tablecloth, plates, cups, and cake topper.",
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
  }
]
```

---

### 2. 产品图片（推荐）

#### 图片格式要求

**支持的格式**：

- ✅ JPEG / JPG
- ✅ PNG
- ✅ WebP（推荐，文件更小）

**文件大小限制**：

- 最大：5MB
- 推荐：< 1MB（优化后）

**分辨率要求**：

| 用途           | 推荐尺寸    | 说明                         |
| -------------- | ----------- | ---------------------------- |
| **产品主图**   | 1200x1200px | 正方形，用于产品卡片和详情页 |
| **产品横幅**   | 1920x600px  | 横向，用于产品详情页横幅     |
| **产品详情图** | 1200x800px  | 横向，用于产品详情说明       |

**图片优化建议**：

- ✅ 使用WebP格式可减少30-50%文件大小
- ✅ 压缩图片以减少加载时间
- ✅ 使用CDN加速图片加载
- ✅ 为图片添加alt文本（在描述中说明）

---

#### 图片获取方式

**选项1：使用图片URL（推荐）**

**免费图片资源**：

- Unsplash: `https://images.unsplash.com/photo-xxx`
- Pexels: `https://images.pexels.com/photos/xxx`
- Pixabay: `https://pixabay.com/photos/xxx`

**要求**：

- ✅ 必须是公开可访问的HTTPS URL
- ✅ 图片必须可以正常加载
- ✅ 推荐使用CDN或图片托管服务

**示例URL**：

```
https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200
```

---

**选项2：上传图片文件**

**上传方式**：

1. 访问管理后台：`/admin/images`
2. 拖拽图片文件到上传区域
3. 选择图片类型（product/banner/logo）
4. 上传后获取URL

**存储位置**：

- 开发环境：`public/uploads/`（本地存储）
- 生产环境：Cloudinary（如果已配置）

**图片命名建议**：

- 使用有意义的文件名：`disney-princess-package.jpg`
- 避免特殊字符和空格
- 使用小写字母和连字符

---

### 3. 产品分类代码

**可用的分类代码**：

| 分类代码           | 分类名称   | 说明               |
| ------------------ | ---------- | ------------------ |
| `themePackages`    | 主题套餐   | 完整的主题派对套餐 |
| `balloons`         | 气球       | 各种气球产品       |
| `decorations`      | 装饰       | 装饰用品           |
| `tableware`        | 餐具       | 餐具用品           |
| `interactiveProps` | 互动道具   | 游戏和互动道具     |
| `personalized`     | 个性化定制 | 定制产品           |
| `pinatas`          | 皮纳塔     | 皮纳塔产品         |
| `games-gifts`      | 游戏礼品   | 游戏和礼品         |

---

### 4. 主题ID（可选）

**可用的主题ID**（来自 `data/themes.json`）：

- `disney-princess` - Disney Princess
- `superhero` - Superhero
- `unicorn` - Unicorn
- `dinosaur` - Dinosaur
- `mermaid` - Mermaid
- `princess` - Princess
- `marvel` - Marvel
- `space` - Space

**如果产品关联主题，使用对应的主题ID。**

---

## 🚀 快速开始测试（无需准备文件）

### 方法1：使用现有示例数据（最快）

**步骤**：

1. ✅ 启动开发服务器：`npm run dev`
2. ✅ 访问：`http://localhost:3000`
3. ✅ 查看首页，已有示例产品显示
4. ✅ 访问：`http://localhost:3000/admin/products` 查看产品列表

**无需准备任何文件！**

---

### 方法2：通过管理后台添加产品

**步骤**：

1. 登录管理后台：`http://localhost:3000/admin/login`
2. 访问产品管理：`http://localhost:3000/admin/products`
3. 点击"添加产品"
4. 填写产品信息（可以使用示例图片URL）
5. 保存

**图片URL示例**（可直接使用）：

```
https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200
https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400
```

---

### 方法3：批量导入产品

**步骤**：

1. 准备CSV或JSON文件（见上方模板）
2. 访问：`http://localhost:3000/admin/products/import`
3. 上传文件
4. 预览导入数据
5. 确认导入

---

## 📋 测试准备检查清单

### 必需项（如果没有示例数据）

- [ ] 产品数据文件（CSV或JSON）
- [ ] 至少3-5个产品用于测试
- [ ] 产品图片URL或图片文件

### 推荐项

- [ ] 产品描述（至少50字）
- [ ] 产品属性（年龄、尺寸、材质等）
- [ ] 主题关联（如果是主题套餐）
- [ ] 特色产品标记（至少2-3个）

### 可选项

- [ ] 多张产品图片
- [ ] 产品视频URL
- [ ] 产品规格说明
- [ ] 配送信息

---

## 🎯 最小测试数据集

**如果只想快速测试，最少需要：**

1. **3个产品**（用于测试产品列表和详情）
   - 1个主题套餐（featured: true）
   - 1个普通产品
   - 1个不同分类的产品

2. **产品必填字段**：
   - name（产品名称）
   - price（价格）
   - stock（库存）
   - category（分类）
   - status（状态：active）

3. **产品图片**：
   - 每个产品至少1张图片URL

**示例最小数据集**：

```json
[
  {
    "name": "Test Product 1",
    "price": 29.99,
    "stock": 50,
    "category": "themePackages",
    "status": "active",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200",
    "featured": true
  },
  {
    "name": "Test Product 2",
    "price": 19.99,
    "stock": 100,
    "category": "balloons",
    "status": "active",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200"
  },
  {
    "name": "Test Product 3",
    "price": 15.99,
    "stock": 75,
    "category": "decorations",
    "status": "active",
    "image": "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200"
  }
]
```

---

## 📝 文件准备总结

### ✅ 不需要准备（项目已包含）

- ✅ 示例产品数据（8个产品）
- ✅ 示例主题数据（8个主题）
- ✅ 产品配置指南文档
- ✅ 批量导入模板

### ⚠️ 可选准备（如果想使用自己的数据）

- ⚠️ 产品数据文件（CSV或JSON）
- ⚠️ 产品图片（文件或URL）
- ⚠️ 产品描述文档

### 🎯 推荐做法

**第一次测试**：

- ✅ 使用现有示例数据
- ✅ 无需准备任何文件
- ✅ 直接开始测试

**后续配置**：

- 📝 准备自己的产品数据
- 📝 准备产品图片
- 📝 使用批量导入功能

---

## 🚀 开始测试

### 步骤1：启动服务器

```bash
npm run dev
```

### 步骤2：访问网站

- 前台：`http://localhost:3000`
- 后台：`http://localhost:3000/admin/login`

### 步骤3：查看示例数据

- 产品列表：`http://localhost:3000/admin/products`
- 首页展示：`http://localhost:3000`

---

## 📚 相关文档

- `PRODUCT_CONFIGURATION_GUIDE.md` - 详细的产品配置指南
- `QUICK_START.md` - 快速开始指南
- `TESTING_GUIDE.md` - 完整测试指南

---

**总结：项目已包含示例数据，可以直接开始测试，无需准备文件！** 🎉

**如果想使用自己的数据，准备CSV/JSON文件和图片URL即可。**
