import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendRSVPConfirmation } from "@/lib/email"
import { z } from "zod"

const rsvpSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  attending: z.boolean(),
  partySize: z.number().min(1).max(6).optional(),
  mealPreference: z.enum(["Beef", "Fish", "Veg", "Kids"]).optional(),
  allergies: z.string().optional(),
  songRequest: z.string().optional(),
  notes: z.string().optional(),
  id: z.string().optional(),
  confirmationCode: z.string().optional(),
  honeypot: z.string().max(0).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check
    if (body.honeypot) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    const data = rsvpSchema.parse(body)

    // Check for existing RSVP by email
    const existing = await prisma.rSVP.findFirst({
      where: { email: data.email },
    })

    let rsvp

    if (existing) {
      rsvp = await prisma.rSVP.update({
        where: { id: existing.id },
        data: {
          name: data.name,
          attending: data.attending,
          partySize: data.attending ? data.partySize : 0,
          mealPreference: data.mealPreference,
          allergies: data.allergies,
          songRequest: data.songRequest,
          notes: data.notes,
        },
      })
    } else {
      rsvp = await prisma.rSVP.create({
        data: {
          name: data.name,
          email: data.email,
          attending: data.attending,
          partySize: data.attending ? data.partySize || 1 : 0,
          mealPreference: data.mealPreference,
          allergies: data.allergies,
          songRequest: data.songRequest,
          notes: data.notes,
        },
      })
    }

    // Send confirmation email
    try {
      await sendRSVPConfirmation(rsvp)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, confirmationCode: rsvp.confirmationCode })
  } catch (error) {
    console.error("RSVP error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to submit RSVP" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.honeypot) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    const data = rsvpSchema.parse(body)

    if (!data.id && !data.confirmationCode) {
      return NextResponse.json({ error: "RSVP ID or confirmation code required" }, { status: 400 })
    }

    const where = data.id ? { id: data.id } : { confirmationCode: data.confirmationCode! }

    const rsvp = await prisma.rSVP.update({
      where,
      data: {
        name: data.name,
        attending: data.attending,
        partySize: data.attending ? data.partySize : 0,
        mealPreference: data.mealPreference,
        allergies: data.allergies,
        songRequest: data.songRequest,
        notes: data.notes,
      },
    })

    try {
      await sendRSVPConfirmation(rsvp)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
    }

    return NextResponse.json({ success: true, confirmationCode: rsvp.confirmationCode })
  } catch (error) {
    console.error("RSVP update error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update RSVP" }, { status: 500 })
  }
}

