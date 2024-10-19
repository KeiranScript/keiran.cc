import { Metadata } from 'next';
import path from 'path';
import fs from 'fs/promises';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import code from '@/components/code-theme';

const STATS_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/stats`;

export async function generateMetadata({ params }: { params: { filename: string } }): Promise<Metadata> {
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

  let numberOfLines = 0;
  const fileType = getFileType(filename);
  if (fileType === 'code') {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    numberOfLines = fileContent.split('\n').length;
  }

  let description;
  if (fileType === 'code') {
    const language = getLanguageFromExtension(filename);
    description = `📄 Language: ${language}\n📂 Lines: ${numberOfLines}\n📈 Total Uploads: ${stats.totalFiles}\n📊 Storage Used: ${(stats.usedStorage / 1024 / 1024 / 1024).toFixed(2)} GB`;
  } else {
    description = `File Name: ${filename}\nFile Size: ${fileSize}\nTotal Uploads: ${stats.totalFiles}\nStorage: ${(stats.usedStorage / 1024 / 1024 / 1024).toFixed(2)} GB`;
  }

  return {
    title: `${filename} - AnonHost`,
    description,
    openGraph: {
      type: 'website',
      siteName: 'AnonHost',
      title: `${filename} - AnonHost`,
      description: description.replace(/\n/g, ' '),
      images: [{
        url: `${process.env.NEXT_PUBLIC_API_URL}/api/${filename}`,
      }],
      url: `${process.env.NEXT_PUBLIC_API_URL}`,
    },
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

  const fileSize = formatBytes(fileStats.size);

  const response = await fetch(STATS_API_URL);
  const stats = await response.json();

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
    <div className="container">
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
                layout="fill"
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
  );
}

function getFileType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpeg':
      return 'image';
    case '.png':
      return 'image';
    case '.jpg':
      return 'image';
    case '.gif':
      return 'image';
    case '.mp4':
      return 'video';
    case '.txt':
      return 'text';
    case '.py':
      return 'code';
    case '.js':
      return 'code';
    case '.jsx':
      return 'code';
    case '.ts':
      return 'code';
    case '.tsx':
      return 'code';
    case '.md':
      return 'code';
    case '.css':
      return 'code';
    case '.json':
      return 'code';
    case '.xml':
      return 'code';
    case '.html':
      return 'code';
    case '.java':
      return 'code';
    case '.cpp':
      return 'code';
    case '.cs':
      return 'code';
    case '.c':
      return 'code';
    case '.h':
      return 'code';
    case '.h++':
      return 'code';
    case '.hpp':
      return 'code';
    case '.go':
      return 'code';
    case '.rb':
      return 'code';
    case '.sh':
      return 'code';
    case '.php':
      return 'code';
    case '.sql':
      return 'code';
    case '.ps1':
      return 'code';
    case '.rs':
      return 'code';
    case '.yaml':
      return 'code';
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
      return 'vue'
    case '.cpp':
      return 'cpp';
    case '.cs':
      return 'csharp';
    case '.c':
      return 'c';
    case '.h':
      return 'c';
    case '.h++':
      return 'cpp';
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