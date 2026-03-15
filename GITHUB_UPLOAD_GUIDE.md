# GitHub上传项目完整指南

## 📋 目录

1. [准备工作](#准备工作)
2. [创建GitHub仓库](#创建github仓库)
3. [上传项目到GitHub](#上传项目到github)
4. [更新代码到GitHub](#更新代码到github)
5. [常见问题](#常见问题)

---

## 🔧 准备工作

### 1. 安装Git（如果还没有）

**检查是否已安装Git**：
```bash
git --version
```

如果显示版本号，说明已安装。如果没有，请访问：https://git-scm.com/download/win

### 2. 配置Git用户信息（首次使用）

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

**示例**：
```bash
git config --global user.name "John Doe"
git config --global user.email "john@example.com"
```

### 3. 检查当前Git状态

你的项目已经有Git仓库了，可以直接使用。

---

## 🆕 创建GitHub仓库

### 方法1：在GitHub网站创建（推荐）

#### 步骤1: 登录GitHub
1. 访问 https://github.com
2. 登录你的账号（如果没有账号，先注册）

#### 步骤2: 创建新仓库
1. 点击右上角的 **"+"** 按钮
2. 选择 **"New repository"**

#### 步骤3: 填写仓库信息
- **Repository name**: 输入仓库名称（如：`qiaonai`）
- **Description**: 输入描述（可选，如：`独立电商网站`）
- **Visibility**: 
  - **Public** - 公开（免费，所有人都能看到）
  - **Private** - 私有（免费，只有你能看到）
- **不要勾选**以下选项（因为项目已经存在）：
  - ❌ Add a README file
  - ❌ Add .gitignore
  - ❌ Choose a license

#### 步骤4: 创建仓库
点击 **"Create repository"** 按钮

#### 步骤5: 复制仓库URL
创建完成后，GitHub会显示仓库URL，类似：
```
https://github.com/你的用户名/qiaonai.git
```
**复制这个URL**，稍后会用到。

---

## 📤 上传项目到GitHub

### 情况1：项目还没有连接远程仓库

如果你的项目还没有连接GitHub，按以下步骤操作：

#### 步骤1: 检查是否已有远程仓库
```bash
cd D:\AI\qiaonai
git remote -v
```

如果显示 `origin`，说明已经连接。如果没有，继续下一步。

#### 步骤2: 添加远程仓库
```bash
git remote add origin https://github.com/你的用户名/仓库名.git
```

**示例**：
```bash
git remote add origin https://github.com/username/qiaonai.git
```

#### 步骤3: 提交所有更改
```bash
# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交：上传项目到GitHub"
```

#### 步骤4: 推送到GitHub
```bash
# 推送到main分支
git push -u origin main
```

如果遇到错误，可能需要先拉取：
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

### 情况2：项目已经连接远程仓库（你的情况）

你的项目已经连接到GitHub了，只需要提交并推送更改：

#### 步骤1: 查看当前状态
```bash
cd D:\AI\qiaonai
git status
```

#### 步骤2: 添加所有更改
```bash
git add .
```

#### 步骤3: 提交更改
```bash
git commit -m "更新：添加Vercel配置和部署文档"
```

**提交信息建议**：
- `"更新：添加Vercel配置和部署文档"`
- `"功能：实现存储适配器和Vercel KV支持"`
- `"文档：添加GitHub上传指南"`

#### 步骤4: 推送到GitHub
```bash
git push origin main
```

---

## 🔄 更新代码到GitHub

以后每次修改代码后，按以下步骤更新到GitHub：

### 快速更新流程

```bash
# 1. 进入项目目录
cd D:\AI\qiaonai

# 2. 查看更改
git status

# 3. 添加所有更改
git add .

# 4. 提交更改
git commit -m "描述你的更改"

# 5. 推送到GitHub
git push origin main
```

### 详细步骤说明

#### 1. 查看更改
```bash
git status
```
这会显示：
- 已修改的文件（modified）
- 新文件（untracked）
- 已删除的文件（deleted）

#### 2. 添加文件到暂存区
```bash
# 添加所有文件
git add .

# 或添加特定文件
git add 文件名
```

#### 3. 提交更改
```bash
git commit -m "提交信息"
```

**提交信息规范**：
- `"功能：添加新功能"`
- `"修复：修复某个bug"`
- `"更新：更新依赖"`
- `"文档：更新文档"`

#### 4. 推送到GitHub
```bash
git push origin main
```

---

## 🎯 现在立即上传

根据你的项目状态，执行以下命令：

```bash
# 进入项目目录
cd D:\AI\qiaonai

# 添加所有更改
git add .

# 提交更改
git commit -m "更新：添加Vercel配置、存储适配器和部署文档"

# 推送到GitHub
git push origin main
```

---

## 🔐 身份验证

### 如果推送时要求输入用户名和密码

GitHub已经不再支持密码验证，需要使用以下方法之一：

#### 方法1：使用Personal Access Token（推荐）

1. **生成Token**：
   - 访问：https://github.com/settings/tokens
   - 点击 **"Generate new token"** → **"Generate new token (classic)"**
   - 填写名称（如：`qiaonai-project`）
   - 选择过期时间
   - 勾选权限：`repo`（完整仓库权限）
   - 点击 **"Generate token"**
   - **复制Token**（只显示一次，请保存好）

2. **使用Token**：
   - 推送时，用户名输入你的GitHub用户名
   - 密码输入刚才生成的Token

#### 方法2：使用SSH密钥（更安全）

1. **生成SSH密钥**：
```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

2. **复制公钥**：
```bash
cat ~/.ssh/id_ed25519.pub
```

3. **添加到GitHub**：
   - 访问：https://github.com/settings/keys
   - 点击 **"New SSH key"**
   - 粘贴公钥
   - 保存

4. **更改远程仓库URL为SSH**：
```bash
git remote set-url origin git@github.com:你的用户名/仓库名.git
```

---

## 📝 提交信息最佳实践

### 提交信息格式

```
类型：简短描述

详细说明（可选）
```

### 类型说明

- `功能` - 新功能
- `修复` - 修复bug
- `更新` - 更新代码或依赖
- `文档` - 文档相关
- `样式` - 样式调整
- `重构` - 代码重构
- `测试` - 测试相关
- `配置` - 配置文件

### 示例

```bash
git commit -m "功能：添加产品推荐系统"
git commit -m "修复：解决支付流程中的库存更新问题"
git commit -m "更新：迁移API路由到存储适配器"
git commit -m "文档：添加Vercel部署指南"
```

---

## 🐛 常见问题

### Q1: 推送时提示 "remote: Support for password authentication was removed"

**A**: GitHub不再支持密码验证，需要使用Personal Access Token或SSH密钥。

**解决方法**：
1. 生成Personal Access Token（见上方"身份验证"部分）
2. 推送时，密码输入Token

---

### Q2: 推送时提示 "error: failed to push some refs"

**A**: 远程仓库有本地没有的更改。

**解决方法**：
```bash
# 先拉取远程更改
git pull origin main

# 解决冲突（如果有）
# 然后再次推送
git push origin main
```

---

### Q3: 如何查看远程仓库URL？

**A**: 
```bash
git remote -v
```

---

### Q4: 如何更改远程仓库URL？

**A**: 
```bash
git remote set-url origin https://github.com/新用户名/新仓库名.git
```

---

### Q5: 如何撤销最后一次提交？

**A**: 
```bash
# 撤销提交，但保留更改
git reset --soft HEAD~1

# 撤销提交和更改（谨慎使用）
git reset --hard HEAD~1
```

---

### Q6: 如何查看提交历史？

**A**: 
```bash
git log
```

或查看简洁版本：
```bash
git log --oneline
```

---

### Q7: 如何忽略某些文件？

**A**: 编辑 `.gitignore` 文件，添加要忽略的文件或文件夹：

```
# 示例
node_modules/
.env
*.log
```

---

### Q8: 推送时提示 "Large files detected"

**A**: GitHub限制单个文件不能超过100MB。

**解决方法**：
1. 找到大文件
2. 从Git历史中删除：
```bash
git rm --cached 大文件路径
git commit -m "删除大文件"
git push origin main
```

---

## 📚 常用Git命令速查

```bash
# 查看状态
git status

# 添加文件
git add .
git add 文件名

# 提交
git commit -m "提交信息"

# 推送
git push origin main

# 拉取
git pull origin main

# 查看远程仓库
git remote -v

# 查看提交历史
git log --oneline

# 查看更改
git diff

# 撤销暂存
git reset HEAD 文件名

# 撤销更改
git checkout -- 文件名
```

---

## ✅ 检查清单

上传前检查：

- [ ] 已创建GitHub仓库
- [ ] 已配置Git用户信息
- [ ] 已添加远程仓库（如果需要）
- [ ] 已检查 `.gitignore` 文件（确保敏感文件不会被上传）
- [ ] 已提交所有更改
- [ ] 已推送到GitHub
- [ ] 在GitHub网站确认文件已上传

---

## 🎉 完成！

上传成功后：
1. 访问你的GitHub仓库页面
2. 确认所有文件都已上传
3. 现在可以在Vercel中导入这个仓库了！

**下一步**：按照 `VERCEL_FREE_DEPLOYMENT_GUIDE.md` 部署到Vercel。

---

## 💡 提示

- **定期提交**：建议每次完成一个功能就提交一次
- **清晰的提交信息**：方便以后查看历史
- **不要提交敏感信息**：如 `.env` 文件、API密钥等
- **使用分支**：大型更改建议创建新分支

---

**祝你上传顺利！** 🚀
