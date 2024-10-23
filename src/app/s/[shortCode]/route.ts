import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { shortCode: string } },
) {
  const shortCode = params.shortCode;

  try {
    const shortUrl = await prisma.shortUrl.findUnique({
      where: { shortCode },
    });

    if (!shortUrl) {
      return NextResponse.json(
        { error: 'Short URL not found' },
        { status: 404 },
      );
    }

    if (shortUrl.expiresAt && shortUrl.expiresAt < new Date()) {
      await prisma.shortUrl.delete({ where: { id: shortUrl.id } });
      return NextResponse.json(
        { error: 'Short URL has expired' },
        { status: 410 },
      );
    }

    return NextResponse.redirect(shortUrl.originalUrl);
  } catch (error) {
    console.error('Error retrieving short URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
