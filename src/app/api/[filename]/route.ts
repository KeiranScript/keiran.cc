import { NextRequest, NextResponse } from 'next/server'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

  console.log('File uploaded:', filePath)
  console.log(request)

  try {
    await stat(filePath)
  } catch (error) {
    return new NextResponse('File not found', { status: 404 })
  }

  const ext = path.extname(filename).toLowerCase()
  const contentType = getContentType(ext)

  const fileStream = createReadStream(filePath)

  return new NextResponse(fileStream as any, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  })
}

function getContentType(ext: string): string {
  const contentTypes: { [key: string]: string } = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  }

  return contentTypes[ext] || 'application/octet-stream'
}
