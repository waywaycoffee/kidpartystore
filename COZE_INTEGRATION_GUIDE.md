# Coze工作流集成指南

## 一、Coze简介

Coze是字节跳动推出的AI工作流平台，可以创建复杂的AI Agent来处理各种业务场景。

## 二、推荐集成的Coze工作流

### 1. 智能客服Agent（高优先级）

**工作流名称**: PartyExpert Customer Service Agent

**功能**:

- 多语言客服支持（英语、西班牙语、法语等）
- 产品咨询自动回复
- 订单状态查询
- 退货政策解答
- 复杂问题转人工

**配置步骤**:

1. 在Coze平台创建新的Bot
2. 添加知识库：
   - 产品信息（从API同步）
   - FAQ文档
   - 退货政策
   - 配送信息
3. 设置多语言支持
4. 配置转人工规则
5. 获取Bot ID和API Key

**集成代码**:

```typescript
// lib/ai/coze.ts
export async function callCozeBot(botId: string, message: string, userId?: string) {
  const response = await fetch(`https://www.coze.cn/api/bot/${botId}/chat`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.COZE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      user_id: userId || 'anonymous',
      stream: false,
    }),
  });
  return response.json();
}
```

### 2. 个性化推荐工作流

**工作流名称**: Personalized Product Recommendations

**功能**:

- 基于用户行为生成个性化推荐
- 分析购买历史和浏览记录
- 生成推荐理由

**输入**:

- 用户ID
- 购买历史
- 浏览记录
- 偏好设置

**输出**:

- 推荐产品列表
- 推荐理由
- 个性化邮件内容

### 3. 产品详情生成工作流

**工作流名称**: Multi-language Product Description Generator

**功能**:

- 批量生成多语言产品描述
- SEO优化
- 自动生成FAQ

**输入**:

- 产品图片
- 基本信息
- 目标语言

**输出**:

- 多语言标题
- 产品描述
- SEO关键词
- FAQ列表

## 三、集成步骤

### Step 1: 注册Coze账号

1. 访问 https://www.coze.cn
2. 注册账号（支持GitHub/Google登录）
3. 创建新项目

### Step 2: 创建Bot

1. 点击"创建Bot"
2. 选择模板或从零开始
3. 配置Bot名称和描述

### Step 3: 配置知识库

1. 添加数据源（支持文件上传、API同步）
2. 同步产品信息
3. 添加FAQ文档

### Step 4: 设置工作流

1. 使用可视化编辑器创建工作流
2. 配置条件分支
3. 设置API调用节点

### Step 5: 获取API凭证

1. 在Bot设置中获取Bot ID
2. 在API设置中创建API Key
3. 配置环境变量

### Step 6: 集成到Next.js项目

1. 添加环境变量：

```env
COZE_API_KEY=your_coze_api_key
COZE_BOT_ID_CUSTOMER_SERVICE=your_bot_id
COZE_BOT_ID_RECOMMENDATIONS=your_bot_id
```

2. 更新AI客服组件使用Coze API

3. 测试集成

## 四、成本说明

- **免费版**: 每月1000次调用
- **付费版**: 按调用量计费，约$0.01-0.05/次
- **推荐**: 从免费版开始，根据使用量升级

## 五、最佳实践

1. **缓存响应**: 对常见问题缓存AI回复，减少API调用
2. **降级策略**: Coze API失败时，回退到基础回复
3. **监控使用量**: 设置使用上限，避免超支
4. **A/B测试**: 对比Coze回复和基础回复的效果

## 六、即梦AI集成（视频生成）

### 适用场景

- 产品介绍视频自动生成
- 社媒短视频素材
- 广告视频生成

### 集成步骤

1. 注册即梦AI账号
2. 获取API Key
3. 配置环境变量：

```env
JIMENG_API_KEY=your_jimeng_api_key
```

4. 集成代码：

```typescript
// lib/ai/jimeng.ts
export async function generateVideo(prompt: string, productInfo: any) {
  const response = await fetch('https://api.jimeng.ai/v1/video/generate', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.JIMENG_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: `Create a product introduction video for ${productInfo.name}: ${prompt}`,
      duration: 30, // seconds
      style: 'professional',
    }),
  });
  return response.json();
}
```

## 七、优先级建议

### 立即集成（高ROI）

1. ✅ AI内容生成（已完成 - OpenAI API）
2. ✅ AI客服基础功能（已完成 - OpenAI API）
3. ⏳ Coze智能客服Agent（推荐 - 更强大的多语言支持）

### 短期集成（1个月）

1. Coze个性化推荐工作流
2. Coze产品详情生成工作流

### 中期集成（2-3个月）

1. 即梦AI视频生成
2. 广告素材AI生成

## 八、技术支持

- Coze文档: https://www.coze.cn/docs
- 即梦AI文档: 联系即梦AI客服获取
- 项目支持: 查看项目README或联系开发团队
