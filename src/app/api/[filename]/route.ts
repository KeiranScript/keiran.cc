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

  console.log('Requested file:', filename)
  console.log('File path:', filePath)

  try {
    // Check if the file exists
    await stat(filePath)
  } catch (error) {
    console.error('File not found:', filePath)
    // If the file doesn't exist, return a 404 response
    return new NextResponse('File not found', { status: 404 })
  }

  // Determine the content type based on the file extension
  const ext = path.extname(filename).toLowerCase()
  const contentType = getContentType(ext)

  console.log('Content type:', contentType)

  // Create a readable stream from the file
  const fileStream = createReadStream(filePath)

  // Return the file as a stream
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
    // Add more content types as needed
  }

  return contentTypes[ext] || 'application/octet-stream'
}
