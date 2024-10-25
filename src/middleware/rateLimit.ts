import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RateLimitConfig {
  limit: number;
  window: number; // in seconds
  blacklistThreshold: number;
  blacklistWindow: number; // in seconds
}

const routeConfigs: { [key: string]: RateLimitConfig } = {
  '/api/chat': {
    limit: 5,
    window: 60,
    blacklistThreshold: 3,
    blacklistWindow: 3600,
  },
  '/api/shorten': {
    limit: 10,
    window: 60,
    blacklistThreshold: 5,
    blacklistWindow: 3600,
  },
  '/api/pastes': {
    limit: 10,
    window: 60,
    blacklistThreshold: 5,
    blacklistWindow: 3600,
  },
  '/api/upload': {
    limit: 5,
    window: 60,
    blacklistThreshold: 3,
    blacklistWindow: 3600,
  },
};

export async function rateLimit(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const path = request.nextUrl.pathname;

  const config = routeConfigs[path];
  if (!config) return null;

  const now = Date.now();
  const windowStart = now - config.window * 1000;
  const blacklistWindowStart = now - config.blacklistWindow * 1000;

  try {
    const blacklistCount = await prisma.blacklistLog.count({
      where: {
        ip,
        path,
        timestamp: {
          gt: blacklistWindowStart
        }
      }
    });

    if (blacklistCount >= config.blacklistThreshold) {
      return NextResponse.json(
        { error: 'You have been blacklisted from this service' },
        { status: 403 }
      );
    }

    const requestCount = await prisma.requestLog.count({
      where: {
        ip,
        path,
        timestamp: {
          gt: windowStart
        }
      }
    });

    if (requestCount >= config.limit) {
      await prisma.blacklistLog.create({
        data: {
          ip,
          path,
          timestamp: now
        }
      });
      
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    await prisma.requestLog.create({
      data: {
        ip,
        path,
        timestamp: now
      }
    });

    await prisma.requestLog.deleteMany({
      where: {
        timestamp: {
          lt: windowStart
        }
      }
    });

    return null;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return null;
  }
}