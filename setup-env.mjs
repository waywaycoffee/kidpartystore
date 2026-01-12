/**
 * 环境变量配置辅助脚本
 * 运行: node setup-env.mjs
 */

import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ENV_LOCAL_PATH = path.join(__dirname, '.env.local');
const ENV_EXAMPLE_PATH = path.join(__dirname, '.env.example');

// 生成随机密钥
function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

// 检查文件是否存在
function fileExists(filePath) {
  try {
    return fs.existsSync(filePath);
  } catch {
    return false;
  }
}

// 读取现有配置
function readExistingConfig() {
  if (!fileExists(ENV_LOCAL_PATH)) {
    return {};
  }
  
  const content = fs.readFileSync(ENV_LOCAL_PATH, 'utf-8');
  const config = {};
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        config[key.trim()] = value.trim();
      }
    }
  });
  
  return config;
}

// 创建环境变量文件
function createEnvFile() {
  const existing = readExistingConfig();
  const secret = existing.NEXTAUTH_SECRET || generateSecret();
  
  const config = {
    // NextAuth配置
    NEXTAUTH_URL: existing.NEXTAUTH_URL || 'http://localhost:3000',
    NEXTAUTH_SECRET: secret,
    
    // 管理员账号
    ADMIN_EMAIL: existing.ADMIN_EMAIL || 'admin@example.com',
    ADMIN_PASSWORD: existing.ADMIN_PASSWORD || 'admin123456',
    
    // 站点配置（生产环境需要修改）
    // NEXT_PUBLIC_SITE_URL: existing.NEXT_PUBLIC_SITE_URL || '',
    
    // Stripe配置（可选）
    // NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: existing.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    // STRIPE_SECRET_KEY: existing.STRIPE_SECRET_KEY || '',
    // STRIPE_WEBHOOK_SECRET: existing.STRIPE_WEBHOOK_SECRET || '',
    
    // Cloudinary配置（可选）
    // CLOUDINARY_CLOUD_NAME: existing.CLOUDINARY_CLOUD_NAME || '',
    // CLOUDINARY_API_KEY: existing.CLOUDINARY_API_KEY || '',
    // CLOUDINARY_API_SECRET: existing.CLOUDINARY_API_SECRET || '',
  };
  
  let content = `# ============================================
# 环境变量配置
# 生成时间: ${new Date().toISOString()}
# ============================================

# ============================================
# 必需配置（已自动生成）
# ============================================

# NextAuth 配置
NEXTAUTH_URL=${config.NEXTAUTH_URL}
NEXTAUTH_SECRET=${config.NEXTAUTH_SECRET}

# 管理员账号（首次启动会自动创建）
ADMIN_EMAIL=${config.ADMIN_EMAIL}
ADMIN_PASSWORD=${config.ADMIN_PASSWORD}

# ============================================
# 站点配置（生产环境需要修改）
# ============================================

# 生产环境站点URL（部署时取消注释并修改）
# NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Google Search Console验证码（可选）
# NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code

# ============================================
# 支付配置（测试支付需要，可选）
# ============================================

# Stripe 测试密钥（获取方式：https://stripe.com/docs/keys）
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_SECRET_KEY=sk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...（生产环境需要）

# ============================================
# 图片上传配置（生产环境推荐，可选）
# ============================================

# Cloudinary配置（推荐用于生产环境）
# 注册地址：https://cloudinary.com
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

# ============================================
# 邮件服务配置（可选）
# ============================================

# SendGrid配置示例
# SENDGRID_API_KEY=SG.xxx
# SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# ============================================
# 数据库配置（可选，当前使用JSON文件）
# ============================================

# PostgreSQL示例
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# MongoDB示例
# MONGODB_URI=mongodb://localhost:27017/dbname
`;

  // 如果文件已存在，保留用户自定义的配置
  if (fileExists(ENV_LOCAL_PATH)) {
    const existingContent = fs.readFileSync(ENV_LOCAL_PATH, 'utf-8');
    const existingLines = existingContent.split('\n');
    
    // 检查是否有用户自定义的配置
    const hasCustomConfig = existingLines.some(line => {
      const trimmed = line.trim();
      return trimmed && !trimmed.startsWith('#') && 
             (trimmed.includes('STRIPE') || 
              trimmed.includes('CLOUDINARY') || 
              trimmed.includes('SENDGRID') ||
              trimmed.includes('DATABASE'));
    });
    
    if (hasCustomConfig) {
      console.log('⚠️  检测到现有配置文件，将保留您的自定义配置');
      console.log('   如果需要重新生成，请先删除 .env.local 文件');
      return false;
    }
  }
  
  fs.writeFileSync(ENV_LOCAL_PATH, content, 'utf-8');
  return true;
}

