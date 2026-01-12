/**
 * Referral Program API
 * Handles referral tracking and rewards
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const REFERRALS_FILE = path.join(DATA_DIR, 'referrals.json');

async function getReferrals() {
  try {
    await fs.access(REFERRALS_FILE);
    const data = await fs.readFile(REFERRALS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveReferrals(referrals: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(REFERRALS_FILE, JSON.stringify(referrals, null, 2));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { referrerEmail, referredEmail, orderId } = body;

    if (!referrerEmail || !referredEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const referrals = await getReferrals();
    
    // Check if referral already exists
    const existingReferral = referrals.find(
      (r: any) => r.referrerEmail === referrerEmail && r.referredEmail === referredEmail
    );

    if (existingReferral) {
      return NextResponse.json(
        { error: 'Referral already exists' },
        { status: 400 }
      );
    }

    // Create referral record
    const referral = {
      id: `ref-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      referrerEmail,
      referredEmail,
      orderId,
      createdAt: new Date().toISOString(),
      referrerRewarded: false,
      referredRewarded: false,
      status: 'pending', // pending, completed, rewarded
    };

    referrals.push(referral);
    await saveReferrals(referrals);

    return NextResponse.json({ referral, success: true });
  } catch (error) {
    console.error('Error creating referral:', error);
    return NextResponse.json(
      { error: 'Failed to create referral' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');

    const referrals = await getReferrals();

    if (email) {
      const userReferrals = referrals.filter(
        (r: any) => r.referrerEmail === email || r.referredEmail === email
      );
      return NextResponse.json({ referrals: userReferrals });
    }

    return NextResponse.json({ referrals });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referrals' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { referralId, status, rewardReferrer, rewardReferred } = body;

    if (!referralId) {
      return NextResponse.json(
        { error: 'Referral ID required' },
        { status: 400 }
      );
    }

    const referrals = await getReferrals();
    const referralIndex = referrals.findIndex((r: any) => r.id === referralId);

    if (referralIndex === -1) {
      return NextResponse.json(
        { error: 'Referral not found' },
        { status: 404 }
      );
    }

    // Update referral
    if (status) referrals[referralIndex].status = status;
    if (rewardReferrer !== undefined) referrals[referralIndex].referrerRewarded = rewardReferrer;
    if (rewardReferred !== undefined) referrals[referralIndex].referredRewarded = rewardReferred;

    await saveReferrals(referrals);

    return NextResponse.json({ referral: referrals[referralIndex], success: true });
  } catch (error) {
    console.error('Error updating referral:', error);
    return NextResponse.json(
      { error: 'Failed to update referral' },
      { status: 500 }
    );
  }
}

