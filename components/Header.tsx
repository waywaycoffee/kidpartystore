/**
 * 网站头部组件
 * 
 * 跨境适配说明：
 * - 语言切换下拉菜单
 * - 货币切换下拉菜单
 * - 购物车图标显示商品数量
 * - 响应式设计（移动端汉堡菜单）
 * 
 * 新手注意：
 * - 使用 Next.js Link 组件进行客户端路由（性能优化）
 * - 购物车数量应从 Redux store 读取
 * - 移动端菜单应使用动画过渡效果
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCurrency } from '@/store/slices/currencySlice';
import { selectCartItemCount } from '@/store/slices/cartSlice';
import { selectCurrentCurrency } from '@/store/slices/currencySlice';
import type { CurrencyCode } from '@/lib/currency';
import { CURRENCIES } from '@/lib/currency';

export default function Header() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartItemCount);
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageMenuOpen(false);
  };

  const handleCurrencyChange = (currency: CurrencyCode) => {
    dispatch(setCurrency(currency));
    setCurrencyMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary-600">
              🎉 PartyExpert
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/kids-birthday"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Kids Birthday
            </Link>
            <Link
              href="/themes"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('categories.themePackages')}
            </Link>
            <Link
              href="/categories/balloons"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('categories.balloons')}
            </Link>
            <Link
              href="/categories/decorations"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('categories.decorations')}
            </Link>
            <Link
              href="/categories/tableware"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('categories.tableware')}
            </Link>
            <Link
              href="/help"
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Help
            </Link>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <span className="text-sm font-medium">
                  {i18n.language.toUpperCase()}
                </span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {languageMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg py-1 z-50">
                  {['en', 'es', 'fr'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleLanguageChange(lang)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        i18n.language === lang ? 'bg-primary-50 text-primary-600' : ''
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-primary-600"
              >
                <span className="text-sm font-medium">{currentCurrency}</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {currencyMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
                  {Object.values(CURRENCIES).map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency.code)}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentCurrency === currency.code
                          ? 'bg-primary-50 text-primary-600'
                          : ''
                      }`}
                    >
                      {currency.symbol} {currency.code} - {currency.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center text-gray-700 hover:text-primary-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/kids-birthday"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Kids Birthday
              </Link>
              <Link
                href="/themes"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('categories.themePackages')}
              </Link>
              <Link
                href="/categories/balloons"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('categories.balloons')}
              </Link>
              <Link
                href="/categories/decorations"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('categories.decorations')}
              </Link>
              <Link
                href="/categories/tableware"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('categories.tableware')}
              </Link>
              <Link
                href="/help"
                className="px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

