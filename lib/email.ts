/**
 * Email Service
 * Handles sending transactional emails (order confirmations, shipping notifications, password reset)
 */

import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OrderEmailData {
  orderId: string;
  email: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    discount: number;
    shipping: number;
    tax: number;
    total: number;
  };
  estimatedDelivery?: string;
  trackingNumber?: string;
  status?: string;
}

// Create transporter
function createTransporter() {
  // Use SMTP if configured, otherwise use a test account (for development)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // For development: use Ethereal Email (test account)
  // In production, you should configure real SMTP credentials
  return nodemailer.createTransporter({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER || 'ethereal.user@ethereal.email',
      pass: process.env.ETHEREAL_PASS || 'ethereal.pass',
    },
  });
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transporter = createTransporter();
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER || 'noreply@partyexpert.com';

    await transporter.sendMail({
      from: `PartyExpert <${fromEmail}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text || options.html.replace(/<[^>]*>/g, ''),
    });

    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

export function generateOrderConfirmationEmail(data: OrderEmailData): { subject: string; html: string } {
  const { orderId, items, shippingAddress, pricing, estimatedDelivery } = data;

  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image || '/placeholder.jpg'}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.name}</strong><br>
        <span style="color: #666; font-size: 14px;">Quantity: ${item.quantity}</span>
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">🎉 Order Confirmed!</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Thank you for your order! We've received your order and will begin processing it shortly.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #667eea;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString()}</p>` : ''}
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #667eea;">Items Ordered</h3>
          <table style="width: 100%; border-collapse: collapse;">
            ${itemsHtml}
          </table>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #667eea;">Shipping Address</h3>
          <p>
            ${shippingAddress.firstName} ${shippingAddress.lastName}<br>
            ${shippingAddress.addressLine1}<br>
            ${shippingAddress.addressLine2 ? `${shippingAddress.addressLine2}<br>` : ''}
            ${shippingAddress.city}, ${shippingAddress.state || ''} ${shippingAddress.postalCode}<br>
            ${shippingAddress.country}
          </p>
        </div>

        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #667eea;">Order Summary</h3>
          <table style="width: 100%;">
            <tr>
              <td style="padding: 8px 0;">Subtotal:</td>
              <td style="text-align: right; padding: 8px 0;">$${pricing.subtotal.toFixed(2)}</td>
            </tr>
            ${pricing.discount > 0 ? `
            <tr>
              <td style="padding: 8px 0;">Discount:</td>
              <td style="text-align: right; padding: 8px 0; color: #10b981;">-$${pricing.discount.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0;">Shipping:</td>
              <td style="text-align: right; padding: 8px 0;">$${pricing.shipping.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">Tax:</td>
              <td style="text-align: right; padding: 8px 0;">$${pricing.tax.toFixed(2)}</td>
            </tr>
            <tr style="border-top: 2px solid #667eea;">
              <td style="padding: 12px 0; font-size: 18px; font-weight: bold;">Total:</td>
              <td style="text-align: right; padding: 12px 0; font-size: 18px; font-weight: bold; color: #667eea;">$${pricing.total.toFixed(2)}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/orders/${orderId}" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            View Order Details
          </a>
        </div>

        <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
          If you have any questions, please contact us at <a href="mailto:support@partyexpert.com">support@partyexpert.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `Order Confirmation - ${orderId}`,
    html,
  };
}

export function generateShippingNotificationEmail(data: OrderEmailData): { subject: string; html: string } {
  const { orderId, items, trackingNumber, estimatedDelivery } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Shipped</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">📦 Your Order Has Shipped!</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">Great news! Your order has been shipped and is on its way to you.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #10b981;">Order Information</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          ${trackingNumber ? `<p><strong>Tracking Number:</strong> <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px;">${trackingNumber}</code></p>` : ''}
          ${estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(estimatedDelivery).toLocaleDateString()}</p>` : ''}
        </div>

        ${trackingNumber ? `
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="https://tracking.example.com/${trackingNumber}" 
             style="display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Track Your Package
          </a>
        </div>
        ` : ''}

        <p style="margin-top: 30px; font-size: 14px; color: #666; text-align: center;">
          If you have any questions, please contact us at <a href="mailto:support@partyexpert.com">support@partyexpert.com</a>
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: `Your Order Has Shipped - ${orderId}`,
    html,
  };
}

export function generatePasswordResetEmail(resetToken: string, email: string): { subject: string; html: string } {
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">🔐 Password Reset Request</h1>
      </div>
      
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
        <p style="font-size: 16px;">We received a request to reset your password for your PartyExpert account.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <a href="${resetUrl}" 
             style="display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; color: #666;">
          If you didn't request this password reset, please ignore this email. This link will expire in 1 hour.
        </p>

        <p style="font-size: 12px; color: #999; margin-top: 30px;">
          Or copy and paste this link into your browser:<br>
          <code style="background: #f3f4f6; padding: 4px 8px; border-radius: 4px; word-break: break-all;">${resetUrl}</code>
        </p>
      </div>
    </body>
    </html>
  `;

  return {
    subject: 'Password Reset Request - PartyExpert',
    html,
  };
}

