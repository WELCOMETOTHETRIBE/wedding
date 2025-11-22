import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminTabs } from "@/components/admin-tabs"
import { Users, Calendar, Image, Gift, Mail } from "lucide-react"

async function getStats() {
  try {
    const [rsvpCount, attendingCount, eventCount, photoCount, registryCount] = await Promise.all([
      prisma.rSVP.count(),
      prisma.rSVP.count({ where: { attending: true } }),
      prisma.event.count(),
      prisma.photo.count({ where: { status: "APPROVED" } }),
      prisma.registryItem.count(),
    ])

    return {
      rsvpCount,
      attendingCount,
      eventCount,
      photoCount,
      registryCount,
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      rsvpCount: 0,
      attendingCount: 0,
      eventCount: 0,
      photoCount: 0,
      registryCount: 0,
    }
  }
}

export default async function AdminPage() {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/auth/signin")
  }

  const stats = await getStats()

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-forest mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your wedding website</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total RSVPs</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rsvpCount}</div>
              <p className="text-xs text-muted-foreground">{stats.attendingCount} attending</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.eventCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Photos</CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.photoCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registry Items</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.registryCount}</div>
            </CardContent>
          </Card>
        </div>

        <AdminTabs />
      </div>
    </main>
  )
}

