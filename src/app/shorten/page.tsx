'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Link, Loader2 } from 'lucide-react'

type FormData = {
  url: string
  customAlias?: string
  expirationTime?: string
}

export default function ShortenPage() {
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setShortenedUrl(result.shortUrl)
        toast.success('URL shortened successfully!')
      } else {
        toast.error('Failed to shorten URL')
      }
    } catch (error) {
        toast.error('Failed to shorten URL')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">URL Shortener</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="url">URL to Shorten</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  {...register('url', { required: 'URL is required' })}
                />
                {errors.url && <p className="text-sm text-destructive mt-1">{errors.url.message}</p>}
              </div>
              <div>
                <Label htmlFor="customAlias">Custom Alias (Optional)</Label>
                <Input
                  id="customAlias"
                  type="text"
                  placeholder="my-custom-url"
                  {...register('customAlias')}
                />
              </div>
              <div>
                <Label htmlFor="expirationTime">Expiration Time (Optional)</Label>
                <Input
                  id="expirationTime"
                  type="datetime-local"
                  {...register('expirationTime')}
                />
                <p className="text-sm text-muted-foreground mt-1">Default: 24 hours, Max: 30 days</p>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Shorten URL
                  </>
                )}
              </Button>
            </form>
            {shortenedUrl && (
              <div className="mt-4">
                <Label htmlFor="shortenedUrl">Shortened URL</Label>
                <div className="flex mt-1">
                  <Input
                    id="shortenedUrl"
                    type="text"
                    value={shortenedUrl}
                    readOnly
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(shortenedUrl)
                      toast.success('Shortened URL copied to clipboard')
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}