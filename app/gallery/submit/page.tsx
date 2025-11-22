import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhotoUploadForm } from "@/components/photo-upload-form"

export default function GallerySubmitPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-champagne to-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-4xl text-center">
              Share Your Photos
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Upload your favorite moments from our celebration. Photos will be reviewed before
              being added to the gallery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PhotoUploadForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

