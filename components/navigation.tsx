import Link from "next/link"
import { Button } from "@/components/ui/button"
import { auth, signOut } from "@/auth"
import { Calendar, Image, Gift, LogIn } from "lucide-react"

export async function Navigation() {
  const session = await auth()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="font-display text-2xl font-bold text-forest">
          {process.env.COUPLE_NAME_1 || "Alex"} & {process.env.COUPLE_NAME_2 || "Jordan"}
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/schedule" className="text-sm font-medium hover:text-forest transition-colors">
            <Calendar className="h-4 w-4 inline mr-1" />
            Schedule
          </Link>
          <Link href="/gallery" className="text-sm font-medium hover:text-forest transition-colors">
            <Image className="h-4 w-4 inline mr-1" />
            Gallery
          </Link>
          <Link href="/registry" className="text-sm font-medium hover:text-forest transition-colors">
            <Gift className="h-4 w-4 inline mr-1" />
            Registry
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/rsvp">RSVP</Link>
          </Button>
          {session?.user?.role === "ADMIN" ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin">Admin</Link>
              </Button>
              <form
                action={async () => {
                  "use server"
                  await signOut()
                }}
              >
                <Button type="submit" variant="ghost" size="sm">
                  Sign Out
                </Button>
              </form>
            </>
          ) : session ? (
            <form
              action={async () => {
                "use server"
                await signOut()
              }}
            >
              <Button type="submit" variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link href="/auth/signin">
                <LogIn className="h-4 w-4 mr-1" />
                Sign In
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}

