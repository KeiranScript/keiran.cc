import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { title, description, content, language } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const pasteId = nanoid(10)
    const paste = await prisma.pastes.create({
      data: {
        id: pasteId,
        title,
        description,
        content,
        language,
      },
    })

    const pasteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/p/${paste.id}`

    return NextResponse.json({ url: pasteUrl })
  } catch (error) {
    console.error('Error creating paste:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}