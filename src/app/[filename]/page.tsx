import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import code from '@/components/code-theme';

const STATS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/stats`;

export async function generateMetadata({ params }: { params: { filename: string } }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  let fileStats;

  try {
    fileStats = await fs.stat(filePath);
  } catch (error) {
    return notFound();
  }

  const fileSize = formatBytes(fileStats.size);
  const response = await fetch(STATS_API_URL);
  const stats = await response.json();

  let description;
  const fileType = getFileType(filename);

  if (fileType === 'code') {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const numberOfLines = fileContent.split('\n').length;
    const language = getLanguageFromExtension(filename);
    description = `🌎 Language: ${language}\n✍️ Lines: ${numberOfLines}\n📈 Total Uploads: ${stats.totalFiles}\n📊 Storage Used: ${(stats.usedStorage / 1024 / 1024 / 1024).toFixed(2)} GB`;
  } else {
    description = `📄 File Name: ${filename}\n📂 File Size: ${fileSize}\n📈 Total Uploads: ${stats.totalFiles}\n📊 Storage Used: ${(stats.usedStorage / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  const openGraphData = {
    type: 'website',
    siteName: 'AnonHost',
    title: `${filename} - AnonHost`,
    description: description,
    url: `${process.env.NEXT_PUBLIC_API_URL}/uploads/${filename}`,
    images: [{
      url: `${process.env.NEXT_PUBLIC_API_URL}/api/${filename}`,
    }],
  };

  const twitterPlayerData: Record<string, string> = {
    'twitter:card': 'player',
    'twitter:title': `${filename} - AnonHost`,
    'twitter:description': description,
    'twitter:player': `${process.env.NEXT_PUBLIC_API_URL}/api/${filename}`,
    'twitter:player:width': '1280',
    'twitter:player:height': '720',
    'twitter:player:stream': `${process.env.NEXT_PUBLIC_API_URL}/api/${filename}`,
    'twitter:image': `${process.env.NEXT_PUBLIC_API_URL}/api/${filename}`,
  };

  if (fileType === 'video') {
    openGraphData.type = 'video.other';
  }

  return {
    openGraph: openGraphData,
    twitter: twitterPlayerData,
  };
}

export default async function FilePage({ params }: { params: { filename: string } }) {
  const { filename } = params;
  const filePath = path.join(process.cwd(), 'public', 'uploads', filename);

  let fileStats;

  try {
    fileStats = await fs.stat(filePath);
  } catch (error) {
    return notFound();
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/${filename}`;
  const fileType = getFileType(filename);

  let fileContent;
  if (fileType === 'text' || fileType === 'code') {
    try {
      fileContent = await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      console.error("Error reading file:", error);
      fileContent = "Error reading file content.";
    }
  }

  return (
    <main className="flex justify-center items-center min-h-screen">
      <div className="max-w-4xl w-full p-6 rounded-lg shadow-lg">
        <Card className="p-6 rounded-lg shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">{filename}</CardTitle>
          </CardHeader>
          <CardContent>
            {fileType === 'image' ? (
              <div className="relative aspect-square mb-4">
                <Image
                  src={imageUrl}
                  alt={filename}
                  draggable="false"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            ) : fileType === 'video' ? (
              <video controls className="w-full mb-4">
                <source src={imageUrl} />
                Your browser does not support the video tag.
              </video>
            ) : fileType === 'text' || fileType === 'code' ? (
              <SyntaxHighlighter
                language={getLanguageFromExtension(filename)}
                showLineNumbers={true}
                startingLineNumber={1}
                style={code as SyntaxHighlighterProps['style']}
                className="text-white mb-4"
              >
                {typeof fileContent === 'string' ? fileContent : ""}
              </SyntaxHighlighter>
            ) : (
              <p className="text-white">Preview unavailable for this file type.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function getFileType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpeg':
    case '.png':
    case '.jpg':
    case '.gif':
      return 'image';
    case '.mp4':
      return 'video';
    case '.txt':
      return 'text';
    case '.py':
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
    case '.md':
    case '.css':
    case '.json':
    case '.xml':
    case '.html':
    case '.java':
    case '.cpp':
    case '.cs':
    case '.c':
    case '.h':
    case '.h++':
    case '.hpp':
    case '.go':
    case '.rb':
    case '.sh':
    case '.php':
    case '.sql':
    case '.ps1':
    case '.rs':
    case '.yaml':
    case '.vue':
      return 'code';
    default:
      return 'unknown';
  }
}

function getLanguageFromExtension(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.js':
      return 'javascript';
    case '.jsx':
      return 'jsx';
    case '.ts':
      return 'typescript';
    case '.tsx':
      return 'tsx';
    case '.md':
      return 'markdown';
    case '.txt':
      return 'plaintext';
    case '.css':
      return 'css';
    case '.py':
      return 'python';
    case '.json':
      return 'json';
    case '.yaml':
      return 'yaml';
    case '.xml':
      return 'xml';
    case '.html':
      return 'html';
    case '.java':
      return 'java';
    case '.rs':
      return 'rust';
    case '.vue':
      return 'vue';
    case '.cpp':
      return 'cpp';
    case '.cs':
      return 'csharp';
    case '.c':
      return 'c';
    case '.h':
    case '.h++':
    case '.hpp':
      return 'cpp';
    case '.go':
      return 'go';
    case '.rb':
      return 'ruby';
    case '.sh':
      return 'bash';
    case '.php':
      return 'php';
    case '.sql':
      return 'sql';
    case '.ps1':
      return 'powershell';
    default:
      return 'plaintext';
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
