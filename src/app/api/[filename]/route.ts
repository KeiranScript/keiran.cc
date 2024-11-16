import { NextRequest, NextResponse } from 'next/server';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import path from 'path';

/**
 * GET /api/[filename]
 *
 * Downloads a file from the /public/uploads directory.
 *
 * @param {NextRequest} request - The request object.
 * @param {Object} { params } - The route parameter object.
 * @param {string} params.filename - The filename to download.
 * @return {NextResponse} The response object.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } },
) {
  const filename = params.filename;
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  console.log('File uploaded:', filePath);

  try {
    await stat(filePath);
  } catch (error) {
    return new NextResponse('File not found', { status: 404 });
  }

  const ext = path.extname(filename).toLowerCase();
  const contentType = getContentType(ext);

  const fileStream = createReadStream(filePath);

  return new NextResponse(fileStream as any, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}

/**
 * Returns the MIME type for a given file extension.
 *
 * @param {string} ext - The file extension (e.g., '.jpg', '.png').
 * @return {string} The corresponding MIME type or 'application/octet-stream' if unknown.
 */
function getContentType(ext: string): string {
  const contentTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
  };

  return contentTypes[ext] || 'application/octet-stream';
}
