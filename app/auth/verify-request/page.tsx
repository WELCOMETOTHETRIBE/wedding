import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail } from "lucide-react"

export default function VerifyRequestPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-champagne to-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Mail className="h-12 w-12 text-forest" />
          </div>
          <CardTitle className="font-display text-3xl text-center">Check Your Email</CardTitle>
          <CardDescription className="text-center">
            A sign in link has been sent to your email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Click the link in the email to sign in. The link will expire in 24 hours.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

