"use client"

import type React from "react"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { SummaryCardProps } from "@/lib/types/components"

export function SummaryCard({
  title,
  value,
  change,
  icon: Icon,
  period,
}: SummaryCardProps) {
  const isPositive = change >= 0

  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? "text-[#2E7D32]" : "text-destructive"
          }`}
        >
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {isPositive ? "+" : ""}
          {change}%
        </span>
        <span className="text-xs text-muted-foreground">{period}</span>
      </div>
    </div>
  )
}
