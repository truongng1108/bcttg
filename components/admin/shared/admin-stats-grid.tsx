"use client"

import type { LucideIcon } from "lucide-react"
import { SimpleStatsCard } from "@/components/admin/shared/simple-stats-card"

export type AdminStatsVariant = "primary" | "accent" | "default" | "success" | "warning" | "error"

export interface AdminStatsItem {
  readonly id: string
  readonly value: string | number
  readonly label: string
  readonly icon: LucideIcon
  readonly variant?: AdminStatsVariant
}

export interface AdminStatsGridProps {
  readonly items: readonly AdminStatsItem[]
  readonly columns?: 2 | 3 | 4
}

export function AdminStatsGrid({ items, columns = 4 }: AdminStatsGridProps) {
  const gridColsMap = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-4",
  } as const
  const gridCols = gridColsMap[columns]

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {items.map((item) => (
        <SimpleStatsCard
          key={item.id}
          value={item.value}
          label={item.label}
          icon={item.icon}
          variant={item.variant}
        />
      ))}
    </div>
  )
}
