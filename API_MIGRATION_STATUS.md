# API路由迁移状态

## ✅ 已迁移到存储适配器

以下API路由已更新为使用 `lib/storage-adapter.ts`：

1. ✅ `app/api/admin/products/route.ts` - 产品管理
2. ✅ `app/api/orders/route.ts` - 订单列表
3. ✅ `app/api/orders/[id]/route.ts` - 订单详情
4. ✅ `app/api/checkout/payment/route.ts` - 支付处理（包括库存更新）

---

## ⚠️ 需要迁移的API路由

以下API路由仍使用文件系统，需要迁移：

### 高优先级（核心功能）
- [ ] `app/api/admin/products/[id]/route.ts` - 产品详情/更新
- [ ] `app/api/admin/coupons/route.ts` - 优惠券管理
- [ ] `app/api/admin/coupons/[code]/route.ts` - 优惠券详情
- [ ] `app/api/cart/save/route.ts` - 购物车保存
- [ ] `app/api/cart/recover/route.ts` - 购物车恢复

### 中优先级（管理功能）
- [ ] `app/api/admin/forms/route.ts` - 表单管理
- [ ] `app/api/admin/forms/[id]/route.ts` - 表单详情
- [ ] `app/api/admin/pages/route.ts` - 页面管理
- [ ] `app/api/admin/pages/[id]/route.ts` - 页面详情
- [ ] `app/api/admin/menus/route.ts` - 菜单管理
- [ ] `app/api/admin/menus/[id]/route.ts` - 菜单详情
- [ ] `app/api/admin/faq/route.ts` - FAQ管理
- [ ] `app/api/admin/settings/route.ts` - 系统设置
- [ ] `app/api/admin/settings/theme/route.ts` - 主题设置

### 低优先级（辅助功能）
- [ ] `app/api/blog/posts/route.ts` - 博客文章
- [ ] `app/api/blog/posts/[id]/route.ts` - 博客详情
- [ ] `app/api/admin/reviews/route.ts` - 评价管理
- [ ] `app/api/products/[id]/reviews/route.ts` - 产品评价
- [ ] `app/api/account/addresses/route.ts` - 地址管理
- [ ] `app/api/account/addresses/[id]/route.ts` - 地址详情
- [ ] `app/api/admin/inventory/adjust/route.ts` - 库存调整
- [ ] `app/api/admin/suppliers/route.ts` - 供应商管理
- [ ] `app/api/admin/suppliers/[id]/route.ts` - 供应商详情
- [ ] `app/api/forms/[id]/submit/route.ts` - 表单提交
- [ ] `app/api/admin/backup/route.ts` - 备份管理
- [ ] `app/api/admin/import/route.ts` - 数据导入

---

## 🔧 迁移方法

### 步骤1: 替换导入
```typescript
// 之前
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'filename.json');

// 之后
import { getData, saveData } from '@/lib/storage-adapter';
```

### 步骤2: 替换读取函数
```typescript
// 之前
async function getData() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 之后
async function getData() {
  return await getData<any[]>('filename.json', []);
}
```

### 步骤3: 替换保存函数
```typescript
// 之前
async function saveData(data: any[]) {
  await ensureDataDir();
  await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
}

// 之后
async function saveData(data: any[]) {
  await saveData('filename.json', data);
}
```

### 步骤4: 删除不需要的代码
- 删除 `ensureDataDir()` 函数
- 删除 `DATA_DIR` 和 `FILE_PATH` 常量
- 删除 `fs` 和 `path` 导入（如果不再需要）

---

## 📝 注意事项

1. **文件路径**: 存储适配器使用文件名（如 `'products.json'`），而不是完整路径
2. **默认值**: `getData` 函数需要提供默认值（如 `[]` 或 `{}`）
3. **类型**: 使用TypeScript类型确保类型安全
4. **错误处理**: 存储适配器已包含错误处理，无需额外try-catch

---

## 🚀 快速迁移脚本

可以使用以下命令查找需要迁移的文件：
```bash
grep -r "fs.writeFile" app/api --include="*.ts"
```

---

## ✅ 迁移完成检查

迁移后，确保：
- [ ] 代码可以正常编译
- [ ] 功能测试通过
- [ ] 数据可以正常读写
- [ ] 在本地和Vercel环境都能正常工作


