import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

const prisma = new PrismaClient();

const pasteSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  content: z.string().min(1).max(100000),
  language: z.string().max(50),
  expirationTime: z.string().optional(),
  domain: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, content, language, expirationTime, domain } =
      pasteSchema.parse(body);

    const sanitizedContent = DOMPurify.sanitize(content);

    const pasteId = nanoid(10);
    const maxExpirationTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const defaultExpirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

    let expiration = new Date(Date.now() + defaultExpirationTime);
    if (expirationTime) {
      const customExpiration = new Date(expirationTime).getTime();
      if (!isNaN(customExpiration)) {
        if (customExpiration > Date.now() + maxExpirationTime) {
          expiration = new Date(Date.now() + maxExpirationTime);
        } else {
          expiration = new Date(customExpiration);
        }
      }
    }

    const paste = await prisma.paste.create({
      data: {
        id: pasteId,
        title,
        description,
        content: sanitizedContent,
        language,
        expiresAt: expiration,
      },
    });

    const pasteUrl = `https://${domain}/p/${paste.id}`;

    return NextResponse.json({ url: pasteUrl });
  } catch (error) {
    console.error('Error creating paste:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    if (error instanceof Error) {
      console.error('Detailed error:', error.message, error.stack);
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
