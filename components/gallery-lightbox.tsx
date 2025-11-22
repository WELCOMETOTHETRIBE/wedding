"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Photo } from "@prisma/client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GalleryLightboxProps {
  photos: Photo[]
}

export function GalleryLightbox({ photos }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedIndex(null)
    document.body.style.overflow = ""
  }

  const navigate = (direction: "prev" | "next") => {
    if (selectedIndex === null) return

    if (direction === "prev") {
      setSelectedIndex(selectedIndex > 0 ? selectedIndex - 1 : photos.length - 1)
    } else {
      setSelectedIndex(selectedIndex < photos.length - 1 ? selectedIndex + 1 : 0)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null)
        document.body.style.overflow = ""
      }
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : photos.length - 1))
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null && prev < photos.length - 1 ? prev + 1 : 0))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, photos.length])

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square cursor-pointer group"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={photo.imageUrl}
              alt={`Photo ${index + 1}`}
              fill
              className="object-cover rounded-lg transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        ))}
      </div>

      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>
          <div
            className="relative max-w-7xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[selectedIndex].imageUrl}
              alt={`Photo ${selectedIndex + 1}`}
              width={photos[selectedIndex].width}
              height={photos[selectedIndex].height}
              className="max-w-full max-h-[90vh] object-contain"
            />
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigate("prev")}
                >
                  ←
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
                  onClick={() => navigate("next")}
                >
                  →
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                  {selectedIndex + 1} / {photos.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

