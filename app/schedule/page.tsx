import { prisma } from "@/lib/prisma"
import { formatDateTime, formatTime } from "@/lib/utils"
import { generateGoogleCalendarUrl } from "@/lib/ics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"

async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: {
        start: "asc",
      },
    })
  } catch (error) {
    console.error("Error fetching events:", error)
    return []
  }
}

export default async function SchedulePage() {
  const events = await getEvents()

  return (
    <main className="min-h-screen bg-gradient-to-b from-champagne to-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-forest mb-4">
            Schedule
          </h1>
          <p className="text-lg text-muted-foreground">
            Join us for these special moments
          </p>
        </div>

        <div className="space-y-6">
          {events.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No events scheduled yet. Check back soon!
              </CardContent>
            </Card>
          ) : (
            events.map((event) => {
              const endTime = event.end ? formatTime(event.end) : null
              return (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle className="font-display text-3xl">{event.title}</CardTitle>
                    {event.description && (
                      <CardDescription className="text-base mt-2">
                        {event.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-forest flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">{formatDateTime(event.start)}</p>
                        {endTime && <p className="text-sm text-muted-foreground">Until {endTime}</p>}
                      </div>
                    </div>

                    {event.locationName && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-forest flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold">{event.locationName}</p>
                          {event.address && (
                            <p className="text-sm text-muted-foreground">{event.address}</p>
                          )}
                          {event.mapUrl && (
                            <Button asChild variant="link" size="sm" className="p-0 h-auto mt-1">
                              <a href={event.mapUrl} target="_blank" rel="noopener noreferrer">
                                Get Directions
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={generateGoogleCalendarUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Add to Google Calendar
                        </a>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/api/events/${event.id}/ics`}>Download ICS File</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}

