import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Update {
  id: number;
  date: string;
  title: string;
  description: string;
  type: 'maintenance' | 'feature' | 'bugfix';
}

const updates: Update[] = [
  {
    id: 1,
    date: '2024-10-19',
    title: 'Toasts temporarily disabled',
    description:
      'A bug in the toast component has resulted in the toasts needing to be temporarily disabled while I work on fixing them. No ETA as of the time of writing.',
    type: 'maintenance',
  },
  {
    id: 2,
    date: '2024-10-14',
    title: '🎉 Fixed the file chunking bug! 🎉',
    description:
      'The issue with uploading files larger than 100MB has been fixed and the upload limit is back up!',
    type: 'bugfix',
  },
];

export default function Updates() {
  const [containerHeight, setContainerHeight] = useState<number | undefined>(
    undefined,
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      const maxHeight = 300;
      setContainerHeight(Math.min(contentHeight, maxHeight));
    }
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Recent Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea
          className="w-full pr-4"
          style={{ height: containerHeight ? `${containerHeight}px` : 'auto' }}
        >
          <div ref={contentRef}>
            {updates.map((update) => (
              <div key={update.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{update.title}</h3>
                  <Badge
                    variant={
                      update.type === 'feature'
                        ? 'default'
                        : update.type === 'maintenance'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {update.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {update.date}
                </p>
                <p className="text-sm">{update.description}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
