/**
 * Cart Sync Utility
 * Syncs cart data to server for abandoned cart tracking
 */

import { CartItem } from '@/store/slices/cartSlice';

interface SyncCartParams {
  email?: string;
  userId?: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export async function syncCartToServer(params: SyncCartParams): Promise<boolean> {
  try {
    const response = await fetch('/api/cart/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    return response.ok;
  } catch (error) {
    console.error('Error syncing cart to server:', error);
    return false;
  }
}

export async function recoverCart(cartId: string): Promise<CartItem[] | null> {
  try {
    const response = await fetch(`/api/cart/recover?cartId=${cartId}`);
    if (response.ok) {
      const data = await response.json();
      return data.cart?.items || null;
    }
    return null;
  } catch (error) {
    console.error('Error recovering cart:', error);
    return null;
  }
}

