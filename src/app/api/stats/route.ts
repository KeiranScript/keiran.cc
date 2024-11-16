import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TOTAL_STORAGE = 3 * 1024 * 1024 * 1024 * 1024; // 3 TB in bytes

/**
 * Handles GET requests to fetch storage statistics.
 * Retrieves storage stats using the getStorageStats function and
 * returns them as a JSON response. If an error occurs during the
 * retrieval process, it logs the error and returns a JSON response
 * with an error message and the request URL.
 */
export async function GET(request: NextRequest) {
  try {
    const stats = await getStorageStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch storage stats', url: request.url },
      { status: 500 },
    );
  }
}

/**
 * Retrieves storage statistics for the uploads directory.
 *
 * Scans the 'public/uploads' directory to calculate the total number
 * of files and their cumulative size. It calculates the used storage
 * and available storage based on the predefined TOTAL_STORAGE limit.
 *
 * @returns An object containing:
 * - totalFiles: The number of files in the uploads directory.
 * - usedStorage: The total size of all files in bytes.
 * - availableStorage: The remaining free storage in bytes.
 * - totalStorage: The total storage capacity in bytes.
 *
 * @throws Will throw an error if there is a problem reading the directory.
 */
async function getStorageStats() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

  try {
    const files = await fs.readdir(uploadsDir);
    let totalSize = 0;
    let totalFiles = 0;

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        totalSize += stats.size;
        totalFiles++;
      }
    }

    const usedStorage = totalSize;
    const availableStorage = TOTAL_STORAGE - usedStorage;

    return {
      totalFiles,
      usedStorage,
      availableStorage,
      totalStorage: TOTAL_STORAGE,
    };
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    throw error;
  }
}
