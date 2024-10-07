import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
}

const rateLimiter = new Map<string, number[]>()

export async function POST(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1'
  const now = Date.now()
  const windowStart = now - rateLimit.windowMs

  // Type the requestCount to ensure proper typing
  const requestCount: number[] = rateLimiter.get(ip) || []
  const requestsInWindow = requestCount.filter((timestamp: number) => timestamp > windowStart)

  if (requestsInWindow.length >= rateLimit.max) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  rateLimiter.set(ip, [...requestsInWindow, now])

  const data = await request.formData()
  const file: File | null = data.get('file') as unknown as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const originalExtension = path.extname(file.name)
  const randomName = crypto.randomBytes(4).toString('hex') + originalExtension
  const filePath = path.join(process.cwd(), 'public', 'uploads', randomName)

  try {
    await writeFile(filePath, buffer)
    const fileUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/uploads/${randomName}`
    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error('Error saving file:', error)
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 })
  }
}

