"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RSVP } from "@prisma/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const rsvpSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    attending: z.boolean(),
    partySize: z.number().min(1).max(6).optional(),
    mealPreference: z.enum(["Beef", "Fish", "Veg", "Kids"]).optional(),
    allergies: z.string().optional(),
    songRequest: z.string().optional(),
    notes: z.string().optional(),
    honeypot: z.string().max(0, "Invalid submission"),
  })
  .refine((data) => !data.attending || (data.attending && data.partySize), {
    message: "Party size is required when attending",
    path: ["partySize"],
  })

type RSVPFormData = z.infer<typeof rsvpSchema>

interface RSVPFormProps {
  existingRSVP?: RSVP | null
}

export function RSVPForm({ existingRSVP }: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: existingRSVP?.name || "",
      email: existingRSVP?.email || "",
      attending: existingRSVP?.attending ?? true,
      partySize: existingRSVP?.partySize || 1,
      mealPreference: existingRSVP?.mealPreference || undefined,
      allergies: existingRSVP?.allergies || "",
      songRequest: existingRSVP?.songRequest || "",
      notes: existingRSVP?.notes || "",
      honeypot: "",
    },
  })

  const attending = watch("attending")

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/rsvp", {
        method: existingRSVP ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          id: existingRSVP?.id,
          confirmationCode: existingRSVP?.confirmationCode,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit RSVP")
      }

      toast.success("RSVP submitted successfully! Check your email for confirmation.")
      router.push(`/rsvp/confirmation?code=${result.confirmationCode}`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit RSVP")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot */}
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="attending"
            checked={attending}
            onCheckedChange={(checked) => setValue("attending", checked === true)}
          />
          <Label htmlFor="attending" className="font-normal cursor-pointer">
            I will be attending
          </Label>
        </div>
        {errors.attending && <p className="text-sm text-destructive">{errors.attending.message}</p>}
      </div>

      {attending && (
        <>
          <div className="space-y-2">
            <Label htmlFor="partySize">Party Size *</Label>
            <Input
              id="partySize"
              type="number"
              min="1"
              max="6"
              {...register("partySize", { valueAsNumber: true })}
            />
            {errors.partySize && <p className="text-sm text-destructive">{errors.partySize.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="mealPreference">Meal Preference</Label>
            <Select
              onValueChange={(value) => setValue("mealPreference", value as any)}
              defaultValue={existingRSVP?.mealPreference || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select meal preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Beef">Beef</SelectItem>
                <SelectItem value="Fish">Fish</SelectItem>
                <SelectItem value="Veg">Vegetarian</SelectItem>
                <SelectItem value="Kids">Kids Meal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Dietary Restrictions or Allergies</Label>
            <Textarea id="allergies" {...register("allergies")} rows={3} />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="songRequest">Song Request (Optional)</Label>
        <Input id="songRequest" {...register("songRequest")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes (Optional)</Label>
        <Textarea id="notes" {...register("notes")} rows={4} />
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : existingRSVP ? "Update RSVP" : "Submit RSVP"}
      </Button>
    </form>
  )
}

