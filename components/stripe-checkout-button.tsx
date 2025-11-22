"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { RegistryItem } from "@prisma/client"
import { toast } from "sonner"

interface StripeCheckoutButtonProps {
  item: RegistryItem
}

export function StripeCheckoutButton({ item }: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          amount: 5000, // $50.00 in cents - you can make this configurable
        }),
      })

      const { url } = await response.json()

      if (!url) {
        throw new Error("Failed to create checkout session")
      }

      window.location.href = url
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading} size="lg" className="w-full">
      {isLoading ? "Processing..." : "Give Cash Gift"}
    </Button>
  )
}

