import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extracting form data
    const chunk = formData.get('file') as Blob | null
    const chunkIndex = String(formData.get('chunkIndex') || '')
    const totalChunks = String(formData.get('totalChunks') || '')
    const filename = String(formData.get('filename') || '')

    // Check required fields
    if (!chunk || !chunkIndex || !totalChunks || !filename) {
      return new NextResponse('Missing required form data', { status: 400 })
    }

    // Parse chunk index
    const chunkIdx = parseInt(chunkIndex)
    if (isNaN(chunkIdx)) {
      return new NextResponse('Invalid chunk index', { status: 400 })
    }

    // Create directory for chunks
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'chunks', filename)
    await fs.mkdir(uploadDir, { recursive: true })

    // Save chunk to disk
    const chunkPath = path.join(uploadDir, `chunk-${chunkIndex}`)
    const buffer = Buffer.from(await chunk.arrayBuffer())
    await fs.writeFile(chunkPath, buffer)

    return NextResponse.json({ success: true, message: `Chunk ${chunkIndex} of ${totalChunks} uploaded successfully` })
  } catch (error) {
    console.error('Chunk upload error:', error)
    return new NextResponse('Chunk upload failed', { status: 500 })
  }
}
