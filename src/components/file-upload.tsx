'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Loader2, File } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import FileUrlDisplay from '@/components/file-url-display'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'image/*': [],
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
    },
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      setUploadedFileUrl(data.url)
      toast({
        title: "File uploaded successfully",
        description: "Your file is now available at the provided URL.",
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
      setFile(null)
      router.refresh()
    }
  }

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary' : 'border-muted-foreground'
          }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center justify-center space-x-4">
            <File className="h-8 w-8 text-muted-foreground" />
            <span className="text-lg font-medium">{file.name}</span>
          </div>
        ) : (
          <div>
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg mb-2">Drag & drop a file here, or click to select a file</p>
            <p className="text-sm text-muted-foreground">
              Max 100MB per upload
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-center">
        <Button onClick={handleUpload} disabled={!file || uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </div>
      {uploadedFileUrl && <FileUrlDisplay url={uploadedFileUrl} />}
    </Card>
  )
}
