/**
 * 支付 API
 */

import { getData, saveData } from '@/lib/storage-adapter';
import { NextRequest, NextResponse } from 'next/server';

interface Order {
  id: string;
  email: string;
  status: 'pending_payment' | 'paid';
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    theme?: string;
  }>;
  shippingAddress: unknown;
  shippingMethod?: { days: number };
  paymentMethod?: { type: string; last4?: string };
  pricing: { total: number };
  couponCode?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

async function getOrders(): Promise<Order[]> {
  return await getData<Order[]>('orders.json', []);
}

async function saveOrders(orders: Order[]) {
  await saveData('orders.json', orders);
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  theme?: string;
}

interface PaymentRequestBody {
  cartItems: CartItem[];
  shippingAddress: unknown;
  shippingMethod?: { days: number };
  paymentMethod: { type: string; last4?: string };
  pricing: { total: number };
  couponCode?: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as PaymentRequestBody;
    const {
      cartItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      pricing,
      couponCode,
      email,
    } = body;

    // Validate required fields
    if (!cartItems || !shippingAddress || !paymentMethod || !pricing || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate cart items
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate pricing
    if (!pricing.total || pricing.total <= 0) {
      return NextResponse.json(
        { error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

    // 计算预计送达时间
    const shippingDays = shippingMethod?.days || 7;
    const estimatedDelivery = new Date(
      Date.now() + shippingDays * 24 * 60 * 60 * 1000
    ).toISOString();

    // Create order
    let orderStatus: 'pending_payment' | 'paid' = 'pending_payment';
    let paymentIntentId: string | undefined;
    
    // Process payment with Stripe if configured
    if (process.env.STRIPE_SECRET_KEY && paymentMethod.type === 'card') {
      try {
        const Stripe = (await import('stripe')).default;
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2023-10-16',
        });

        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(pricing.total * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            orderId: orderId,
            customerEmail: email,
          },
          automatic_payment_methods: {
            enabled: true,
          },
        });

        paymentIntentId = paymentIntent.id;
        
        // For demo: auto-confirm payment (in production, use Stripe Elements)
        if (paymentIntent.status === 'requires_payment_method') {
          // In production, this would be handled by Stripe Elements on the frontend
          // For now, we'll simulate success
          orderStatus = 'paid';
        }
      } catch (error) {
        console.error('Stripe payment error:', error);
        // Fall back to simulation if Stripe fails
        const paymentSuccess = Math.random() > 0.1; // 90% success rate
        if (paymentSuccess) {
          orderStatus = 'paid';
        }
      }
    } else {
      // Simulate payment processing (fallback when Stripe not configured)
      const paymentSuccess = Math.random() > 0.1; // 90% success rate
      if (paymentSuccess) {
        orderStatus = 'paid';
      }
    }

    const order = {
      id: orderId,
      email,
      status: orderStatus,
      items: cartItems.map((item: {
        id: string;
        name: string;
        price: number;
        quantity: number;
        image?: string;
        theme?: string;
      }) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || '/placeholder.jpg',
        theme: item.theme,
      })),
      shippingAddress,
      shippingMethod,
      paymentMethod: {
        type: paymentMethod.type,
        last4: paymentMethod.last4,
      },
      paymentIntentId,
      pricing,
      couponCode,
      estimatedDelivery,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 保存订单
    const orders = await getOrders();
    orders.push(order);
    await saveOrders(orders);

    // Auto-update inventory when order is paid
    if (orderStatus === 'paid') {
      try {
        // Update product stock using storage adapter
        const products = await getData<any[]>('products.json', []);

        // Get inventory history
        const inventoryHistory = await getData<any[]>('inventory-history.json', []);

        // Update stock for each item
        for (const item of order.items) {
          const productIndex = products.findIndex((p: any) => p.id === item.productId);
          if (productIndex >= 0) {
            const product = products[productIndex];
            const previousStock = product.stock || 0;
            const newStock = Math.max(0, previousStock - item.quantity);

            products[productIndex].stock = newStock;
            products[productIndex].updatedAt = new Date().toISOString();

            // Record inventory history
            inventoryHistory.unshift({
              id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              productId: item.productId,
              productName: item.name,
              type: 'sale',
              quantity: item.quantity,
              previousStock,
              newStock,
              reason: `Order ${order.id}`,
              createdAt: new Date().toISOString(),
            });
          }
        }

        // Save updated products and history
        await saveData('products.json', products);
        await saveData('inventory-history.json', inventoryHistory);
      } catch (inventoryError) {
        console.error('Error updating inventory:', inventoryError);
        // Don't fail the order if inventory update fails
      }
    }

    if (orderStatus === 'paid') {
      return NextResponse.json({
        success: true,
        orderId: order.id,
        order,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment failed',
          orderId: order.id,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

