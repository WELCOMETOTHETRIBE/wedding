import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateICS } from "@/lib/ics"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: params.id },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    const icsContent = generateICS(event)

    return new NextResponse(icsContent, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="${event.title.replace(/[^a-z0-9]/gi, "_")}.ics"`,
      },
    })
  } catch (error) {
    console.error("ICS generation error:", error)
    return NextResponse.json({ error: "Failed to generate ICS file" }, { status: 500 })
  }
}

