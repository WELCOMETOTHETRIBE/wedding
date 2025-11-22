import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Simplified upload handler - in production, integrate with UploadThing or Supabase
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const photos = formData.getAll("photos") as File[]

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 })
    }

    if (photos.length === 0) {
      return NextResponse.json({ error: "At least one photo is required" }, { status: 400 })
    }

    // Find or create guestbook gallery
    let gallery = await prisma.gallery.findFirst({
      where: { title: "Guestbook" },
    })

    if (!gallery) {
      gallery = await prisma.gallery.create({
        data: {
          title: "Guestbook",
          description: "Photos shared by our guests",
          isPublic: false, // Will be made public when photos are approved
        },
      })
    }

    // For now, we'll store placeholder URLs
    // In production, upload to UploadThing/Supabase and get real URLs
    const uploadedPhotos = []

    for (const photo of photos) {
      // Validate file
      if (!photo.type.startsWith("image/")) {
        continue
      }

      // In production: upload to storage service
      // For now, we'll create a placeholder record
      // You'll need to implement actual file upload to UploadThing or Supabase

      const photoRecord = await prisma.photo.create({
        data: {
          galleryId: gallery.id,
          uploaderName: name,
          uploaderEmail: email,
          imageUrl: `/placeholder-${Date.now()}.jpg`, // Replace with actual URL
          width: 1920, // Extract from image
          height: 1080, // Extract from image
          status: "PENDING",
        },
      })

      uploadedPhotos.push(photoRecord)
    }

    return NextResponse.json({
      success: true,
      message: `${uploadedPhotos.length} photo(s) uploaded successfully`,
      photos: uploadedPhotos,
    })
  } catch (error) {
    console.error("Photo upload error:", error)
    return NextResponse.json({ error: "Failed to upload photos" }, { status: 500 })
  }
}

