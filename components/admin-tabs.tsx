"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RSVPManagement } from "@/components/admin/rsvp-management"
import { EventManagement } from "@/components/admin/event-management"
import { PhotoManagement } from "@/components/admin/photo-management"
import { RegistryManagement } from "@/components/admin/registry-management"
import { SettingsManagement } from "@/components/admin/settings-management"

export function AdminTabs() {
  return (
    <Tabs defaultValue="rsvps" className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="rsvps">RSVPs</TabsTrigger>
        <TabsTrigger value="events">Events</TabsTrigger>
        <TabsTrigger value="photos">Photos</TabsTrigger>
        <TabsTrigger value="registry">Registry</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="rsvps">
        <RSVPManagement />
      </TabsContent>

      <TabsContent value="events">
        <EventManagement />
      </TabsContent>

      <TabsContent value="photos">
        <PhotoManagement />
      </TabsContent>

      <TabsContent value="registry">
        <RegistryManagement />
      </TabsContent>

      <TabsContent value="settings">
        <SettingsManagement />
      </TabsContent>
    </Tabs>
  )
}

