import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const TOTAL_STORAGE = 3 * 1024 * 1024 * 1024 * 1024; // 3 TB in bytes

export async function GET(request: NextRequest) {
  try {
    const stats = await getStorageStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching storage stats:', error);
    return NextResponse.json({ error: 'Failed to fetch storage stats' }, { status: 500 });
  }
}

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
