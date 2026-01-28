"use client"

import { STATUS_COLORS } from "../constants/status-config"
import type { StatusItemProps } from "@/lib/types/components"

export function StatusItem({ label, status, detail }: StatusItemProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${STATUS_COLORS[status]}`} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{detail}</span>
    </div>
  )
}
