"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Check, X } from "lucide-react"
import { toast } from "sonner"

interface Photo {
  id: string
  imageUrl: string
  uploaderName: string | null
  uploaderEmail: string | null
  status: string
  createdAt: string
}

export function PhotoManagement() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING")

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`/api/admin/photos?status=${filter}`)
      const data = await response.json()
      setPhotos(data)
    } catch (error) {
      toast.error("Failed to load photos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPhotos()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const updatePhotoStatus = async (photoId: string, status: "APPROVED" | "REJECTED") => {
    try {
      await fetch(`/api/admin/photos/${photoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      toast.success(`Photo ${status.toLowerCase()}`)
      fetchPhotos()
    } catch (error) {
      toast.error("Failed to update photo")
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  const pendingPhotos = photos.filter((p) => p.status === "PENDING")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Moderation</CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("ALL")}
          >
            All
          </Button>
          <Button
            variant={filter === "PENDING" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("PENDING")}
          >
            Pending ({pendingPhotos.length})
          </Button>
          <Button
            variant={filter === "APPROVED" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("APPROVED")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "REJECTED" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("REJECTED")}
          >
            Rejected
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {photos.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No photos found</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={photo.imageUrl}
                    alt="Photo"
                    fill
                    className="object-cover"
                  />
                </div>
                {photo.status === "PENDING" && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="default"
                      onClick={() => updatePhotoStatus(photo.id, "APPROVED")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => updatePhotoStatus(photo.id, "REJECTED")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <div className="mt-2 text-sm">
                  <p className="font-semibold">{photo.uploaderName || "Anonymous"}</p>
                  <p className="text-muted-foreground text-xs">{photo.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

