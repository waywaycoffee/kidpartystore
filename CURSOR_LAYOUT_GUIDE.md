# Cursor 界面布局配置指南

## 📋 已创建的配置文件

我已经为你创建了以下 VS Code 风格的配置文件：

1. **`.vscode/settings.json`** - 工作区设置（布局、编辑器、文件等）
2. **`.vscode/keybindings.json`** - 快捷键配置
3. **`.vscode/extensions.json`** - 推荐扩展列表
4. **`.vscode/launch.json`** - 调试配置
5. **`.vscode/tasks.json`** - 任务配置

## 🚀 快速应用设置

### 方法 1：自动应用（推荐）

1. **重新加载窗口**
   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
   - 输入 `Reload Window` 并选择
   - 或者直接关闭并重新打开 Cursor

2. **检查设置是否生效**
   - 侧边栏应该在左侧
   - 面板应该在底部
   - 编辑器标签应该在顶部

### 方法 2：手动调整布局

如果自动应用不生效，可以手动调整：

1. **调整侧边栏位置**
   - 右键点击侧边栏
   - 选择 "Move Side Bar" → "Left"

2. **调整面板位置**
   - 右键点击底部面板
   - 选择 "Move Panel" → "Bottom"

3. **重置视图布局**
   - 按 `Ctrl+Shift+P`
   - 输入 `View: Reset View Locations`
   - 选择执行

## 🎨 主要布局设置说明

### 侧边栏（左侧）
- ✅ 文件资源管理器
- ✅ 搜索
- ✅ 源代码管理（Git）
- ✅ 运行和调试
- ✅ 扩展

### 面板（底部）
- ✅ 终端
- ✅ 问题
- ✅ 输出
- ✅ 调试控制台

### 编辑器区域
- ✅ 标签页在顶部
- ✅ 支持多编辑器分组
- ✅ 预览模式关闭（双击文件直接打开）

## ⌨️ 常用快捷键

| 功能 | Windows/Linux | Mac |
|------|--------------|-----|
| 打开文件 | `Ctrl+P` | `Cmd+P` |
| 命令面板 | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| 切换侧边栏 | `Ctrl+B` | `Cmd+B` |
| 切换终端 | `Ctrl+\`` | `Ctrl+\`` |
| 切换面板 | `Ctrl+J` | `Cmd+J` |
| 分割编辑器 | `Ctrl+\` | `Cmd+\` |
| 格式化代码 | `Shift+Alt+F` | `Shift+Option+F` |
| 切换注释 | `Ctrl+/` | `Cmd+/` |

## 🔧 自定义调整

### 调整字体大小

在 `.vscode/settings.json` 中修改：

```json
{
  "editor.fontSize": 14,  // 编辑器字体大小
  "terminal.integrated.fontSize": 13  // 终端字体大小
}
```

### 调整主题

```json
{
  "workbench.colorTheme": "Default Dark+",  // 深色主题
  // 或
  "workbench.colorTheme": "Default Light+",  // 浅色主题
}
```

### 调整侧边栏宽度

在 Cursor 中：
1. 将鼠标悬停在侧边栏边缘
2. 拖动调整宽度

### 调整面板高度

在 Cursor 中：
1. 将鼠标悬停在面板顶部边缘
2. 拖动调整高度

## 📦 推荐扩展安装

配置文件已包含推荐扩展列表。安装方法：

1. 按 `Ctrl+Shift+X` 打开扩展面板
2. 点击右上角的 `...` 菜单
3. 选择 "Show Recommended Extensions"
4. 点击 "Install All" 或逐个安装

主要推荐扩展：
- **Prettier** - 代码格式化
- **ESLint** - 代码检查
- **Tailwind CSS IntelliSense** - Tailwind 智能提示
- **GitLens** - Git 增强
- **VS Code Icons** - 文件图标

## 🐛 常见问题

### Q: 设置没有生效？
A: 
1. 确保文件保存在 `.vscode/settings.json`
2. 重新加载窗口（`Ctrl+Shift+P` → `Reload Window`）
3. 检查 Cursor 设置中是否有冲突的全局设置

### Q: 侧边栏还在右侧？
A: 
1. 手动调整：右键侧边栏 → "Move Side Bar" → "Left"
2. 或使用命令：`Ctrl+Shift+P` → `View: Move Side Bar Left`

### Q: 面板不在底部？
A: 
1. 手动调整：右键面板 → "Move Panel" → "Bottom"
2. 或使用命令：`Ctrl+Shift+P` → `View: Move Panel Bottom`

### Q: 快捷键不工作？
A: 
1. 检查是否有其他程序占用了快捷键
2. 在 Cursor 设置中搜索快捷键名称
3. 确认快捷键配置在 `.vscode/keybindings.json` 中

### Q: 如何恢复默认布局？
A: 
1. 删除 `.vscode` 文件夹
2. 或使用命令：`Ctrl+Shift+P` → `View: Reset View Locations`

## 💡 额外提示

1. **工作区设置 vs 用户设置**
   - `.vscode/settings.json` 是工作区设置（仅当前项目）
   - 用户设置：`File` → `Preferences` → `Settings`

2. **同步设置**
   - Cursor 支持设置同步（如果已登录）
   - 可以在设置中启用/禁用同步

3. **多工作区**
   - 每个项目可以有独立的 `.vscode` 配置
   - 适合不同项目使用不同设置

4. **布局快捷键**
   - `Ctrl+K Ctrl+S` - 打开快捷键编辑器
   - `Ctrl+K Ctrl+T` - 打开主题选择器

## 📝 配置文件位置

所有配置文件都在 `.vscode` 文件夹中：

```
.vscode/
├── settings.json      # 工作区设置
├── keybindings.json   # 快捷键配置
├── extensions.json    # 推荐扩展
├── launch.json        # 调试配置
└── tasks.json         # 任务配置
```

## ✅ 验证配置是否生效

检查以下项目：

- [ ] 侧边栏在左侧
- [ ] 面板在底部
- [ ] 编辑器标签在顶部
- [ ] 文件资源管理器正常显示
- [ ] 终端可以正常打开（`Ctrl+\``）
- [ ] 快捷键正常工作（如 `Ctrl+P` 打开文件）

如果以上都正常，说明配置已成功应用！

