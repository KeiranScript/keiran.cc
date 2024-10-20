'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from '@/components/ui/use-toast'
import { Loader2, Copy, ExternalLink } from 'lucide-react'

type FormData = {
  title: string
  description: string
  content: string
  language: string
}

const languageOptions = [
  { value: 'plaintext', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'markdown', label: 'Markdown' },
]

export default function PastePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [pasteUrl, setPasteUrl] = useState<string | null>(null)
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      language: 'plaintext'
    }
  })

  const content = watch('content')
  const language = watch('language')

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create paste')
      }

      const result = await response.json()
      setPasteUrl(result.url)
      toast.success('Paste created successfully!')
    } catch (error) {
      toast.error('Failed to create paste')
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
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Create a New Paste</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...register('title', { required: 'Title is required' })}
                  placeholder="Enter a title for your paste"
                />
                {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Enter an optional description"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select
                  onValueChange={(value) => setValue('language', value)}
                  defaultValue="plaintext"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Tabs defaultValue="editor">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="editor">
                  <Textarea
                    {...register('content', { required: 'Content is required' })}
                    placeholder="Enter your code or text here"
                    rows={15}
                    className="font-mono"
                  />
                  {errors.content && <p className="text-sm text-destructive mt-1">{errors.content.message}</p>}
                </TabsContent>
                <TabsContent value="preview">
                  <SyntaxHighlighter
                    language={language}
                    style={vscDarkPlus}
                    className="rounded-md"
                    showLineNumbers
                  >
                    {content || '// Your code will be previewed here'}
                  </SyntaxHighlighter>
                </TabsContent>
              </Tabs>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Paste...
                  </>
                ) : (
                  'Create Paste'
                )}
              </Button>
            </form>
            {pasteUrl && (
              <div className="mt-4">
                <Label htmlFor="pasteUrl">Paste URL</Label>
                <div className="flex mt-1">
                  <Input
                    id="pasteUrl"
                    value={pasteUrl}
                    readOnly
                    className="flex-grow"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => {
                      navigator.clipboard.writeText(pasteUrl)
                      toast.success('URL copied to clipboard!')
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="ml-2"
                    onClick={() => window.open(pasteUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
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