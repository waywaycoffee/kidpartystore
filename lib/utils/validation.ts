/**
 * 表单验证工具函数
 * 
 * 跨境适配说明：
 * - 国际地址验证
 * - 邮箱格式验证
 * - 电话号码格式验证（不同国家格式不同）
 * - 邮编格式验证（不同国家格式不同）
 * 
 * 新手注意：
 * - 地址验证应使用专业服务（如 Google Maps API）
 * - 不同国家的验证规则不同
 */

/**
 * 验证邮箱格式
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 验证美国邮编格式
 */
export function validateUSZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}(-\d{4})?$/;
  return zipRegex.test(zipCode);
}

/**
 * 验证加拿大邮编格式
 */
export function validateCAZipCode(zipCode: string): boolean {
  const zipRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
  return zipRegex.test(zipCode);
}

/**
 * 验证英国邮编格式
 */
export function validateGBZipCode(zipCode: string): boolean {
  const zipRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
  return zipRegex.test(zipCode);
}

/**
 * 根据国家验证邮编格式
 */
export function validateZipCode(zipCode: string, country: string): boolean {
  switch (country) {
    case 'US':
      return validateUSZipCode(zipCode);
    case 'CA':
      return validateCAZipCode(zipCode);
    case 'GB':
      return validateGBZipCode(zipCode);
    default:
      // 默认验证：至少 3 个字符
      return zipCode.length >= 3;
  }
}

/**
 * 验证电话号码格式（简化版）
 * 
 * 新手注意：
 * - 实际应使用专业电话号码验证库（如 libphonenumber-js）
 * - 不同国家的电话号码格式差异很大
 */
export function validatePhoneNumber(phone: string, country: string): boolean {
  // 移除所有非数字字符
  const digitsOnly = phone.replace(/\D/g, '');

  // 不同国家的最小/最大位数
  const countryRules: Record<string, { min: number; max: number }> = {
    US: { min: 10, max: 10 },
    CA: { min: 10, max: 10 },
    GB: { min: 10, max: 11 },
    AU: { min: 10, max: 10 },
  };

  const rule = countryRules[country] || { min: 8, max: 15 };
  return digitsOnly.length >= rule.min && digitsOnly.length <= rule.max;
}

/**
 * 验证必填字段
 */
export function validateRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

