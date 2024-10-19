import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { createWriteStream } from 'fs'

function generateRandomFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename);

  const generateRandomString = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const randomName = generateRandomString(6) + ext;
  return randomName;
}

export async function POST(request: NextRequest) {
  try {
    const { filename } = await request.json()

    const chunksDir = path.join(process.cwd(), 'public', 'uploads', 'chunks', filename)

    const finalFilename = generateRandomFilename(filename)
    const finalFilePath = path.join(process.cwd(), 'public', 'uploads', finalFilename)

    const chunkFiles = await fs.readdir(chunksDir)
    chunkFiles.sort((a, b) => {
      const aIndex = parseInt(a.split('-')[1])
      const bIndex = parseInt(b.split('-')[1])
      return aIndex - bIndex
    })

    const writeStream = createWriteStream(finalFilePath)

    for (const chunkFile of chunkFiles) {
      const chunkPath = path.join(chunksDir, chunkFile)
      const chunk = await fs.readFile(chunkPath)
      writeStream.write(chunk)
    }

    await new Promise<void>((resolve, reject) => {
      writeStream.end((err: Error | null) => {
        if (err) reject(err)
        else resolve()
      })
    })

    await fs.rm(chunksDir, { recursive: true, force: true })

    return NextResponse.json({ url: `/f/${finalFilename}` })
  } catch (error) {
    console.error('Finalization error:', error)
    return new NextResponse('File finalization failed', { status: 500 })
  }
}
