/**
 * Theme Package Card Component
 */

'use client';

import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

interface ThemePackage {
  id: string;
  name: string;
  level: 'basic' | 'standard' | 'premium';
  price: number;
  items: Array<{ productId: string; quantity: number; name: string }>;
  savings?: number;
  image?: string;
}

interface ThemePackageCardProps {
  package: ThemePackage;
  themeName: string;
}

export default function ThemePackageCard({ package: pkg, themeName }: ThemePackageCardProps) {
  const dispatch = useAppDispatch();

  const levelLabels = {
    basic: 'Basic Package',
    standard: 'Standard Package',
    premium: 'Premium Package',
  };

  const levelColors = {
    basic: 'bg-blue-100 text-blue-800',
    standard: 'bg-purple-100 text-purple-800',
    premium: 'bg-yellow-100 text-yellow-800',
  };

  const handleAddToCart = () => {
    // Add all package items to cart
    pkg.items.forEach((item) => {
      // Simplified handling - should fetch full product info by productId
      dispatch(
        addToCart({
          id: item.productId,
          name: `${themeName} - ${item.name}`,
          price: pkg.price / pkg.items.length, // Simplified price distribution
          quantity: item.quantity,
          image: pkg.image || '/placeholder.jpg',
        })
      );
    });
    toast.success(`${pkg.name} added to cart`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
      {pkg.image && (
        <div className="aspect-video bg-gray-200">
          {/* Image placeholder */}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{pkg.name}</h3>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${levelColors[pkg.level]}`}
          >
            {levelLabels[pkg.level]}
          </span>
        </div>

        <div className="mb-4">
          <p className="text-2xl font-bold text-primary-600 mb-1">
            ${pkg.price.toFixed(2)}
          </p>
          {pkg.savings && pkg.savings > 0 && (
            <p className="text-sm text-green-600">
              Save ${pkg.savings.toFixed(2)}
            </p>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Includes:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {pkg.items.map((item, index) => (
              <li key={index}>
                • {item.name} x {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

