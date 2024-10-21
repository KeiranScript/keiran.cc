'use client'

import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, Loader2, File, CheckCircle, Download, Link } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import confetti from 'canvas-confetti'
import FileUrlDisplay from '@/components/file-url-display'

const MAX_FILE_SIZE = 1024 * 1024 * 1024 // 1GB in bytes
const CHUNK_SIZE = 1024 * 1024 * 10 // 10MB in bytes

export default function FileUpload({
  setToast,
  setUploadedFileUrl,
}: {
  setToast: (message: string, description: string) => void;
  setUploadedFileUrl: (url: string | null) => void;
}) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [localUploadedFileUrl, setLocalUploadedFileUrl] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [buttonLabel, setButtonLabel] = useState('Upload')
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleSparkle = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 }
    });
  };

  useEffect(() => {
    if (uploadSuccess) {
      handleSparkle()
    }
  }, [uploadSuccess])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile.size > MAX_FILE_SIZE) {
      setToast('File too large', 'Maximum file size is 1GB.')
    } else {
      setFile(selectedFile)
    }
  }, [setToast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return
  
    setUploading(true)
    setUploadProgress(0)
  
    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE)
      let uploadedChunks = 0
  
      for (let start = 0; start < file.size; start += CHUNK_SIZE) {
        const chunk = file.slice(start, start + CHUNK_SIZE)
        const formData = new FormData()
        formData.append('file', chunk)
        formData.append('chunkIndex', String(uploadedChunks))
        formData.append('totalChunks', String(totalChunks))
        formData.append('filename', file.name)
  
        const response = await fetch('/api/upload-chunk', {
          method: 'POST',
          body: formData,
        })
  
        if (!response.ok) {
          throw new Error('Chunk upload failed')
        }
  
        uploadedChunks++
        setUploadProgress((uploadedChunks / totalChunks) * 100)
      }
  
      const finalizeResponse = await fetch('/api/upload-finalize', {
        method: 'POST',
        body: JSON.stringify({ filename: file.name }),
        headers: { 'Content-Type': 'application/json' },
      })
  
      if (!finalizeResponse.ok) {
        throw new Error('Upload finalization failed')
      }
  
      const data = await finalizeResponse.json()
      setLocalUploadedFileUrl(data.url)
      setUploadSuccess(true)
      setButtonLabel('Uploaded')
  
      setTimeout(() => {
        setButtonLabel('Upload')
        setUploadSuccess(false)
      }, 1000)
  
    } catch (error) {
      setToast('Upload failed', 'There was an error uploading your file. Please try again.')
    } finally {
      setUploading(false)
      setFile(null)
    }
  }

  const generateShareXConfig = () => {
    const config = {
      Name: "AnonHost",
      DestinationType: "ImageUploader, TextUploader, FileUploader",
      RequestMethod: "POST",
      RequestURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/upload`,
      Body: "MultipartFormData",
      FileFormName: "file",
      URL: "$json:rawUrl$",
      ThumbnailURL: "$json:imageUrl$"
    }
  
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'AnonHost.sxcu'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  
    setToast('ShareX Config Generated', 'The ShareX configuration file has been downloaded.')
  }
  

  const copyRawLink = () => {
    if (localUploadedFileUrl) {
      const rawUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api${localUploadedFileUrl}`
      navigator.clipboard.writeText(rawUrl)
      setToast('Raw Link Copied', 'The raw file link has been copied to your clipboard.')
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden shadow-lg transition-shadow duration-300 hover:shadow-xl">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}`}
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
              <p className="text-sm text-muted-foreground">Max file size: 1GB</p>
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <Button
            onClick={handleUpload}
            disabled={!file || uploading}
            variant='ghost'
            className="px-6 py-2 text-lg bg-primary text-primary-foreground"
          >
            {uploading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Uploading...
              </>
            ) : uploadSuccess ? (
              <div className='flex items-center justify-center space-x-4 text-green-500'>
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                {buttonLabel}
              </div>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                {buttonLabel}
              </>
            )}
          </Button>
          <Button
            onClick={generateShareXConfig}
            variant='outline'
            className="px-6 py-2 text-lg"
          >
            <Download className="mr-2 h-5 w-5" />
            ShareX Config
          </Button>
        </div>
        {uploading && (
          <div className="mt-4">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-center mt-2 text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
          </div>
        )}
        {localUploadedFileUrl && (
          <div className="mt-6">
            <FileUrlDisplay url={localUploadedFileUrl} />
            <div className="mt-2 flex justify-end">
              <Button
                onClick={copyRawLink}
                variant='outline'
                size='sm'
                className="text-sm"
              >
                <Link className="mr-2 h-4 w-4" />
                Copy Raw Link
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
