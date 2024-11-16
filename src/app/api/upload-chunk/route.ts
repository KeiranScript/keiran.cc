import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

  /**
   * Handles POST requests to the /api/upload-chunk endpoint.
   *
   * The request should contain the following form data:
   *
   * - `file`: A Blob containing the chunk of the file to be uploaded.
   * - `chunkIndex`: The index of the chunk in the overall file.
   * - `totalChunks`: The total number of chunks in the overall file.
   * - `filename`: The name of the file to be uploaded.
   *
   * The response will contain a JSON object with the following properties:
   *
   * - `success`: A boolean indicating whether the request was successful.
   * - `message`: A string describing the result of the request.
   * - `error`: A string describing any error that occurred during processing
   *   of the request.
   *
   * If the request is invalid, or if an error occurs while processing the
   * request, the response will contain a JSON object with an "error" property
   * that describes the error. The HTTP status code of the response will be
   * 400 or 500, depending on the type of error.
   */
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
