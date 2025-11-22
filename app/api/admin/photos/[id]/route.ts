import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { sendPhotoApprovalNotification } from "@/lib/email"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { status } = body

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const photo = await prisma.photo.update({
      where: { id: params.id },
      data: { status },
    })

    // If approved and has email, send notification
    if (status === "APPROVED" && photo.uploaderEmail) {
      try {
        await sendPhotoApprovalNotification(photo.uploaderEmail, photo.imageUrl)
      } catch (emailError) {
        console.error("Failed to send approval email:", emailError)
      }
    }

    return NextResponse.json(photo)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update photo" }, { status: 500 })
  }
}

