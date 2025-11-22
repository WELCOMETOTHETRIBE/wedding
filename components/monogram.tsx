import { cn } from "@/lib/utils"

interface MonogramProps {
  className?: string
}

export function Monogram({ className }: MonogramProps) {
  const name1 = process.env.COUPLE_NAME_1 || "A"
  const name2 = process.env.COUPLE_NAME_2 || "J"
  const initial1 = name1.charAt(0).toUpperCase()
  const initial2 = name2.charAt(0).toUpperCase()

  return (
    <div
      className={cn(
        "flex items-center justify-center w-24 h-24 rounded-full bg-forest text-champagne font-display text-4xl font-bold",
        className
      )}
    >
      {initial1}&{initial2}
    </div>
  )
}

