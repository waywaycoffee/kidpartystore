/**
 * Product Variant Selector Component
 * Allows users to select product variants (color, size, etc.)
 */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface VariantAttribute {
  name: string; // e.g., "Color", "Size"
  value: string; // e.g., "Red", "Large"
}

interface ProductVariant {
  id: string;
  attributes: VariantAttribute[];
  price: number;
  stock: number;
  sku?: string;
  image?: string;
}

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  basePrice: number;
  baseStock: number;
  onVariantChange: (variant: ProductVariant | null) => void;
}

export default function ProductVariantSelector({
  variants,
  basePrice,
  baseStock,
  onVariantChange,
}: ProductVariantSelectorProps) {
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Extract unique attribute names and values
  const attributeOptions: Record<string, string[]> = {};
  variants.forEach((variant) => {
    variant.attributes.forEach((attr) => {
      if (!attributeOptions[attr.name]) {
        attributeOptions[attr.name] = [];
      }
      if (!attributeOptions[attr.name].includes(attr.value)) {
        attributeOptions[attr.name].push(attr.value);
      }
    });
  });

  // Find matching variant based on selected attributes
  useEffect(() => {
    if (Object.keys(selectedAttributes).length === 0) {
      setSelectedVariant(null);
      onVariantChange(null);
      return;
    }

    const matchingVariant = variants.find((variant) => {
      return variant.attributes.every((attr) => {
        return selectedAttributes[attr.name] === attr.value;
      });
    });

    setSelectedVariant(matchingVariant || null);
    onVariantChange(matchingVariant || null);
  }, [selectedAttributes, variants, onVariantChange]);

  const handleAttributeChange = (attributeName: string, value: string) => {
    setSelectedAttributes((prev) => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const currentPrice = selectedVariant?.price ?? basePrice;
  const currentStock = selectedVariant?.stock ?? baseStock;
  const currentImage = selectedVariant?.image;

  return (
    <div className="space-y-4">
      {/* Attribute Selectors */}
      {Object.entries(attributeOptions).map(([attributeName, values]) => (
        <div key={attributeName}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {attributeName}:
            {selectedAttributes[attributeName] && (
              <span className="ml-2 text-gray-500">
                {selectedAttributes[attributeName]}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => {
              const isSelected = selectedAttributes[attributeName] === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleAttributeChange(attributeName, value)}
                  className={`px-4 py-2 border-2 rounded-lg transition-colors ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {value}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Variant Info */}
      {selectedVariant && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Selected Variant:</p>
              {selectedVariant.sku && (
                <p className="text-xs text-gray-500">SKU: {selectedVariant.sku}</p>
              )}
            </div>
            {currentImage && (
              <div className="w-16 h-16 relative">
                <Image
                  src={currentImage}
                  alt="Variant"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Price and Stock Display */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            ${currentPrice.toFixed(2)}
            {selectedVariant && selectedVariant.price !== basePrice && (
              <span className="text-sm text-gray-500 line-through ml-2">
                ${basePrice.toFixed(2)}
              </span>
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {currentStock > 0 ? (
              <span className="text-green-600 font-semibold">
                {currentStock} in stock
              </span>
            ) : (
              <span className="text-red-600 font-semibold">Out of stock</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

