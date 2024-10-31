import { NextRequest, NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { rateLimit } from '@/middleware/rateLimit';

const prisma = new PrismaClient();
const base_url = process.env.NEXT_PUBLIC_BASE_URL || 'keiran.cc';
const CHUNK_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const MAX_STORAGE = 5 * 1024 * 1024 * 1024; // 5GB in bytes
const JWT_SECRET = process.env.JWT_SECRET || '';

if (JWT_SECRET === '') {
  throw new Error('JWT_SECRET is not defined');
}

async function getUserFromToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

  let token = request.headers.get('Authorization')?.split(' ')[1];
  let user;

  if (!token) {
    const id = crypto.randomUUID();
    token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

    user = await prisma.user.create({
      data: {
        id: id,
        maxStorage: MAX_STORAGE,
      },
    });

    return NextResponse.json({ token });
  } else {
    user = await getUserFromToken(token);
    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const domain = formData.get('domain') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileSize = file.size;
    const remainingStorage = MAX_STORAGE - user.storageUsed;

    if (fileSize > remainingStorage) {
      return NextResponse.json(
        { error: 'Insufficient storage' },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 8) + path.extname(file.name);
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

    const chunksDir = path.join(process.cwd(), 'public', 'uploads', 'chunks', filename);
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

    await prisma.user.update({
      where: { id: user.id },
      data: { storageUsed: user.storageUsed + fileSize },
    });

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
