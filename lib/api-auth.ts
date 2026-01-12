/**
 * API Authentication Helper
 * Verify admin authentication for API routes
 */

import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyAdminAuth(request: NextRequest): Promise<{
  authorized: boolean;
  user?: { id: string; email: string; role: string };
  error?: NextResponse;
}> {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  if (!token) {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      ),
    };
  }

  const role = (token as { role?: string }).role;
  if (role !== 'admin') {
    return {
      authorized: false,
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    user: {
      id: token.id as string,
      email: token.email as string,
      role: role || 'user',
    },
  };
}

