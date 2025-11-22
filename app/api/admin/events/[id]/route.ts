import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const eventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional().nullable(),
  locationName: z.string().min(1).optional(),
  address: z.string().optional().nullable(),
  mapUrl: z.string().optional().nullable(),
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const data = eventSchema.parse(body)

    const updateData: any = {}
    if (data.title) updateData.title = data.title
    if (data.description !== undefined) updateData.description = data.description
    if (data.start) updateData.start = new Date(data.start)
    if (data.end !== undefined) updateData.end = data.end ? new Date(data.end) : null
    if (data.locationName) updateData.locationName = data.locationName
    if (data.address !== undefined) updateData.address = data.address
    if (data.mapUrl !== undefined) updateData.mapUrl = data.mapUrl

    const event = await prisma.event.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json(event)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    await prisma.event.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete event" }, { status: 500 })
  }
}

