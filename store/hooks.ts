/**
 * Redux Hooks（TypeScript 类型安全）
 * 
 * 新手注意：
 * - 使用这些 hooks 替代直接使用 useDispatch 和 useSelector
 * - 提供完整的 TypeScript 类型支持
 */

import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, AppStore, RootState } from './store';

// 类型安全的 hooks
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

