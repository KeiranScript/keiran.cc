import { NextRequest, NextResponse } from 'next/server'
import { stat } from 'fs/promises'
import path from 'path'
import fs from 'fs'

// Mock function to simulate getting total uploads and storage data
// Replace this with your actual logic/data retrieval
async function getFileStats() {
  return {
    totalUploads: 123, // Example number of total uploads
    totalStorageUsed: '1.2GB', // Example total storage used
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename)

  try {
    const fileStat = await stat(filePath)
    const fileSize = (fileStat.size / 1024 / 1024).toFixed(2) + ' MB' // Convert file size to MB
    const fileUrl = `${request.nextUrl.origin}/api/${filename}`
    const { totalUploads, totalStorageUsed } = await getFileStats()

    // Dynamic OG Meta Tags
    const ogTitle = `${filename} - AnonHost`
    const ogDescription = `
      File Name: ${filename}
      File Size: ${fileSize}
      Total Uploads: ${totalUploads}
      Storage: ${totalStorageUsed}
    `
    const ogImage = fileUrl
    const ogUrl = request.nextUrl.href

    // Return HTML page with dynamic OG tags
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta property="og:title" content="${ogTitle}" />
          <meta property="og:description" content="${ogDescription.trim()}" />
          <meta property="og:image" content="${ogImage}" />
          <meta property="og:url" content="${ogUrl}" />
          <meta property="og:type" content="website" />
          <title>${ogTitle}</title>
          <link rel="stylesheet" href="/_next/static/css/app.css">
        </head>
        <body class="bg-gray-100 flex justify-center items-center min-h-screen">
          <div class="text-center bg-white p-6 rounded-lg shadow-lg">
            <h1 class="text-2xl font-bold">${ogTitle}</h1>
            <p class="text-gray-600">${ogDescription.replace(/\n/g, '<br />')}</p>
            <img src="${fileUrl}" alt="File image" class="mt-4 max-w-full h-auto rounded-lg shadow-lg" />
          </div>
        </body>
      </html>
    `

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    return new NextResponse('File not found', { status: 404 })
  }
}
