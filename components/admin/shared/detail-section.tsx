"use client"

import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface DetailSectionProps {
  title: string
  children: ReactNode
  className?: string
}

export function DetailSection({ title, children, className }: DetailSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <div className="bg-muted/30 rounded-lg p-4 space-y-0">{children}</div>
    </div>
  )
}

