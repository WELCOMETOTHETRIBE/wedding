import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  start: z.string(),
  end: z.string().optional().nullable(),
  locationName: z.string().min(1),
  address: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
})

export async function GET() {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const events = await prisma.event.findMany({
    orderBy: { start: "asc" },
  })

  return NextResponse.json(events)
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = eventSchema.parse(body)

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        start: new Date(data.start),
        end: data.end ? new Date(data.end) : null,
        locationName: data.locationName,
        address: data.address,
        mapUrl: data.mapUrl,
      },
    })

    return NextResponse.json(event)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 })
  }
}

