"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface RegistryItem {
  id: string
  title: string
  description: string | null
  externalUrl: string | null
  type: string
}

export function RegistryManagement() {
  const [items, setItems] = useState<RegistryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch("/api/admin/registry")
      const data = await response.json()
      setItems(data)
    } catch (error) {
      toast.error("Failed to load registry items")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Registry Management</CardTitle>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{item.title}</h3>
              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
              {item.externalUrl && (
                <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-forest hover:underline">
                  View →
                </a>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

