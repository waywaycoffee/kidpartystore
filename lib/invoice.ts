/**
 * Invoice Generation Service
 * Generates PDF invoices for orders
 */

import PDFDocument from 'pdfkit';
import fs from 'fs/promises';
import path from 'path';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
}

interface OrderPricing {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

interface InvoiceData {
  orderId: string;
  orderDate: string;
  email: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  pricing: OrderPricing;
  couponCode?: string;
  trackingNumber?: string;
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .fillColor('#667eea')
        .text('PartyExpert', 50, 50)
        .fontSize(10)
        .fillColor('#666')
        .text('Invoice', 50, 80);

      // Invoice Details
      doc
        .fontSize(12)
        .fillColor('#000')
        .text(`Invoice #: ${data.orderId}`, 400, 50)
        .text(`Date: ${new Date(data.orderDate).toLocaleDateString()}`, 400, 70)
        .text(`Email: ${data.email}`, 400, 90);

      // Billing Address
      let yPos = 130;
      doc
        .fontSize(14)
        .fillColor('#667eea')
        .text('Bill To:', 50, yPos)
        .fontSize(10)
        .fillColor('#000')
        .text(
          `${data.shippingAddress.firstName} ${data.shippingAddress.lastName}`,
          50,
          yPos + 20
        )
        .text(data.shippingAddress.addressLine1, 50, yPos + 35)
        .text(
          data.shippingAddress.addressLine2 || '',
          50,
          yPos + 50
        )
        .text(
          `${data.shippingAddress.city}, ${data.shippingAddress.state || ''} ${data.shippingAddress.postalCode}`,
          50,
          yPos + (data.shippingAddress.addressLine2 ? 65 : 50)
        )
        .text(data.shippingAddress.country, 50, yPos + (data.shippingAddress.addressLine2 ? 80 : 65));

      // Items Table Header
      yPos = 250;
      doc
        .fontSize(10)
        .fillColor('#667eea')
        .text('Item', 50, yPos)
        .text('Quantity', 300, yPos)
        .text('Price', 400, yPos)
        .text('Total', 480, yPos)
        .moveTo(50, yPos + 15)
        .lineTo(550, yPos + 15)
        .stroke();

      // Items
      yPos += 30;
      data.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        doc
          .fontSize(10)
          .fillColor('#000')
          .text(item.name, 50, yPos, { width: 240 })
          .text(item.quantity.toString(), 300, yPos)
          .text(`$${item.price.toFixed(2)}`, 400, yPos)
          .text(`$${itemTotal.toFixed(2)}`, 480, yPos);
        yPos += 20;
      });

      // Summary
      yPos += 20;
      doc
        .moveTo(50, yPos)
        .lineTo(550, yPos)
        .stroke();

      yPos += 20;
      doc
        .text('Subtotal:', 400, yPos)
        .text(`$${data.pricing.subtotal.toFixed(2)}`, 480, yPos);

      if (data.pricing.discount > 0) {
        yPos += 20;
        doc
          .fillColor('#10b981')
          .text('Discount:', 400, yPos)
          .text(`-$${data.pricing.discount.toFixed(2)}`, 480, yPos)
          .fillColor('#000');
      }

      yPos += 20;
      doc
        .text('Shipping:', 400, yPos)
        .text(`$${data.pricing.shipping.toFixed(2)}`, 480, yPos);

      yPos += 20;
      doc
        .text('Tax:', 400, yPos)
        .text(`$${data.pricing.tax.toFixed(2)}`, 480, yPos);

      yPos += 20;
      doc
        .moveTo(400, yPos)
        .lineTo(550, yPos)
        .stroke();

      yPos += 20;
      doc
        .fontSize(14)
        .fillColor('#667eea')
        .font('Helvetica-Bold')
        .text('Total:', 400, yPos)
        .text(`$${data.pricing.total.toFixed(2)}`, 480, yPos);

      // Footer
      yPos = 700;
      doc
        .fontSize(8)
        .fillColor('#666')
        .text('Thank you for your business!', 50, yPos)
        .text('If you have any questions, please contact us at support@partyexpert.com', 50, yPos + 15);

      if (data.trackingNumber) {
        doc
          .fontSize(10)
          .fillColor('#000')
          .text(`Tracking Number: ${data.trackingNumber}`, 50, yPos + 40);
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

export async function saveInvoiceToFile(
  data: InvoiceData,
  outputPath: string
): Promise<string> {
  const pdfBuffer = await generateInvoicePDF(data);
  await fs.writeFile(outputPath, pdfBuffer);
  return outputPath;
}

