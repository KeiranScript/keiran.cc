'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, ExternalLink } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

interface FileUrlDisplayProps {
  url: string
}

export default function FileUrlDisplay({ url }: FileUrlDisplayProps) {
  const [copying, setCopying] = useState(false)
  const fullUrl = `${window.location.origin}${url}`

  const copyToClipboard = async () => {
    try {
      setCopying(true)
      await navigator.clipboard.writeText(fullUrl)
      toast({
        title: "URL copied",
        description: "The file URL has been copied to your clipboard.",
      })
    } catch (err) {
      console.error('Failed to copy: ', err)
      toast({
        title: "Copy failed",
        description: "There was an error copying the URL. Please try again.",
        variant: "destructive",
      })
    } finally {
      setCopying(false)
    }
  }

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <div className="flex items-center space-x-2">
        <Input value={fullUrl} readOnly className="flex-grow" />
        <Button onClick={copyToClipboard} disabled={copying}>
          <Copy className="mr-2 h-4 w-4" />
          {copying ? 'Copying...' : 'Copy'}
        </Button>
        <Button asChild>
          <a href={fullUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="mr-2 h-4 w-4" />
            Visit
          </a>
        </Button>
      </div>
    </div>
  )
}
