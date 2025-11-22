import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ExternalLink, Gift } from "lucide-react"
import { StripeCheckoutButton } from "@/components/stripe-checkout-button"

async function getRegistryItems() {
  try {
    return await prisma.registryItem.findMany({
      orderBy: { sort: "asc" },
    })
  } catch (error) {
    console.error("Error fetching registry items:", error)
    return []
  }
}

export default async function RegistryPage() {
  const items = await getRegistryItems()

  const externalItems = items.filter((item) => item.type === "EXTERNAL")
  const cashItem = items.find((item) => item.type === "CASH")

  return (
    <main className="min-h-screen bg-gradient-to-b from-champagne to-background py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Gift className="h-16 w-16 mx-auto mb-4 text-forest" />
          <h1 className="font-display text-5xl md:text-6xl font-bold text-forest mb-4">
            Registry
          </h1>
          <p className="text-lg text-muted-foreground">
            Your presence is the greatest gift, but if you&apos;d like to celebrate with us in another
            way, we&apos;ve listed a few ideas below.
          </p>
        </div>

        {externalItems.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-3xl font-bold text-forest mb-6">Gift Registries</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {externalItems.map((item) => (
                <Card key={item.id}>
                  {item.imageUrl && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    {item.description && <CardDescription>{item.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    {item.externalUrl && (
                      <Button asChild className="w-full">
                        <a href={item.externalUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Shop at {item.title}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {cashItem && (
          <Card className="bg-champagne">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Cash Gift</CardTitle>
              {cashItem.description && <CardDescription>{cashItem.description}</CardDescription>}
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">
                If you prefer to give a cash gift, you can contribute any amount below.
              </p>
              {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? (
                <StripeCheckoutButton item={cashItem} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Cash gifts are not currently enabled. Please contact us for details.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {items.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No registry items available yet. Check back soon!
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  )
}

