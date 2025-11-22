import { handlers } from "@/auth"

export const { GET, POST } = handlers

// Force Node.js runtime to avoid Edge Runtime warnings with nodemailer
export const runtime = "nodejs"

