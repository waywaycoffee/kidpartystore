/**
 * Next.js Middleware
 * Security, rate limiting, and authentication
 */

import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { rateLimit, SecurityLogger } from './lib/security';

export async function middleware(request: NextRequest) {
  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const limitResult = rateLimit(request, 100, 60000); // 100 requests per minute

    if (!limitResult.allowed) {
      SecurityLogger.log(
        'blocked',
        `Rate limit exceeded for ${request.nextUrl.pathname}`,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.nextUrl.pathname
      );

      return NextResponse.json(
        {
          error: 'Too many requests',
          resetTime: limitResult.resetTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': limitResult.resetTime.toString(),
            'Retry-After': '60',
          },
        }
      );
    }

    // Add rate limit headers
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', '100');
    response.headers.set('X-RateLimit-Remaining', limitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', limitResult.resetTime.toString());
    return response;
  }

  // Authentication for admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Allow access to login page
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!token || (token as { role?: string }).role !== 'admin') {
      SecurityLogger.log(
        'blocked',
        `Unauthorized admin access attempt: ${request.nextUrl.pathname}`,
        request.headers.get('x-forwarded-for') || 'unknown',
        request.nextUrl.pathname
      );

      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Security logging for admin routes
    SecurityLogger.log(
      'info',
      `Admin access: ${request.nextUrl.pathname}`,
      request.headers.get('x-forwarded-for') || 'unknown',
      request.nextUrl.pathname
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
};

