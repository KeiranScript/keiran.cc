'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, ExternalLink } from 'lucide-react'
import { Toast, ToastTitle, ToastDescription } from '@/components/ui/toast'

interface FileUrlDisplayProps {
  url: string
}

export default function FileUrlDisplay({ url }: FileUrlDisplayProps) {
  const [copying, setCopying] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastTitle, setToastTitle] = useState('')
  const [toastDescription, setToastDescription] = useState('')

  // Prepend the base URL from environment variables
  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL}${url}`

  const copyToClipboard = async () => {
    try {
      setCopying(true)
      await navigator.clipboard.writeText(fullUrl)

      // Set toast message for success
      setToastTitle("URL copied")
      setToastDescription("The file URL has been copied to your clipboard.")
    } catch (err) {
      console.error('Failed to copy: ', err)

      // Set toast message for error
      setToastTitle("Copy failed")
      setToastDescription("There was an error copying the URL. Please try again.")
    } finally {
      setCopying(false)
      setShowToast(true)
    }
  }

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Uploaded File URL:</h3>
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

      {/* Toast Notification */}
      {showToast && (
        <Toast onOpenChange={setShowToast}>
          <ToastTitle>{toastTitle}</ToastTitle>
          <ToastDescription>{toastDescription}</ToastDescription>
        </Toast>
      )}
    </div>
  )
}

