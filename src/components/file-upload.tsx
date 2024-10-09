'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Loader2, File, CheckCircle } from 'lucide-react'
import { ToastProvider, Toast, ToastTitle, ToastDescription, ToastViewport } from '@/components/ui/toast'
import { Progress } from '@/components/ui/progress'
import FileUrlDisplay from '@/components/file-url-display'

const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB in bytes

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastDescription, setToastDescription] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('Upload')
  const [uploadProgress, setUploadProgress] = useState(0)
  const router = useRouter()

  const [animateClass, setAnimateClass] = useState('opacity-0 translate-y-10')

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile.size > MAX_FILE_SIZE) {
      setToastMessage('File too large')
      setToastDescription('Maximum file size is 1GB.')
      setShowToast(true)
    } else {
      setFile(selectedFile)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

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

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateClass('opacity-100 translate-y-0 transition-transform duration-500')
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <ToastProvider>
      <Card className={`w-full max-w-2xl mx-auto overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl ${animateClass}`}>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="flex items-center justify-center space-x-4 transition-all duration-300 ease-in-out transform hover:scale-105">
                <File className="h-8 w-8 text-primary" />
                <span className="text-lg font-medium text-foreground">{file.name}</span>
              </div>
            ) : (
              <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
                <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-lg mb-2 font-semibold text-foreground">Drag & drop a file here, or click to select a file</p>
                <p className="text-sm text-muted-foreground">
                  Max file size: 1GB
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
          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center mt-2 text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}
          {uploadedFileUrl && (
            <div className="mt-6 transition-all duration-300 ease-in-out">
              <FileUrlDisplay url={uploadedFileUrl} />
            </div>
          )}
        </CardContent>
      </Card>

      {showToast && (
        <div className="fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
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
