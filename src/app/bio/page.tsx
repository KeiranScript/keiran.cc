import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Bio() {
  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-center">Bio</h1>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mt-4">This page is currently under construction.</p>
        </CardContent>
      </Card>
    </>
  )
}
