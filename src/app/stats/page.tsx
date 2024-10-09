import { promises as fs } from 'fs'
import path from 'path'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

async function getStats() {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

  try {
    const files = await fs.readdir(uploadsDir)
    let totalSize = 0

    for (const file of files) {
      const filePath = path.join(uploadsDir, file)
      const stats = await fs.stat(filePath)
      totalSize += stats.size
    }

    const totalFiles = files.length
    const usedStorage = totalSize
    const totalStorage = 3 * 1024 * 1024 * 1024 * 1024 // 3 TB in bytes
    const availableStorage = totalStorage - usedStorage

    return {
      totalFiles,
      usedStorage,
      availableStorage,
      totalStorage
    }
  } catch (error) {
    console.error('Error reading uploads directory:', error)
    return {
      totalFiles: 0,
      usedStorage: 0,
      availableStorage: 3 * 1024 * 1024 * 1024 * 1024,
      totalStorage: 3 * 1024 * 1024 * 1024 * 1024
    }
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default async function Stats() {
  const stats = await getStats()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Stats</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Files</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalFiles}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Used Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatBytes(stats.usedStorage)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Available Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatBytes(stats.availableStorage)}</p>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Storage Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={(stats.usedStorage / stats.totalStorage) * 100} className="w-full" />
          <p className="mt-2 text-sm text-muted-foreground">
            {formatBytes(stats.usedStorage)} of {formatBytes(stats.totalStorage)} used
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
