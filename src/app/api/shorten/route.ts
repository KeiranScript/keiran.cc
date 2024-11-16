import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { PrismaClient } from '@prisma/client';
import { sanitizeUrl } from '@braintree/sanitize-url';
import { z } from 'zod';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { rateLimit } from '@/middleware/rateLimit';

const prisma = new PrismaClient();

/**
 * Validates a request body for the /api/shorten endpoint.
 *
 * @property {string} url - The URL to shorten. Must be a valid URL.
 * @property {string} [customAlias] - An optional custom alias for the shortened
 * URL. Must only contain letters, numbers, hyphens, and underscores, and must
 * be 50 characters or less.
 * @property {string} [expirationTime] - An optional datetime string in the
 * format of a JavaScript Date object (e.g. "2024-03-20T12:30:00.000Z"). If
 * provided, the shortened URL will expire at the specified time.
 * @property {string} [domain] - The domain to use for the shortened URL. If not
 * provided, the default domain (keiran.cc) will be used.
 */
const shortenSchema = z.object({
  url: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .transform(sanitizeUrl),
  customAlias: z
    .string()
    .regex(/^[a-zA-Z0-9-_]*$/, {
      message:
        'Custom alias can only contain letters, numbers, hyphens, and underscores',
    })
    .max(50)
    .optional(),
  expirationTime: z
    .string()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: 'Invalid datetime format' },
    )
    .optional(),
  domain: z.string().min(1).optional(),
});

  /**
   * Handles POST requests to the /api/shorten endpoint.
   *
   * The request body should contain the following properties:
   *
   * - `url`: The URL to shorten. Must be a valid URL.
   * - `customAlias`: An optional custom alias for the shortened URL. Must only
   * contain letters, numbers, hyphens, and underscores, and must be 50 characters
   * or less.
   * - `expirationTime`: An optional datetime string in the format of a JavaScript
   * Date object (e.g. "2024-03-20T12:30:00.000Z"). If provided, the shortened
   * URL will expire at the specified time.
   * - `domain`: The domain to use for the shortened URL. If not provided, the
   * default domain (keiran.cc) will be used.
   *
   * The response will contain a JSON object with the following properties:
   *
   * - `shortUrl`: The shortened URL.
   *
   * If the request is invalid, or if an error occurs while processing the
   * request, the response will contain a JSON object with an "error" property
   * that describes the error. The HTTP status code of the response will be
   * 400 or 500, depending on the type of error.
   */
  
export async function POST(request: NextRequest) {
  const rateLimitResult = await rateLimit(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    let body;
    const contentType = request.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
    }

    console.log('Received body:', body);

    const { url, customAlias, expirationTime, domain } =
      shortenSchema.parse(body);

    const shortCode = customAlias || nanoid(6);
    const maxExpirationTime = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    const defaultExpirationTime = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    let expiration = new Date(Date.now() + defaultExpirationTime);
    if (expirationTime) {
      const customExpiration = new Date(expirationTime).getTime();
      if (customExpiration > Date.now() + maxExpirationTime) {
        expiration = new Date(Date.now() + maxExpirationTime);
      } else {
        expiration = new Date(customExpiration);
      }
    }

    if (customAlias) {
      const existingUrl = await prisma.shortUrl.findUnique({
        where: { shortCode: customAlias },
      });
      if (existingUrl) {
        return NextResponse.json(
          { error: 'Custom alias already in use' },
          { status: 409 },
        );
      }
    }

    const shortUrl = await prisma.shortUrl.create({
      data: {
        originalUrl: url,
        shortCode,
        expiresAt: expiration,
      },
    });

    const returnDomain = domain || 'keiran.cc';
    return NextResponse.json({
      shortUrl: `https://${returnDomain}/s/${shortUrl.shortCode}`,
    });
  } catch (error) {
    console.error('Error shortening URL:', error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return NextResponse.json({ error: errorMessages }, { status: 400 });
    }
    if (error instanceof PrismaClientKnownRequestError) {
      console.error('Prisma error:', error.message);
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 },
      );
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
