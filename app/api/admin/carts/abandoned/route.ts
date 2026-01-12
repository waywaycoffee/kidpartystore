/**
 * Abandoned Carts API
 * GET: Get abandoned carts
 * POST: Mark cart as recovered or send reminder
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/api-auth';
import { sendEmail } from '@/lib/email';

const DATA_DIR = path.join(process.cwd(), 'data');
const CARTS_FILE = path.join(DATA_DIR, 'carts.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface CartData {
  id: string;
  email?: string;
  userId?: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  total: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
  lastActivityAt: string;
  abandoned: boolean;
  reminderSent: boolean;
}

async function getCarts(): Promise<CartData[]> {
  try {
    await ensureDataDir();
    await fs.access(CARTS_FILE);
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCarts(carts: CartData[]) {
  await ensureDataDir();
  await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
}

// Mark carts as abandoned (called by cron job or scheduled task)
export async function markAbandonedCarts() {
  const carts = await getCarts();
  const now = Date.now();
  const ABANDONED_THRESHOLD = 24 * 60 * 60 * 1000; // 24 hours

  let updated = false;
  carts.forEach((cart) => {
    if (!cart.abandoned && cart.lastActivityAt) {
      const lastActivity = new Date(cart.lastActivityAt).getTime();
      if (now - lastActivity > ABANDONED_THRESHOLD) {
        cart.abandoned = true;
        updated = true;
      }
    }
  });

  if (updated) {
    await saveCarts(carts);
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Mark abandoned carts first
    await markAbandonedCarts();

    const carts = await getCarts();
    const abandonedCarts = carts.filter((c) => c.abandoned);

    // Sort by last activity (oldest first)
    abandonedCarts.sort(
      (a, b) =>
        new Date(a.lastActivityAt).getTime() - new Date(b.lastActivityAt).getTime()
    );

    return NextResponse.json({ carts: abandonedCarts });
  } catch (error) {
    console.error('Error fetching abandoned carts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch abandoned carts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { cartId, action } = body; // action: 'send_reminder' or 'mark_recovered'

    const carts = await getCarts();
    const cartIndex = carts.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const cart = carts[cartIndex];

    if (action === 'send_reminder' && cart.email) {
      // Send recovery email
      const itemsHtml = cart.items
        .map(
          (item) => `
        <tr>
          <td style="padding: 10px;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
          </td>
          <td style="padding: 10px;">
            <strong>${item.name}</strong><br>
            <span style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</span>
          </td>
          <td style="padding: 10px; text-align: right;">
            $${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>
      `
        )
        .join('');

      const recoveryUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart?recover=${cart.id}`;

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Complete Your Purchase</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🛒 You Left Items in Your Cart!</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px;">Hi there! We noticed you left some items in your cart. Don't miss out on these great products!</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="margin-top: 0; color: #667eea;">Your Cart Items</h2>
              <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
              </table>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #667eea;">
                <div style="text-align: right;">
                  <strong style="font-size: 18px; color: #667eea;">Total: $${cart.total.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <a href="${recoveryUrl}" 
                 style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Complete Your Purchase
              </a>
            </div>

            <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
              This link will expire in 7 days. If you have any questions, please contact us at <a href="mailto:support@partyexpert.com">support@partyexpert.com</a>
            </p>
          </div>
        </body>
        </html>
      `;

      await sendEmail({
        to: cart.email,
        subject: 'Complete Your Purchase - Items Waiting in Your Cart',
        html: emailHtml,
      });

      cart.reminderSent = true;
      cart.updatedAt = new Date().toISOString();
      carts[cartIndex] = cart;
      await saveCarts(carts);

      return NextResponse.json({ success: true, message: 'Reminder email sent' });
    } else if (action === 'mark_recovered') {
      cart.abandoned = false;
      cart.updatedAt = new Date().toISOString();
      carts[cartIndex] = cart;
      await saveCarts(carts);

      return NextResponse.json({ success: true, message: 'Cart marked as recovered' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing abandoned cart:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

