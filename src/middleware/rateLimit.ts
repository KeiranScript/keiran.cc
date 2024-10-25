import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

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
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1';
  const path = request.nextUrl.pathname;

  const config = routeConfigs[path];
  if (!config) return null;

  const now = Date.now();
  const windowStart = now - config.window * 1000;

  const requestCount = await redis.zcount(`${path}:${ip}`, windowStart, now);
  const blacklistCount = await redis.zcount(
    `blacklist:${path}:${ip}`,
    now - config.blacklistWindow * 1000,
    now,
  );

  if (blacklistCount >= config.blacklistThreshold) {
    return NextResponse.json(
      { error: 'You have been blacklisted from this service' },
      { status: 403 },
    );
  }

  if (requestCount >= config.limit) {
    await redis.zadd(`blacklist:${path}:${ip}`, {
      score: now,
      member: now.toString(),
    });
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  await redis.zadd(`${path}:${ip}`, { score: now, member: now.toString() });
  await redis.zremrangebyscore(`${path}:${ip}`, 0, windowStart);

  return null;
}
