import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Bio() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-center">Bio</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>About FileUploader</CardTitle>
        </CardHeader>
        <CardContent>
          <p>AnonHost is a simple and efficient tool for uploading and sharing files.</p>
          <p className="mt-4">This page is currently under construction.</p>
        </CardContent>
      </Card>
    </>
  )
}
