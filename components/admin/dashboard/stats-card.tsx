import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "primary" | "secondary" | "accent"
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  // Cảm giác "bảng báo cáo truyền thống" - đỏ, vàng, nâu
  const variantStyles = {
    default: "border-border bg-card",
    primary: "border-primary/30 bg-card",
    secondary: "border-accent/30 bg-card",
    accent: "border-accent/30 bg-card",
  }

  const iconStyles = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary border border-primary/20",
    secondary: "bg-accent/10 text-accent border border-accent/20",
    accent: "bg-accent/10 text-accent border border-accent/20",
  }

  const valueStyles = {
    default: "text-foreground",
    primary: "text-primary",
    secondary: "text-accent",
    accent: "text-accent",
  }

  return (
    <div
      className={cn(
        "flex flex-col rounded-md border p-4 shadow-sm transition-all hover:shadow-md",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
          <p className={cn("mt-1 text-2xl font-bold", valueStyles[variant])}>{value}</p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full",
            iconStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {(description || trend) && (
        <div className="mt-3 flex items-center gap-2 border-t border-border pt-3 text-sm">
          {trend && (
            <span
              className={cn(
                "font-semibold",
                trend.isPositive ? "text-[#2E7D32]" : "text-destructive"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}%
            </span>
          )}
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
        </div>
      )}
    </div>
  )
}
