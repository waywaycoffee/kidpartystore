/**
 * Redux Store 配置
 * 
 * 跨境适配说明：
 * - 购物车状态支持多货币显示
 * - 用户偏好（语言、货币）持久化
 * - 订单状态管理（跨境物流追踪）
 * 
 * 新手注意：
 * - 使用 Redux Toolkit 简化 Redux 代码
 * - 敏感数据（如支付信息）不应存储在 Redux 中
 * - 购物车数据应同步到服务端（防止丢失）
 */

import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import userReducer from './slices/userSlice';
import currencyReducer from './slices/currencySlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      user: userReducer,
      currency: currencyReducer,
    },
    // 开发环境启用 Redux DevTools
    devTools: process.env.NODE_ENV !== 'production',
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

