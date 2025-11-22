import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")

  if (isAdminRoute) {
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

