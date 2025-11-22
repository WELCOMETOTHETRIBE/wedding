import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { GalleryLightbox } from "@/components/gallery-lightbox"

async function getGalleries() {
  try {
    return await prisma.gallery.findMany({
      where: { isPublic: true },
      include: {
        photos: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (error) {
    console.error("Error fetching galleries:", error)
    return []
  }
}

export default async function GalleryPage() {
  const galleries = await getGalleries()

  return (
    <main className="min-h-screen bg-gradient-to-b from-champagne to-background py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-forest mb-4">
            Gallery
          </h1>
          <p className="text-lg text-muted-foreground">
            Our favorite moments together
          </p>
        </div>

        {galleries.length === 0 ? (
          <Card>
            <div className="py-12 text-center text-muted-foreground">
              No galleries available yet. Check back soon!
            </div>
          </Card>
        ) : (
          <div className="space-y-12">
            {galleries.map((gallery) => (
              <div key={gallery.id}>
                <h2 className="font-display text-3xl font-bold text-forest mb-6">
                  {gallery.title}
                </h2>
                {gallery.description && (
                  <p className="text-muted-foreground mb-6">{gallery.description}</p>
                )}
                {gallery.photos.length > 0 ? (
                  <GalleryLightbox photos={gallery.photos} />
                ) : (
                  <p className="text-muted-foreground">No photos in this gallery yet.</p>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Have photos to share?</p>
          <a
            href="/gallery/submit"
            className="text-forest hover:underline font-semibold"
          >
            Submit Your Photos →
          </a>
        </div>
      </div>
    </main>
  )
}

