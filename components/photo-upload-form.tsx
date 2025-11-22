"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const uploadSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  consent: z.boolean().refine((val) => val === true, {
    message: "You must consent to share your photos",
  }),
  honeypot: z.string().max(0).optional(),
})

type UploadFormData = z.infer<typeof uploadSchema>

export function PhotoUploadForm() {
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      consent: false,
      honeypot: "",
    },
  })

  const consent = watch("consent")

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    setFiles((prev) => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: UploadFormData) => {
    if (files.length === 0) {
      toast.error("Please select at least one photo")
      return
    }

    setIsUploading(true)

    try {
      // Upload files (simplified - in production, use UploadThing or Supabase)
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      files.forEach((file) => {
        formData.append("photos", file)
      })

      const response = await fetch("/api/photos/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload photos")
      }

      toast.success("Photos uploaded successfully! They will be reviewed before being added to the gallery.")
      router.push("/gallery")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload photos")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="text" {...register("honeypot")} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="space-y-2">
        <Label htmlFor="name">Your Name *</Label>
        <Input id="name" {...register("name")} />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Your Email *</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-4">
        <Label htmlFor="photos">Select Photos *</Label>
        <div className="border-2 border-dashed border-input rounded-lg p-8 text-center">
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <Label htmlFor="file-input" className="cursor-pointer">
            <span className="text-forest font-semibold hover:underline">
              Click to upload
            </span>{" "}
            or drag and drop
          </Label>
          <Input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <p className="text-sm text-muted-foreground mt-2">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {files.map((file, index) => (
              <div key={index} className="relative aspect-square group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFile(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="consent"
            checked={consent}
            onCheckedChange={(checked) => setValue("consent", checked === true)}
          />
          <Label htmlFor="consent" className="font-normal cursor-pointer text-sm">
            I consent to share these photos and understand they will be reviewed before being added
            to the public gallery. *
          </Label>
        </div>
        {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isUploading || files.length === 0}>
        {isUploading ? "Uploading..." : `Upload ${files.length} Photo${files.length !== 1 ? "s" : ""}`}
      </Button>
    </form>
  )
}

