import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 500 })
  }

  try {
    const { itemId, amount } = await request.json()

    const item = await prisma.registryItem.findUnique({
      where: { id: itemId },
    })

    if (!item || item.type !== "CASH") {
      return NextResponse.json({ error: "Invalid registry item" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
              description: item.description || undefined,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/registry?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/registry?canceled=true`,
      metadata: {
        registryItemId: item.id,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Stripe checkout error:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

