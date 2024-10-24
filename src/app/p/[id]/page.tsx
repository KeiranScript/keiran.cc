import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import code from '@/components/code-theme';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const prisma = new PrismaClient();

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  if (!params?.id) {
    return {
      title: 'Paste Not Found',
    };
  }

  const paste = await prisma.paste.findUnique({
    where: { id: params.id },
  });

  if (!paste) {
    return {
      title: 'Paste Not Found',
    };
  }

  return {
    title: paste.title,
    description: paste.description || 'View this paste on AnonHost',
    openGraph: {
      title: paste.title,
      description: paste.description || 'View this paste on AnonHost',
      type: 'article',
    },
  };
}

export default async function PasteView({
  params,
}: {
  params: { id: string };
}) {
  if (!params?.id) {
    notFound();
  }

  const paste = await prisma.paste.findUnique({
    where: { id: params.id },
  });

  if (!paste) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{paste.title}</CardTitle>
          {paste.description && (
            <p className="text-muted-foreground">{paste.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <SyntaxHighlighter
            language={paste.language}
            style={code as SyntaxHighlighter['props']['style']}
            className="rounded-md"
            showLineNumbers
          >
            {paste.content}
          </SyntaxHighlighter>
        </CardContent>
      </Card>
    </div>
  );
}
