/**
 * 全局 Providers 组件
 * 
 * 跨境适配说明：
 * - Redux Provider：状态管理
 * - i18n Provider：多语言支持
 * - Toast Provider：用户提示
 * 
 * 新手注意：
 * - 使用 'use client' 因为 Redux 和 i18n 需要客户端运行
 * - Providers 应包裹在 layout.tsx 中
 */

'use client';

import { Provider } from 'react-redux';
import { makeStore } from '@/store/store';
import { I18nextProvider } from 'react-i18next';
import { SessionProvider } from 'next-auth/react';
import i18n from '@/lib/i18n';
import { Toaster } from 'react-hot-toast';

const store = makeStore();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          {children}
          <Toaster position="top-right" />
        </I18nextProvider>
      </Provider>
    </SessionProvider>
  );
}

