/**
 * Security Utilities
 * WordPress Wordfence Security equivalent functionality
 */

import { NextRequest } from 'next/server';

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting middleware
 * Limits API requests per IP address
 */
export function rateLimit(
  request: NextRequest,
  maxRequests: number = 100,
  windowMs: number = 60000 // 1 minute
): { allowed: boolean; remaining: number; resetTime: number } {
  const ip = getClientIP(request);
  const now = Date.now();
  const key = `rate_limit_${ip}`;

  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    // Reset window
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      allowed: true,
      remaining: maxRequests - 1,
      resetTime: now + windowMs,
    };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Get client IP address
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * CSRF token generation and validation
 */
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  static generateToken(sessionId: string): string {
    const token = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    this.tokens.set(sessionId, {
      token,
      expires: Date.now() + 3600000, // 1 hour
    });
    return token;
  }

  static validateToken(sessionId: string, token: string): boolean {
    const record = this.tokens.get(sessionId);
    
    if (!record) {
      return false;
    }

    if (Date.now() > record.expires) {
      this.tokens.delete(sessionId);
      return false;
    }

    return record.token === token;
  }

  static clearToken(sessionId: string): void {
    this.tokens.delete(sessionId);
  }
}

/**
 * Input sanitization
 */
export function sanitizeInput(input: string): string {
  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Escape special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function validateURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Security logging
 */
export class SecurityLogger {
  private static logs: Array<{
    timestamp: string;
    type: 'info' | 'warning' | 'error' | 'blocked';
    message: string;
    ip?: string;
    path?: string;
  }> = [];

  static log(
    type: 'info' | 'warning' | 'error' | 'blocked',
    message: string,
    ip?: string,
    path?: string
  ): void {
    this.logs.push({
      timestamp: new Date().toISOString(),
      type,
      message,
      ip,
      path,
    });

    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }

    // In production, also log to file or external service
    console.log(`[Security ${type.toUpperCase()}] ${message}`, { ip, path });
  }

  static getLogs(limit: number = 100) {
    return this.logs.slice(-limit).reverse();
  }

  static getLogsByType(type: 'info' | 'warning' | 'error' | 'blocked') {
    return this.logs.filter((log) => log.type === type).reverse();
  }
}

