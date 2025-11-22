"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"
import { toast } from "sonner"

interface RSVP {
  id: string
  name: string
  email: string
  partySize: number
  attending: boolean
  mealPreference: string | null
  allergies: string | null
  createdAt: string
}

export function RSVPManagement() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    fetchRSVPs()
  }, [])

  const fetchRSVPs = async () => {
    try {
      const response = await fetch("/api/admin/rsvps")
      const data = await response.json()
      setRsvps(data)
    } catch (error) {
      toast.error("Failed to load RSVPs")
    } finally {
      setLoading(false)
    }
  }

  const exportCSV = async () => {
    try {
      const response = await fetch("/api/admin/rsvps/export")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `rsvps-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success("CSV exported successfully")
    } catch (error) {
      toast.error("Failed to export CSV")
    }
  }

  const filteredRSVPs = rsvps.filter(
    (rsvp) =>
      rsvp.name.toLowerCase().includes(search.toLowerCase()) ||
      rsvp.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>RSVP Management</CardTitle>
          <Button onClick={exportCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-4"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredRSVPs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No RSVPs found</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Name</th>
                    <th className="text-left p-2">Email</th>
                    <th className="text-left p-2">Attending</th>
                    <th className="text-left p-2">Party Size</th>
                    <th className="text-left p-2">Meal</th>
                    <th className="text-left p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRSVPs.map((rsvp) => (
                    <tr key={rsvp.id} className="border-b">
                      <td className="p-2">{rsvp.name}</td>
                      <td className="p-2">{rsvp.email}</td>
                      <td className="p-2">{rsvp.attending ? "Yes" : "No"}</td>
                      <td className="p-2">{rsvp.partySize}</td>
                      <td className="p-2">{rsvp.mealPreference || "-"}</td>
                      <td className="p-2 text-sm text-muted-foreground">
                        {new Date(rsvp.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

