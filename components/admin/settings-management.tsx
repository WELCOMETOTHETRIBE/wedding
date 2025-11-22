"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function SettingsManagement() {
  const handleSave = async () => {
    toast.success("Settings saved")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Site Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Couple Name 1</Label>
          <Input defaultValue={process.env.COUPLE_NAME_1 || ""} />
        </div>
        <div>
          <Label>Couple Name 2</Label>
          <Input defaultValue={process.env.COUPLE_NAME_2 || ""} />
        </div>
        <div>
          <Label>Wedding Date</Label>
          <Input type="datetime-local" defaultValue={process.env.WEDDING_DATE || ""} />
        </div>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  )
}

