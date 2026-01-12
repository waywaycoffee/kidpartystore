/**
 * 货币状态管理
 * 
 * 跨境适配说明：
 * - 用户选择的货币持久化到 localStorage
 * - 货币切换时自动转换所有价格显示
 * - 与语言选择联动（某些地区有默认货币）
 * 
 * 新手注意：
 * - 汇率更新频率：建议每小时或每天更新一次
 * - 货币转换应在服务端完成，确保一致性
 * - 注意汇率波动对利润的影响
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { CurrencyCode } from '@/lib/currency';

interface CurrencyState {
  currentCurrency: CurrencyCode;
  // 汇率更新时间戳
  lastRateUpdate?: number;
}

// 从 localStorage 读取用户偏好
const getInitialCurrency = (): CurrencyCode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('preferredCurrency');
    if (saved && ['USD', 'CAD', 'GBP', 'EUR', 'AUD'].includes(saved)) {
      return saved as CurrencyCode;
    }
  }
  return 'USD'; // 默认 USD
};

const initialState: CurrencyState = {
  currentCurrency: getInitialCurrency(),
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.currentCurrency = action.payload;
      // 持久化到 localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredCurrency', action.payload);
      }
    },
    updateRates: (state, action: PayloadAction<number>) => {
      state.lastRateUpdate = action.payload;
    },
  },
});

export const { setCurrency, updateRates } = currencySlice.actions;

// Selectors
export const selectCurrentCurrency = (state: RootState) =>
  state.currency.currentCurrency;

export default currencySlice.reducer;

