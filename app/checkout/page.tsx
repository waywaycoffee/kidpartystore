/**
 * 结算页
 * 
 * 跨境适配说明：
 * - 多货币支付（PayPal, Stripe）
 * - 国际地址表单（支持不同国家格式）
 * - 物流方式选择（标准/快速/隔夜）
 * - 关税计算和提示
 * - 订单摘要（含货币转换）
 * - 安全支付标识
 * 
 * 新手注意：
 * - 支付信息不应存储在客户端（使用 Stripe Elements）
 * - 地址验证应使用国际地址验证服务
 * - 物流费用应根据地址和重量动态计算
 * - 订单确认后应发送邮件通知
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectCartItems,
  selectCartTotal,
  setShippingMethod,
  setEstimatedDelivery,
  clearCart,
} from '@/store/slices/cartSlice';
import { selectCurrentCurrency } from '@/store/slices/currencySlice';
import { setShippingAddress, setEmail, addOrder } from '@/store/slices/userSlice';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import type { ShippingAddress } from '@/store/slices/userSlice';
import toast from 'react-hot-toast';

// 物流方式配置
const shippingMethods = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    days: 7,
    price: 9.99,
    freeThreshold: 50, // 满额免邮
  },
  {
    id: 'express',
    name: 'Express Shipping',
    days: 3,
    price: 19.99,
    freeThreshold: 100,
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    days: 1,
    price: 39.99,
    freeThreshold: 200,
  },
];

export default function CheckoutPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const shippingAddress = useAppSelector((state) => state.user.shippingAddress);

  const [selectedShipping, setSelectedShipping] = useState(shippingMethods[0].id);
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: shippingAddress?.firstName || '',
    lastName: shippingAddress?.lastName || '',
    addressLine1: shippingAddress?.addressLine1 || '',
    addressLine2: shippingAddress?.addressLine2 || '',
    city: shippingAddress?.city || '',
    state: shippingAddress?.state || '',
    postalCode: shippingAddress?.postalCode || '',
    country: shippingAddress?.country || 'US',
    phone: shippingAddress?.phone || '',
  });
  const [email, setEmailState] = useState('');

  // 计算物流费用
  const shippingMethod = shippingMethods.find((m) => m.id === selectedShipping)!;
  const isFreeShipping = cartTotal >= shippingMethod.freeThreshold;
  const shippingCost = isFreeShipping ? 0 : shippingMethod.price;
  const tax = cartTotal * 0.1; // 10% 税费（示例）
  const total = cartTotal + shippingCost + tax;

  // 货币转换
  const convertedShipping = convertCurrency(shippingCost, 'USD', currentCurrency);
  const convertedTax = convertCurrency(tax, 'USD', currentCurrency);
  const convertedTotal = convertCurrency(total, 'USD', currentCurrency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证表单
    if (!formData.firstName || !formData.lastName || !formData.addressLine1) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    // 保存地址和邮箱
    dispatch(setShippingAddress(formData));
    dispatch(setEmail(email));
    dispatch(setShippingMethod(selectedShipping as 'standard' | 'express' | 'overnight'));
    dispatch(
      setEstimatedDelivery(
        `${shippingMethod.days} ${shippingMethod.days === 1 ? 'day' : 'days'}`
      )
    );

    // 生成订单 ID（实际应从服务端获取）
    const orderId = `ORD-${Date.now()}`;
    dispatch(addOrder(orderId));

    // 这里应该调用支付 API（Stripe/PayPal）
    // 示例：跳转到支付页面
    toast.success('Redirecting to payment...');
    
    // 模拟支付成功后清空购物车
    setTimeout(() => {
      dispatch(clearCart());
      router.push(`/order-confirmation/${orderId}`);
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{t('common.checkout')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Shipping Address */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address Line 1 *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.addressLine1}
                      onChange={(e) =>
                        setFormData({ ...formData, addressLine1: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      value={formData.addressLine2}
                      onChange={(e) =>
                        setFormData({ ...formData, addressLine2: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  {formData.country === 'US' || formData.country === 'CA' ? (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) =>
                          setFormData({ ...formData, state: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                  ) : null}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.postalCode}
                      onChange={(e) =>
                        setFormData({ ...formData, postalCode: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Country *
                    </label>
                    <select
                      required
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>
              </section>

              {/* Email */}
              <section>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmailState(e.target.value)}
                  className="input-field"
                />
              </section>

              {/* Shipping Method */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Shipping Method</h2>
                <div className="space-y-2">
                  {shippingMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center p-4 border-2 rounded-lg cursor-pointer ${
                        selectedShipping === method.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={(e) => setSelectedShipping(e.target.value)}
                        className="mr-4"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{method.name}</div>
                        <div className="text-sm text-gray-600">
                          {method.days} {method.days === 1 ? 'day' : 'days'} •{' '}
                          {cartTotal >= method.freeThreshold ? (
                            <span className="text-green-600">Free</span>
                          ) : (
                            formatCurrency(
                              convertCurrency(method.price, 'USD', currentCurrency),
                              currentCurrency
                            )
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {/* Payment Method (Placeholder) */}
              <section>
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    {t('common.secureCheckout')}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">💳</span>
                    <span>Credit/Debit Card (Stripe)</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-2xl">🅿️</span>
                    <span>PayPal</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    Payment processing will be handled securely by our payment
                    partners
                  </p>
                </div>
              </section>

              <button type="submit" className="w-full btn-primary">
                Complete Order
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>
                      {formatCurrency(
                        convertCurrency(item.price * item.quantity, 'USD', currentCurrency),
                        currentCurrency
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>{t('common.subtotal')}</span>
                  <span>
                    {formatCurrency(
                      convertCurrency(cartTotal, 'USD', currentCurrency),
                      currentCurrency
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('common.shipping')}</span>
                  <span>
                    {isFreeShipping ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatCurrency(convertedShipping, currentCurrency)
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('common.tax')}</span>
                  <span>{formatCurrency(convertedTax, currentCurrency)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{t('common.total')}</span>
                  <span>{formatCurrency(convertedTotal, currentCurrency)}</span>
                </div>
              </div>
              {formData.country !== 'US' && (
                <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
                  ⚠️ International orders may be subject to customs duties and
                  import taxes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

