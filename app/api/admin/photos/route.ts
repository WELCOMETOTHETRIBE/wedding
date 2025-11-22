import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { PhotoStatus } from "@prisma/client"

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  const where: { status?: PhotoStatus } = {}
  if (status && status !== "ALL" && ["PENDING", "APPROVED", "REJECTED"].includes(status)) {
    where.status = status as PhotoStatus
  }

  const photos = await prisma.photo.findMany({
    where,
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(photos)
}

