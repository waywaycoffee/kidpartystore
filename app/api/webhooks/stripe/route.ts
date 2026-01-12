/**
 * Stripe Webhook Handler
 * Handle payment events from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function getOrders() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(ORDERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveOrders(orders: any[]) {
  await ensureDataDir();
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2));
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 }
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const orders = await getOrders();
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);

        if (orderIndex !== -1) {
          orders[orderIndex].status = 'paid';
          orders[orderIndex].paymentIntentId = paymentIntent.id;
          orders[orderIndex].paidAt = new Date().toISOString();
          orders[orderIndex].updatedAt = new Date().toISOString();

          await saveOrders(orders);

          console.log(`Order ${orderId} marked as paid`);
        }
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        const orders = await getOrders();
        const orderIndex = orders.findIndex((o: any) => o.id === orderId);

        if (orderIndex !== -1) {
          orders[orderIndex].status = 'payment_failed';
          orders[orderIndex].updatedAt = new Date().toISOString();

          await saveOrders(orders);

          console.log(`Order ${orderId} payment failed`);
        }
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId = charge.payment_intent as string;

      if (paymentIntentId) {
        const orders = await getOrders();
        const orderIndex = orders.findIndex(
          (o: any) => o.paymentIntentId === paymentIntentId
        );

        if (orderIndex !== -1) {
          orders[orderIndex].status = 'refunded';
          orders[orderIndex].refundedAt = new Date().toISOString();
          orders[orderIndex].updatedAt = new Date().toISOString();

          await saveOrders(orders);

          console.log(`Order refunded: ${orders[orderIndex].id}`);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

