/**
 * 用户状态管理
 * 
 * 跨境适配说明：
 * - 用户语言偏好
 * - 配送地址（支持国际地址格式）
 * - 订单历史（跨境物流追踪）
 * 
 * 新手注意：
 * - 用户敏感信息（如支付信息）不应存储在 Redux 中
 * - 地址验证应使用国际地址验证服务（如 Google Maps API）
 * - GDPR 合规：用户数据应可导出和删除
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string; // 州/省（美国、加拿大需要）
  postalCode: string;
  country: string; // ISO 3166-1 alpha-2 国家代码（如 US, CA, GB）
  phone?: string;
}

interface UserState {
  language: string; // 用户语言偏好
  shippingAddress?: ShippingAddress;
  email?: string;
  // 订单历史（简化版，实际应从服务端获取）
  orderHistory: string[]; // 订单 ID 列表
}

const initialState: UserState = {
  language: 'en',
  orderHistory: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('preferredLanguage', action.payload);
      }
    },
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    addOrder: (state, action: PayloadAction<string>) => {
      state.orderHistory.push(action.payload);
    },
  },
});

export const { setLanguage, setShippingAddress, setEmail, addOrder } =
  userSlice.actions;

// Selectors
export const selectUserLanguage = (state: RootState) => state.user.language;
export const selectShippingAddress = (state: RootState) =>
  state.user.shippingAddress;
export const selectUserEmail = (state: RootState) => state.user.email;

export default userSlice.reducer;

