/**
 * 多货币转换工具
 * 
 * 跨境适配说明：
 * - 支持 USD, CAD, GBP, EUR, AUD 五种主流货币
 * - 汇率从外部 API 获取（实际项目中应使用实时汇率服务）
 * - 货币符号和格式化根据地区自动调整
 * 
 * 新手注意：
 * - 汇率应定期更新（建议每小时或每天）
 * - 生产环境应使用专业汇率 API（如 exchangerate-api.com, fixer.io）
 * - 货币转换应在服务端完成，避免客户端汇率不一致
 * - 注意汇率波动对利润的影响，建议设置汇率缓冲区间
 */

export type CurrencyCode = 'USD' | 'CAD' | 'GBP' | 'EUR' | 'AUD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  // 相对于 USD 的汇率（示例汇率，实际应从 API 获取）
  rateToUSD: number;
}

// 货币配置表
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateToUSD: 1.0,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    rateToUSD: 1.35, // 示例汇率
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateToUSD: 0.79, // 示例汇率
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateToUSD: 0.92, // 示例汇率
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateToUSD: 1.52, // 示例汇率
  },
};

/**
 * 货币转换函数
 * @param amount 金额（USD 基准）
 * @param fromCurrency 源货币
 * @param toCurrency 目标货币
 * @returns 转换后的金额
 */
export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode = 'USD',
  toCurrency: CurrencyCode
): number {
  if (fromCurrency === toCurrency) return amount;

  // 先转换为 USD，再转换为目标货币
  const amountInUSD = amount / CURRENCIES[fromCurrency].rateToUSD;
  const convertedAmount = amountInUSD * CURRENCIES[toCurrency].rateToUSD;

  // 保留两位小数
  return Math.round(convertedAmount * 100) / 100;
}

/**
 * 格式化货币显示
 * @param amount 金额
 * @param currency 货币代码
 * @param locale 地区代码（用于格式化）
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD',
  locale: string = 'en-US'
): string {
  const currencyConfig = CURRENCIES[currency];
  
  // 根据货币代码选择正确的 locale
  const localeMap: Record<CurrencyCode, string> = {
    USD: 'en-US',
    CAD: 'en-CA',
    GBP: 'en-GB',
    EUR: 'en-EU',
    AUD: 'en-AU',
  };

  const formattedLocale = localeMap[currency] || locale;

  return new Intl.NumberFormat(formattedLocale, {
    style: 'currency',
    currency: currencyConfig.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * 获取货币符号
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCIES[currency].symbol;
}

/**
 * 从用户地理位置推断货币（简化版）
 * 实际项目中应使用 IP 地理位置服务（如 MaxMind GeoIP2）
 */
export function detectCurrencyByLocale(locale: string): CurrencyCode {
  const localeToCurrency: Record<string, CurrencyCode> = {
    'en-US': 'USD',
    'en-CA': 'CAD',
    'en-GB': 'GBP',
    'en-AU': 'AUD',
    'fr-FR': 'EUR',
    'es-ES': 'EUR',
    'de-DE': 'EUR',
  };

  return localeToCurrency[locale] || 'USD';
}

