"use client"

import { useEffect, useState } from "react"

interface CountdownTimerProps {
  targetDate: Date | string
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const target = typeof targetDate === "string" ? new Date(targetDate) : targetDate

    const updateTimer = () => {
      const now = new Date().getTime()
      const distance = target.getTime() - now

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="flex gap-4 md:gap-8 justify-center mt-8">
      <div className="text-center">
        <div className="text-4xl md:text-6xl font-bold text-forest">{timeLeft.days}</div>
        <div className="text-sm md:text-base text-muted-foreground mt-2">Days</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-6xl font-bold text-forest">{timeLeft.hours}</div>
        <div className="text-sm md:text-base text-muted-foreground mt-2">Hours</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-6xl font-bold text-forest">{timeLeft.minutes}</div>
        <div className="text-sm md:text-base text-muted-foreground mt-2">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-4xl md:text-6xl font-bold text-forest">{timeLeft.seconds}</div>
        <div className="text-sm md:text-base text-muted-foreground mt-2">Seconds</div>
      </div>
    </div>
  )
}

