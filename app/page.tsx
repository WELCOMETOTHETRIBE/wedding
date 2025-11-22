import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { prisma } from "@/lib/prisma"
import { formatDate, formatTime } from "@/lib/utils"
import { Calendar, MapPin, Heart } from "lucide-react"
import { generateGoogleCalendarUrl } from "@/lib/ics"
import { CountdownTimer } from "@/components/countdown-timer"
import { Monogram } from "@/components/monogram"

async function getHeroPhotos() {
  try {
    const gallery = await prisma.gallery.findFirst({
      where: { isPublic: true },
      include: {
        photos: {
          where: { status: "APPROVED" },
          take: 5,
          orderBy: { createdAt: "desc" },
        },
      },
    })
    return gallery?.photos || []
  } catch (error) {
    console.error("Error fetching hero photos:", error)
    return []
  }
}

async function getCeremonyEvent() {
  try {
    return await prisma.event.findFirst({
      where: {
        title: {
          contains: "Ceremony",
          mode: "insensitive",
        },
      },
    })
  } catch (error) {
    console.error("Error fetching ceremony event:", error)
    return null
  }
}

export default async function HomePage() {
  const heroPhotos = await getHeroPhotos()
  const ceremonyEvent = await getCeremonyEvent()
  const weddingDate = ceremonyEvent?.start || new Date(process.env.WEDDING_DATE || "2026-08-26T16:00:00Z")

  return (
    <main className="min-h-screen">
      {/* Hero Image Section - Full Screen */}
      <section className="relative w-full h-screen">
        <Image
          src="/images/hero-image.png"
          alt="Victoria & Maximillion"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </section>

      {/* Content Section - Below Image */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <Monogram className="mx-auto mb-8" />
          <h1 className="font-display text-5xl md:text-7xl font-bold text-forest mb-4">
            {process.env.COUPLE_NAME_1 || "Victoria"} & {process.env.COUPLE_NAME_2 || "Maximillion"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {formatDate(weddingDate)}
          </p>
          {ceremonyEvent && (
            <p className="text-lg text-muted-foreground mb-12">
              {formatTime(ceremonyEvent.start)}
              {ceremonyEvent.locationName && ` • ${ceremonyEvent.locationName}`}
            </p>
          )}
          <CountdownTimer targetDate={weddingDate} />
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/rsvp">RSVP</Link>
            </Button>
            {ceremonyEvent && (
              <>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <a
                    href={generateGoogleCalendarUrl(ceremonyEvent)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Add to Calendar
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link href={`/api/events/${ceremonyEvent.id}/ics`}>
                    Download ICS
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mb-8">
            Our Story
          </h2>
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p>
              We met in the most unexpected way and knew from the start that we were meant to be
              together. After years of adventures, laughter, and building our life together, we
              can&apos;t wait to celebrate this next chapter with all of you.
            </p>
            <p>
              Join us as we say &quot;I do&quot; and begin our journey as husband and wife. Your presence
              would make our day even more special.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Carousel */}
      {heroPhotos.length > 0 && (
        <section className="py-20 px-4 bg-champagne">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mb-12 text-center">
              Moments Together
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {heroPhotos.slice(0, 4).map((photo) => (
                <Card key={photo.id} className="overflow-hidden aspect-square">
                  <Image
                    src={photo.imageUrl}
                    alt="Photo"
                    width={photo.width}
                    height={photo.height}
                    className="w-full h-full object-cover"
                  />
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/gallery">View Full Gallery</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Location Section */}
      {ceremonyEvent && (
        <section className="py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mb-8 text-center">
              Location
            </h2>
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <MapPin className="h-6 w-6 text-forest flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-semibold mb-2">{ceremonyEvent.locationName}</h3>
                  {ceremonyEvent.address && (
                    <p className="text-muted-foreground mb-4">{ceremonyEvent.address}</p>
                  )}
                  {ceremonyEvent.mapUrl && (
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={ceremonyEvent.mapUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Get Directions
                      </a>
                    </Button>
                  )}
                </div>
              </div>
              {process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY && ceremonyEvent.address && (
                <div className="mt-6 aspect-video rounded-lg overflow-hidden">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_MAPS_EMBED_API_KEY}&q=${encodeURIComponent(ceremonyEvent.address)}`}
                  />
                </div>
              )}
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-background to-champagne">
        <div className="max-w-2xl mx-auto text-center">
          <Heart className="h-12 w-12 text-forest mx-auto mb-6" />
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest mb-6">
            We Can&apos;t Wait to Celebrate With You!
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Please let us know if you&apos;ll be joining us by responding to your invitation.
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/rsvp">RSVP Now</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}

