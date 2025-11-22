import { Resend } from "resend"
import { RSVP } from "@prisma/client"
import { generateICS } from "./ics"
import { prisma } from "./prisma"
import { formatDateTime } from "./utils"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendRSVPConfirmation(rsvp: RSVP) {
  const events = await prisma.event.findMany({
    where: {
      start: {
        gte: new Date(),
      },
    },
    orderBy: {
      start: "asc",
    },
  })

  const ceremonyEvent = events.find((e) => e.title.toLowerCase().includes("ceremony")) || events[0]

  let icsAttachment: { filename: string; content: string } | undefined

  if (ceremonyEvent && rsvp.attending) {
    try {
      const icsContent = generateICS(ceremonyEvent)
      icsAttachment = {
        filename: "wedding-invite.ics",
        content: icsContent,
      }
    } catch (error) {
      console.error("Failed to generate ICS:", error)
    }
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RSVP Confirmation</title>
      </head>
      <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #121212; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: 'Playfair Display', serif; color: #1D3B2A; font-size: 32px; margin: 0;">
            ${process.env.COUPLE_NAME_1 || "Alex"} & ${process.env.COUPLE_NAME_2 || "Jordan"}
          </h1>
        </div>
        
        <div style="background: #F9F4EC; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #1D3B2A; margin-top: 0;">RSVP Confirmation</h2>
          <p>Dear ${rsvp.name},</p>
          <p>Thank you for your RSVP! We've received your response:</p>
          
          <div style="background: white; padding: 20px; border-radius: 4px; margin: 20px 0;">
            <p><strong>Status:</strong> ${rsvp.attending ? "Attending" : "Not Attending"}</p>
            ${rsvp.attending ? `<p><strong>Party Size:</strong> ${rsvp.partySize}</p>` : ""}
            ${rsvp.mealPreference ? `<p><strong>Meal Preference:</strong> ${rsvp.mealPreference}</p>` : ""}
            ${rsvp.allergies ? `<p><strong>Dietary Restrictions:</strong> ${rsvp.allergies}</p>` : ""}
            ${rsvp.songRequest ? `<p><strong>Song Request:</strong> ${rsvp.songRequest}</p>` : ""}
            ${rsvp.notes ? `<p><strong>Notes:</strong> ${rsvp.notes}</p>` : ""}
          </div>
          
          ${rsvp.attending && ceremonyEvent ? `
            <p>We've attached a calendar file for the ceremony. You can also add it to your calendar using the link below.</p>
          ` : ""}
          
          <p>If you need to update your RSVP, you can do so using this link:</p>
          <p style="margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/rsvp?code=${rsvp.confirmationCode}" 
               style="display: inline-block; background: #1D3B2A; color: #F9F4EC; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              Update RSVP
            </a>
          </p>
          
          <p style="margin-top: 30px; color: #666; font-size: 14px;">
            Confirmation Code: <code>${rsvp.confirmationCode}</code>
          </p>
        </div>
        
        <p style="text-align: center; color: #666; font-size: 14px; margin-top: 40px;">
          We can't wait to celebrate with you!
        </p>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
      to: rsvp.email,
      subject: "RSVP Confirmation - Wedding Celebration",
      html: emailHtml,
      attachments: icsAttachment ? [icsAttachment] : undefined,
    })
  } catch (error) {
    console.error("Failed to send RSVP confirmation email:", error)
    throw error
  }
}

export async function sendPhotoApprovalNotification(email: string, photoUrl: string) {
  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Photo Approved</title>
      </head>
      <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #121212; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-family: 'Playfair Display', serif; color: #1D3B2A; font-size: 32px; margin: 0;">
            ${process.env.COUPLE_NAME_1 || "Alex"} & ${process.env.COUPLE_NAME_2 || "Jordan"}
          </h1>
        </div>
        
        <div style="background: #F9F4EC; padding: 30px; border-radius: 8px;">
          <h2 style="color: #1D3B2A; margin-top: 0;">Photo Approved!</h2>
          <p>Thank you for sharing your photos with us!</p>
          <p>Your photo has been approved and is now visible in our gallery.</p>
          <p style="margin: 20px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/gallery" 
               style="display: inline-block; background: #1D3B2A; color: #F9F4EC; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
              View Gallery
            </a>
          </p>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "noreply@example.com",
      to: email,
      subject: "Your Photo Has Been Approved",
      html: emailHtml,
    })
  } catch (error) {
    console.error("Failed to send photo approval email:", error)
  }
}

