/**
 * Password Reset API
 * POST: Request password reset (sends email)
 * PUT: Reset password with token
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { sendEmail, generatePasswordResetEmail } from '@/lib/email';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESET_TOKENS_FILE = path.join(DATA_DIR, 'reset-tokens.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

interface ResetToken {
  email: string;
  token: string;
  expiresAt: string;
  used: boolean;
}

async function getResetTokens(): Promise<ResetToken[]> {
  try {
    await ensureDataDir();
    await fs.access(RESET_TOKENS_FILE);
    const data = await fs.readFile(RESET_TOKENS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveResetTokens(tokens: ResetToken[]) {
  await ensureDataDir();
  await fs.writeFile(RESET_TOKENS_FILE, JSON.stringify(tokens, null, 2));
}

async function getUsers() {
  try {
    await ensureDataDir();
    await fs.access(USERS_FILE);
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveUsers(users: any[]) {
  await ensureDataDir();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
}

// Request password reset (send email)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await getUsers();
    const user = users.find((u: any) => u.email === email);

    // Don't reveal if user exists or not (security best practice)
    // Always return success, but only send email if user exists
    if (user) {
      // Generate reset token
      const token = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

      // Save token
      const tokens = await getResetTokens();
      // Invalidate old tokens for this email
      const filteredTokens = tokens.filter((t) => t.email !== email || t.used);
      filteredTokens.push({
        email,
        token,
        expiresAt,
        used: false,
      });
      await saveResetTokens(filteredTokens);

      // Send reset email
      const emailData = generatePasswordResetEmail(token, email);
      await sendEmail({
        to: email,
        subject: emailData.subject,
        html: emailData.html,
      });
    }

    // Always return success (don't reveal if user exists)
    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    );
  }
}

// Reset password with token
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, token, newPassword } = body;

    if (!email || !token || !newPassword) {
      return NextResponse.json(
        { error: 'Email, token, and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Verify token
    const tokens = await getResetTokens();
    const resetToken = tokens.find(
      (t) => t.email === email && t.token === token && !t.used && new Date(t.expiresAt) > new Date()
    );

    if (!resetToken) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Update user password
    const users = await getUsers();
    const userIndex = users.findIndex((u: any) => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    users[userIndex].password = hashedPassword;
    await saveUsers(users);

    // Mark token as used
    const tokenIndex = tokens.findIndex((t) => t.token === token);
    if (tokenIndex !== -1) {
      tokens[tokenIndex].used = true;
      await saveResetTokens(tokens);
    }

    return NextResponse.json({
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}

