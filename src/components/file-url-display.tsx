'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUrlDisplayProps {
  url: string;
}

export default function FileUrlDisplay({ url }: FileUrlDisplayProps) {
  const { toast } = useToast();

  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(fullUrl);
  };

  return (
    <div className="mt-4 p-4 border rounded-lg">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
        <Input
          value={fullUrl}
          readOnly
          className="flex-grow"
          aria-label="File URL"
        />
        <div className="flex space-x-2">
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            aria-label="Copy URL to clipboard"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </Button>
          <Button asChild variant="ghost">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open file URL in new tab"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
