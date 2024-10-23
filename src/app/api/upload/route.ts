import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const rateLimit = {
  windowMs: 1000, // 1s
  max: 1,
};

const rateLimiter = new Map();

const BASE_URL = "keiran.cc";

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
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

  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File
  const domain: string | null = data.get('domain') as string | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const originalExtension = path.extname(file.name);
  const randomName = crypto.randomBytes(4).toString('hex') + originalExtension;
  const filePath = path.join(process.cwd(), 'public', 'uploads', randomName);

  try {
    await writeFile(filePath, buffer)
    
    const base_url = domain || BASE_URL
    const rawUrl = `https://${base_url}/api/${randomName}`
    const imageUrl = `https://${base_url}/${randomName}`
  
    return NextResponse.json({ rawUrl, imageUrl })
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}
