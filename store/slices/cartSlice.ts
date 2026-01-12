/**
 * 购物车状态管理
 * 
 * 跨境适配说明：
 * - 购物车项包含货币信息
 * - 支持套餐商品和单品
 * - 个性化定制商品（如姓名气球）需要额外字段
 * 
 * 新手注意：
 * - 购物车数据应定期同步到服务端（防止用户刷新丢失）
 * - 库存检查应在添加到购物车时进行
 * - 价格计算应考虑货币转换和税费
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export interface CartItem {
  id: string;
  name: string;
  price: number; // USD 基准价格
  quantity: number;
  image: string;
  theme?: string; // 主题标签
  category?: string; // 分类
  // 个性化定制字段
  customization?: {
    type: 'name' | 'photo' | 'text'; // 定制类型
    value: string; // 定制内容（如姓名）
    preview?: string; // 预览图 URL
  };
  // 商品属性
  attributes?: {
    size?: string; // 尺寸（英寸/厘米）
    material?: string; // 材质
    certification?: string[]; // 认证（如 ASTM, EN 71）
    ageRange?: string; // 适用年龄段
  };
}

interface CartState {
  items: CartItem[];
  total: number; // USD 基准总价
  itemCount: number; // 商品总数量
  // 跨境相关
  shippingMethod?: 'standard' | 'express' | 'overnight';
  estimatedDelivery?: string; // 预计送达日期
}

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id &&
          item.customization?.value === action.payload.customization?.value
      );

      if (existingItem) {
        // 如果商品已存在且定制内容相同，增加数量
        existingItem.quantity += action.payload.quantity;
      } else {
        // 否则添加新商品
        state.items.push(action.payload);
      }

      // 重新计算总价和数量
      cartSlice.caseReducers.calculateTotal(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotal(state);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity); // 最少数量为 1
      }
      cartSlice.caseReducers.calculateTotal(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
    },
    setShippingMethod: (
      state,
      action: PayloadAction<CartState['shippingMethod']>
    ) => {
      state.shippingMethod = action.payload;
    },
    setEstimatedDelivery: (state, action: PayloadAction<string>) => {
      state.estimatedDelivery = action.payload;
    },
    calculateTotal: (state) => {
      state.total = state.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      state.itemCount = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setShippingMethod,
  setEstimatedDelivery,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;
export const selectShippingMethod = (state: RootState) =>
  state.cart.shippingMethod;

export default cartSlice.reducer;

