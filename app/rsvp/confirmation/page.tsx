import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { prisma } from "@/lib/prisma"

async function getRSVP(confirmationCode: string) {
  return await prisma.rSVP.findUnique({
    where: { confirmationCode },
  })
}

export default async function RSVPConfirmationPage({
  searchParams,
}: {
  searchParams: { code?: string }
}) {
  const rsvp = searchParams.code ? await getRSVP(searchParams.code) : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-champagne to-background py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="font-display text-4xl">Thank You!</CardTitle>
            <CardDescription className="text-lg">
              Your RSVP has been received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {rsvp && (
              <div className="bg-champagne p-6 rounded-lg space-y-2">
                <p>
                  <strong>Name:</strong> {rsvp.name}
                </p>
                <p>
                  <strong>Status:</strong> {rsvp.attending ? "Attending" : "Not Attending"}
                </p>
                {rsvp.attending && (
                  <>
                    <p>
                      <strong>Party Size:</strong> {rsvp.partySize}
                    </p>
                    {rsvp.mealPreference && (
                      <p>
                        <strong>Meal Preference:</strong> {rsvp.mealPreference}
                      </p>
                    )}
                  </>
                )}
                <p className="text-sm text-muted-foreground mt-4">
                  Confirmation Code: <code className="bg-background px-2 py-1 rounded">{rsvp.confirmationCode}</code>
                </p>
              </div>
            )}
            <p className="text-center text-muted-foreground">
              A confirmation email has been sent to {rsvp?.email || "your email address"} with your RSVP details and
              calendar file.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link href="/">Back to Home</Link>
              </Button>
              {rsvp && (
                <Button asChild variant="outline" className="flex-1">
                  <Link href={`/rsvp?code=${rsvp.confirmationCode}`}>Update RSVP</Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

