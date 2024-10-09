'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, Loader2, File, CheckCircle } from 'lucide-react'
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from '@/components/ui/toast'
import FileUrlDisplay from '@/components/file-url-display'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastDescription, setToastDescription] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('Upload')
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
      setUploadSuccess(true)
      setButtonLabel('Uploaded')

      setToastMessage('File uploaded successfully')
      setToastDescription('Visit the link to access your file!')

      // Reset button label after 1 second
      setTimeout(() => {
        setButtonLabel('Upload')
        setUploadSuccess(false)
      }, 1000)
    } catch (error) {
      console.error('Upload error:', error)

      setToastMessage('Upload failed')
      setToastDescription('There was an error uploading your file. Please try again.')
    } finally {
      setUploading(false)
      setFile(null)
      router.refresh()
      setShowToast(true)
    }
  }

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [showToast])

  return (
    <ToastProvider>
      <Card className="p-6 max-w-2xl mx-auto bg-card shadow-lg">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary' : 'border-muted'
            }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center space-x-4">
              <File className="h-8 w-8 text-primary" />
              <span className="text-lg font-medium text-foreground">{file.name}</span>
            </div>
          ) : (
            <div>
              <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-lg mb-2 font-semibold text-foreground">Drag & drop a file here, or click to select a file</p>
              <p className="text-sm text-muted-foreground">
                Max 100mb per file
              </p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="px-6 py-2 text-lg transition-all duration-200 ease-in-out transform hover:scale-105 bg-primary text-primary-foreground"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <>
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                {buttonLabel}
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                {buttonLabel}
              </>
            )}
          </Button>
        </div>
        {uploadedFileUrl && (
          <div className="mt-6">
            <FileUrlDisplay url={uploadedFileUrl} />
          </div>
        )}
      </Card>

      {showToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <Toast onOpenChange={setShowToast}>
            <ToastTitle>{toastMessage}</ToastTitle>
            <ToastDescription>{toastDescription}</ToastDescription>
          </Toast>
        </div>
      )}

      <ToastViewport />
    </ToastProvider>
  )
}
