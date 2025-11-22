import { RSVPForm } from "@/components/rsvp-form"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

async function getExistingRSVP(confirmationCode?: string) {
  if (!confirmationCode) return null

  try {
    return await prisma.rSVP.findUnique({
      where: { confirmationCode },
    })
  } catch (error) {
    console.error("Error fetching RSVP:", error)
    return null
  }
}

export default async function RSVPPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const existingRSVP = await getExistingRSVP(searchParams.code)

  return (
    <main className="min-h-screen bg-gradient-to-b from-champagne to-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-4xl text-center">
              RSVP
            </CardTitle>
            <CardDescription className="text-center text-lg">
              {existingRSVP
                ? "Update your RSVP below"
                : "Please let us know if you'll be joining us for our special day"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RSVPForm existingRSVP={existingRSVP} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

