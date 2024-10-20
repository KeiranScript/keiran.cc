import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { url, customAlias, expirationTime } = await request.json()

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 })
    }

    const urlPattern = new RegExp('^(https?:\\/\\/)?'+
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+
      '((\\d{1,3}\\.){3}\\d{1,3}))'+
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
      '(\\?[;&a-z\\d%_.~+=-]*)?'+
      '(\\#[-a-z\\d_]*)?$','i')
    if (!urlPattern.test(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    const shortCode = customAlias || nanoid(6)
    const maxExpirationTime = 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    const defaultExpirationTime = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

    let expiration = new Date(Date.now() + defaultExpirationTime)
    if (expirationTime) {
      const customExpiration = new Date(expirationTime).getTime()
      expiration = new Date(
        Math.min(customExpiration, Date.now() + maxExpirationTime)
      )
    }

    if (customAlias) {
      const existingUrl = await prisma.shortUrl.findUnique({
        where: { shortCode: customAlias },
      })
      if (existingUrl) {
        return NextResponse.json({ error: 'Custom alias already in use' }, { status: 409 })
      }
    }

    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: url,
        shortCode,
        expiresAt: expiration,
      },
    })

    return NextResponse.json({ shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/s/${shortUrl.shortCode}` })
  } catch (error) {
    console.error('Error shortening URL:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}