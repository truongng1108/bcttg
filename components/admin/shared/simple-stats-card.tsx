"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface SimpleStatsCardProps {
  value: string | number
  label: string
  icon: LucideIcon
  variant?: "primary" | "accent" | "default" | "success" | "warning" | "error"
  className?: string
}

const variantStyles = {
  primary: "border-primary/20",
  accent: "border-accent/20",
  default: "border-border",
  success: "border-[#2E7D32]/20",
  warning: "border-[#F57C00]/20",
  error: "border-destructive/20",
}

const iconVariantStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  default: "bg-muted text-muted-foreground",
  success: "bg-[#2E7D32]/10 text-[#2E7D32]",
  warning: "bg-[#F57C00]/10 text-[#F57C00]",
  error: "bg-destructive/10 text-destructive",
}

const valueVariantStyles = {
  primary: "text-primary",
  accent: "text-accent",
  default: "text-foreground",
  success: "text-[#2E7D32]",
  warning: "text-[#F57C00]",
  error: "text-destructive",
}

export function SimpleStatsCard({
  value,
  label,
  icon: Icon,
  variant = "default",
  className,
}: SimpleStatsCardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", iconVariantStyles[variant])}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className={cn("text-2xl font-bold", valueVariantStyles[variant])}>{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}
