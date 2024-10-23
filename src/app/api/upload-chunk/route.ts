import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const chunk = formData.get('file') as Blob | null;
    const chunkIndex = formData.get('chunkIndex');
    const totalChunks = formData.get('totalChunks');
    const filename = formData.get('filename');

    if (!chunk || !chunkIndex || !totalChunks || !filename) {
      console.error('Missing required form data:', {
        chunk,
        chunkIndex,
        totalChunks,
        filename,
      });
      return NextResponse.json(
        { success: false, message: 'Missing required form data' },
        { status: 400 },
      );
    }

    const chunkIdx = parseInt(String(chunkIndex));
    if (isNaN(chunkIdx)) {
      console.error('Invalid chunk index:', chunkIndex);
      return NextResponse.json(
        { success: false, message: 'Invalid chunk index' },
        { status: 400 },
      );
    }

    const uploadDir = path.join(
      process.cwd(),
      'public',
      'uploads',
      'chunks',
      String(filename),
    );
    await fs.mkdir(uploadDir, { recursive: true });

    const chunkPath = path.join(uploadDir, `chunk-${chunkIdx}`);
    const buffer = Buffer.from(await chunk.arrayBuffer());
    await fs.writeFile(chunkPath, buffer);

    console.log(
      `Chunk ${chunkIdx} of ${totalChunks} for ${filename} uploaded successfully`,
    );
    return NextResponse.json({
      success: true,
      message: `Chunk ${chunkIdx} of ${totalChunks} uploaded successfully`,
    });
  } catch (error) {
    console.error('Chunk upload error:', error);
    return NextResponse.json(
      { success: false, message: 'Chunk upload failed', error: String(error) },
      { status: 500 },
    );
  }
}
