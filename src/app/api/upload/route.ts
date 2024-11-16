import { NextRequest, NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { rateLimit } from '@/middleware/rateLimit';

const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'keiran.cc';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB in bytes

/**
 * Handles POST requests to the /api/upload endpoint.
 *
 * The request should contain a "file" field, which should be a File object.
 * The request may contain a "domain" field, which should be a string. This
 * field is used to override the default domain for the URL that is returned
 * in the response.
 *
 * The response will contain a JSON object with the following properties:
 *
 * - `rawUrl`: The URL of the uploaded file, without any formatting.
 * - `imageUrl`: The URL of the uploaded file, formatted as an image.
 *
 * If the request is invalid, or if an error occurs while processing the
 * request, the response will contain a JSON object with an "error" property
 * that describes the error. The HTTP status code of the response will be
 * 400 or 500, depending on the type of error.
 */
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename =
      crypto
        .randomBytes(4)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 8) + path.extname(file.name);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    const chunksDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'chunks',
      filename,
    );
    await fsPromises.mkdir(chunksDir, { recursive: true });

    const totalChunks = Math.ceil(buffer.length / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, buffer.length);
      const chunk = buffer.subarray(start, end);
      const chunkPath = path.join(chunksDir, `chunk-${i}`);
      await fsPromises.writeFile(chunkPath, chunk);
    }

    const writeStream = fs.createWriteStream(filePath);
    for (let i = 0; i < totalChunks; i++) {
      const chunkPath = path.join(chunksDir, `chunk-${i}`);
      const chunkBuffer = await fsPromises.readFile(chunkPath);
      writeStream.write(chunkBuffer);
    }
    writeStream.end();

    await fsPromises.rm(chunksDir, { recursive: true, force: true });

    const url = domain || base_url;
    const rawUrl = `${url}/api/${filename}`;
    const imageUrl = `${url}/${filename}`;

    return NextResponse.json({ rawUrl, imageUrl });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 },
    );
  }
}
