import { NextRequest, NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pipeline } from 'stream/promises';
import { rateLimit } from '@/middleware/rateLimit';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'keiran.cc';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB in bytes

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

    const filename = generateUniqueFilename(file.name);
    const chunksDir = path.join(process.cwd(), 'public', 'uploads', 'chunks', filename);

    await fsPromises.mkdir(chunksDir, { recursive: true });

    const fileStream = file.stream();
    let chunkIndex = 0;
    let bytesRead = 0;

    const reader = fileStream.getReader();
    let result;
    while (!(result = await reader.read()).done) {
      const chunk = result.value;
      const chunkFilename = `chunk-${chunkIndex}`;
      const chunkPath = path.join(chunksDir, chunkFilename);
      await fsPromises.writeFile(chunkPath, chunk);
      bytesRead += chunk.length;
      chunkIndex++;
    }

    const url = domain || BASE_URL;
    const rawUrl = `https://${url}/api/upload-finalize`;
    const imageUrl = `https://${url}/${filename}`;

    return NextResponse.json({ rawUrl, imageUrl, filename });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 },
    );
  }
}

function generateUniqueFilename(originalName: string): string {
  const randomString = crypto.randomBytes(4).toString('hex');
  const extension = path.extname(originalName);
  return `${randomString}${extension}`;
}
