"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Event {
  id: string
  title: string
  description: string | null
  start: string
  end: string | null
  locationName: string
  address: string | null
  mapUrl: string | null
}

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch("/api/admin/events")
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      toast.error("Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      await fetch(`/api/admin/events/${id}`, { method: "DELETE" })
      toast.success("Event deleted")
      fetchEvents()
    } catch (error) {
      toast.error("Failed to delete event")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Event Management</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showForm && (
          <EventForm
            event={editingEvent}
            onSuccess={() => {
              setShowForm(false)
              setEditingEvent(null)
              fetchEvents()
            }}
            onCancel={() => {
              setShowForm(false)
              setEditingEvent(null)
            }}
          />
        )}
        <div className="space-y-4 mt-6">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.start).toLocaleString()}
                  </p>
                  <p className="text-sm">{event.locationName}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingEvent(event)
                      setShowForm(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function EventForm({
  event,
  onSuccess,
  onCancel,
}: {
  event: Event | null
  onSuccess: () => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    start: event?.start ? new Date(event.start).toISOString().slice(0, 16) : "",
    end: event?.end ? new Date(event.end).toISOString().slice(0, 16) : "",
    locationName: event?.locationName || "",
    address: event?.address || "",
    mapUrl: event?.mapUrl || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = event ? `/api/admin/events/${event.id}` : "/api/admin/events"
      const method = event ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      toast.success(event ? "Event updated" : "Event created")
      onSuccess()
    } catch (error) {
      toast.error("Failed to save event")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div>
        <Label>Title *</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Start Date/Time *</Label>
          <Input
            type="datetime-local"
            value={formData.start}
            onChange={(e) => setFormData({ ...formData, start: e.target.value })}
            required
          />
        </div>
        <div>
          <Label>End Date/Time</Label>
          <Input
            type="datetime-local"
            value={formData.end}
            onChange={(e) => setFormData({ ...formData, end: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Location Name *</Label>
        <Input
          value={formData.locationName}
          onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
          required
        />
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div>
        <Label>Map URL</Label>
        <Input
          value={formData.mapUrl}
          onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit">{event ? "Update" : "Create"}</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