// 主函数
function main() {
  console.log('🚀 开始配置环境变量...\n');
  
  if (fileExists(ENV_LOCAL_PATH)) {
    console.log('📄 检测到现有 .env.local 文件');
    const existing = readExistingConfig();
    
    if (existing.NEXTAUTH_SECRET && existing.NEXTAUTH_SECRET !== 'your-random-secret-key-here-generate-one') {
      console.log('✅ NEXTAUTH_SECRET 已配置');
    } else {
      console.log('⚠️  NEXTAUTH_SECRET 未配置，将生成新密钥');
      if (createEnvFile()) {
        console.log('✅ 已更新配置文件');
      }
    }
    
    if (existing.ADMIN_EMAIL && existing.ADMIN_EMAIL !== 'admin@example.com') {
      console.log(`✅ ADMIN_EMAIL 已配置: ${existing.ADMIN_EMAIL}`);
    } else {
      console.log('⚠️  ADMIN_EMAIL 使用默认值，建议修改');
    }
    
    if (existing.ADMIN_PASSWORD && existing.ADMIN_PASSWORD !== 'admin123456') {
      console.log('✅ ADMIN_PASSWORD 已配置');
    } else {
      console.log('⚠️  ADMIN_PASSWORD 使用默认值，建议修改为更安全的密码');
    }
    
    console.log('\n📋 当前配置状态：');
    console.log(`   NEXTAUTH_URL: ${existing.NEXTAUTH_URL || '未设置'}`);
    console.log(`   NEXTAUTH_SECRET: ${existing.NEXTAUTH_SECRET ? '已设置' : '未设置'}`);
    console.log(`   ADMIN_EMAIL: ${existing.ADMIN_EMAIL || '未设置'}`);
    console.log(`   ADMIN_PASSWORD: ${existing.ADMIN_PASSWORD ? '已设置' : '未设置'}`);
    
    console.log('\n💡 提示：');
    console.log('   - 如需修改配置，请编辑 .env.local 文件');
    console.log('   - 如需重新生成，请删除 .env.local 文件后重新运行此脚本');
    
  } else {
    console.log('📝 创建新的 .env.local 文件...');
    if (createEnvFile()) {
      console.log('✅ 配置文件创建成功！\n');
      console.log('📋 已生成的配置：');
      const config = readExistingConfig();
      console.log(`   NEXTAUTH_URL: ${config.NEXTAUTH_URL}`);
      console.log(`   NEXTAUTH_SECRET: ${config.NEXTAUTH_SECRET.substring(0, 20)}...`);
      console.log(`   ADMIN_EMAIL: ${config.ADMIN_EMAIL}`);
      console.log(`   ADMIN_PASSWORD: ${config.ADMIN_PASSWORD}`);
      
      console.log('\n⚠️  重要提示：');
      console.log('   1. 请修改 ADMIN_EMAIL 和 ADMIN_PASSWORD 为您的实际值');
      console.log('   2. 如需测试支付，请配置 Stripe 密钥');
      console.log('   3. 生产环境请配置 Cloudinary 图片上传服务');
      console.log('\n✅ 现在可以运行 npm run dev 启动开发服务器了！');
    }
  }
  
  console.log('\n📚 更多信息请查看：');
  console.log('   - QUICK_START.md - 快速开始指南');
  console.log('   - DEPLOYMENT_GUIDE.md - 部署指南');
  console.log('   - PRE_LAUNCH_CHECKLIST.md - 上线前检查清单');
}

main();

