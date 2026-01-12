/**
 * 多语言配置 - i18next 初始化
 * 
 * 跨境适配说明：
 * - 支持英文（en）、西班牙语（es）、法语（fr）
 * - 自动检测用户浏览器语言
 * - 语言切换后持久化到 localStorage
 * 
 * 新手注意：
 * - 翻译文件存放在 public/locales/{locale}/common.json
 * - 使用 useTranslation hook 在组件中获取翻译
 * - 货币符号会根据语言自动调整（如 $ USD, € EUR）
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 翻译资源（实际项目中应从 public/locales 加载）
const resources = {
  en: {
    translation: {
      common: {
        shop: 'Shop',
        cart: 'Cart',
        checkout: 'Checkout',
        search: 'Search',
        language: 'Language',
        currency: 'Currency',
        freeShipping: 'Free Shipping',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        viewDetails: 'View Details',
        theme: 'Theme',
        category: 'Category',
        price: 'Price',
        quantity: 'Quantity',
        subtotal: 'Subtotal',
        total: 'Total',
        shipping: 'Shipping',
        tax: 'Tax',
        estimatedDelivery: 'Estimated Delivery',
        days: 'days',
        secureCheckout: 'Secure Checkout',
      },
      themes: {
        disney: 'Disney',
        marvel: 'Marvel',
        peppaPig: 'Peppa Pig',
        unicorn: 'Unicorn',
        dinosaur: 'Dinosaur',
        mermaid: 'Mermaid',
        princess: 'Princess',
        superhero: 'Superhero',
      },
      categories: {
        themePackages: 'Theme Packages',
        balloons: 'Balloons',
        decorations: 'Decorations',
        tableware: 'Tableware',
        interactiveProps: 'Interactive Props',
        personalized: 'Personalized',
      },
    },
  },
  es: {
    translation: {
      common: {
        shop: 'Tienda',
        cart: 'Carrito',
        checkout: 'Pagar',
        search: 'Buscar',
        language: 'Idioma',
        currency: 'Moneda',
        freeShipping: 'Envío Gratis',
        addToCart: 'Añadir al Carrito',
        buyNow: 'Comprar Ahora',
        viewDetails: 'Ver Detalles',
        theme: 'Tema',
        category: 'Categoría',
        price: 'Precio',
        quantity: 'Cantidad',
        subtotal: 'Subtotal',
        total: 'Total',
        shipping: 'Envío',
        tax: 'Impuesto',
        estimatedDelivery: 'Entrega Estimada',
        days: 'días',
        secureCheckout: 'Pago Seguro',
      },
      themes: {
        disney: 'Disney',
        marvel: 'Marvel',
        peppaPig: 'Peppa Pig',
        unicorn: 'Unicornio',
        dinosaur: 'Dinosaurio',
        mermaid: 'Sirena',
        princess: 'Princesa',
        superhero: 'Superhéroe',
      },
      categories: {
        themePackages: 'Paquetes Temáticos',
        balloons: 'Globos',
        decorations: 'Decoraciones',
        tableware: 'Vajilla',
        interactiveProps: 'Accesorios Interactivos',
        personalized: 'Personalizado',
      },
    },
  },
  fr: {
    translation: {
      common: {
        shop: 'Boutique',
        cart: 'Panier',
        checkout: 'Paiement',
        search: 'Rechercher',
        language: 'Langue',
        currency: 'Devise',
        freeShipping: 'Livraison Gratuite',
        addToCart: 'Ajouter au Panier',
        buyNow: 'Acheter Maintenant',
        viewDetails: 'Voir les Détails',
        theme: 'Thème',
        category: 'Catégorie',
        price: 'Prix',
        quantity: 'Quantité',
        subtotal: 'Sous-total',
        total: 'Total',
        shipping: 'Livraison',
        tax: 'Taxe',
        estimatedDelivery: 'Livraison Estimée',
        days: 'jours',
        secureCheckout: 'Paiement Sécurisé',
      },
      themes: {
        disney: 'Disney',
        marvel: 'Marvel',
        peppaPig: 'Peppa Pig',
        unicorn: 'Licorne',
        dinosaur: 'Dinosaure',
        mermaid: 'Sirène',
        princess: 'Princesse',
        superhero: 'Super-héros',
      },
      categories: {
        themePackages: 'Packs Thématiques',
        balloons: 'Ballons',
        decorations: 'Décorations',
        tableware: 'Vaisselle',
        interactiveProps: 'Accessoires Interactifs',
        personalized: 'Personnalisé',
      },
    },
  },
};

i18n
  .use(LanguageDetector) // 自动检测浏览器语言
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', // 默认语言
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React 已经处理了转义
    },
    detection: {
      // 语言检测配置
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'], // 持久化到 localStorage
    },
  });

export default i18n;

