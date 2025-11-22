import { createEvent, EventAttributes } from "ics"
import { Event } from "@prisma/client"

export function generateICS(event: Event): string {
  const start = new Date(event.start)
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const icsEvent: EventAttributes = {
    title: event.title,
    description: event.description || undefined,
    location: event.address || event.locationName,
    start: [
      start.getFullYear(),
      start.getMonth() + 1,
      start.getDate(),
      start.getHours(),
      start.getMinutes(),
    ],
    end: [
      end.getFullYear(),
      end.getMonth() + 1,
      end.getDate(),
      end.getHours(),
      end.getMinutes(),
    ],
    uid: event.icsUid,
    url: event.mapUrl || undefined,
  }

  const { error, value } = createEvent(icsEvent)

  if (error) {
    throw new Error(`Failed to generate ICS: ${error.message}`)
  }

  return value || ""
}

export function generateGoogleCalendarUrl(event: Event): string {
  const start = new Date(event.start)
  const end = event.end ? new Date(event.end) : new Date(start.getTime() + 2 * 60 * 60 * 1000)

  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  }

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${formatDate(start)}/${formatDate(end)}`,
    details: event.description || "",
    location: event.address || event.locationName || "",
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

