import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rsvps = await prisma.rSVP.findMany({
    orderBy: { createdAt: "desc" },
  })

  const csv = [
    ["Name", "Email", "Attending", "Party Size", "Meal Preference", "Allergies", "Song Request", "Notes", "Date"],
    ...rsvps.map((rsvp) => [
      rsvp.name,
      rsvp.email,
      rsvp.attending ? "Yes" : "No",
      rsvp.partySize.toString(),
      rsvp.mealPreference || "",
      rsvp.allergies || "",
      rsvp.songRequest || "",
      rsvp.notes || "",
      rsvp.createdAt.toISOString(),
    ]),
  ]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="rsvps-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}

