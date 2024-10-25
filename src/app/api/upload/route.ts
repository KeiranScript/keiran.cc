import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { rateLimit } from '@/middleware/rateLimit'

const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'keiran.cc';

export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

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
    const rawUrl = `https://${url}/api/${randomName}`;
    const imageUrl = `https://${url}/${randomName}`;

    return NextResponse.json({ rawUrl, imageUrl });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 },
    );
  }
}
