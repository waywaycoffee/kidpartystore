/**
 * Product Bundle Recommendation Component
 */

'use client';

import ProductCard from '@/components/ProductCard';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

interface ProductBundleProps {
  title: string;
  products: Product[];
  bundlePrice?: number;
}

export default function ProductBundle({ title, products, bundlePrice }: ProductBundleProps) {
  const dispatch = useAppDispatch();

  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const savings = bundlePrice ? totalPrice - bundlePrice : 0;

  const handleAddBundle = () => {
    products.forEach((product) => {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          category: product.category,
        })
      );
    });
    toast.success('Bundle items added to cart');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {bundlePrice && savings > 0 && (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            Save ${savings.toFixed(2)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0">
            <ProductCard {...product} />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-sm text-gray-600">Buy Separately:</p>
          <p className="text-lg font-semibold">${totalPrice.toFixed(2)}</p>
        </div>
        {bundlePrice && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Buy as Bundle:</p>
            <p className="text-2xl font-bold text-primary-600">
              ${bundlePrice.toFixed(2)}
            </p>
          </div>
        )}
        <button
          onClick={handleAddBundle}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Add Bundle to Cart
        </button>
      </div>
    </div>
  );
}

