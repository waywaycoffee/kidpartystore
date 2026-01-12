/**
 * Email Campaign Management API
 * Handles promotional emails, holiday campaigns, and product updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/api-auth';
import { emailMarketingService } from '@/lib/email-marketing';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CAMPAIGNS_FILE = path.join(DATA_DIR, 'email-campaigns.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'email-contacts.json');

async function getCampaigns() {
  try {
    await fs.access(CAMPAIGNS_FILE);
    const data = await fs.readFile(CAMPAIGNS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveCampaigns(campaigns: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2));
}

async function getContacts() {
  try {
    await fs.access(CONTACTS_FILE);
    const data = await fs.readFile(CONTACTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdminAuth(request);
    if (!authResult.authorized) {
      return authResult.error || NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const campaigns = await getCampaigns();
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
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
    const { type, subject, content, segment, scheduledAt, discountCode } = body;

    if (!type || !subject || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: type, subject, content' },
        { status: 400 }
      );
    }

    // Get contacts based on segment
    const contacts = await getContacts();
    let targetEmails: string[] = [];

    if (segment === 'all') {
      targetEmails = contacts.map((c: any) => c.email);
    } else if (segment === 'high-value') {
      targetEmails = contacts
        .filter((c: any) => c.totalSpent && c.totalSpent > 100)
        .map((c: any) => c.email);
    } else if (segment === 'repeat-customers') {
      targetEmails = contacts
        .filter((c: any) => c.orderCount && c.orderCount > 1)
        .map((c: any) => c.email);
    } else if (segment === 'new-customers') {
      targetEmails = contacts
        .filter((c: any) => c.orderCount === 1)
        .map((c: any) => c.email);
    } else {
      targetEmails = contacts.map((c: any) => c.email);
    }

    // Send email campaign
    const success = await emailMarketingService.sendPromotionalEmail(
      targetEmails,
      subject,
      content,
      segment
    );

    // Save campaign record
    const campaigns = await getCampaigns();
    const campaign = {
      id: `campaign-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      type,
      subject,
      content,
      segment,
      targetCount: targetEmails.length,
      sentAt: new Date().toISOString(),
      scheduledAt: scheduledAt || new Date().toISOString(),
      discountCode,
      status: success ? 'sent' : 'failed',
    };

    campaigns.push(campaign);
    await saveCampaigns(campaigns);

    return NextResponse.json({ campaign, success });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
}

