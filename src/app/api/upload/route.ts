import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const rateLimit = {
  windowMs: 1000, // 1s
  max: 1,
};

const rateLimiter = new Map();

const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'https://keiran.cc';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();
  const windowStart = now - rateLimit.windowMs;

  const requestCount: number[] = rateLimiter.get(ip) || [];
  const requestsInWindow = requestCount.filter(
    (timestamp: number) => timestamp > windowStart,
  );

  if (requestsInWindow.length >= rateLimit.max) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  rateLimiter.set(ip, [...requestsInWindow, now]);

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const domain = formData.get('domain') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalExtension = path.extname(file.name);
    const randomName =
      crypto.randomBytes(4).toString('hex') + originalExtension;
    const filePath = path.join(process.cwd(), 'public', 'uploads', randomName);

    await writeFile(filePath, buffer);
    const url = domain || base_url;
    const rawUrl = `${url}/api/${randomName}`;
    const imageUrl = `${url}/${randomName}`;

    return NextResponse.json({ rawUrl, imageUrl });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 },
    );
  }
}
