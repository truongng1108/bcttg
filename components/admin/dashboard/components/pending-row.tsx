"use client"

import { PENDING_STATUS_LABELS } from "../constants/status-config"
import type { PendingRowProps } from "@/lib/types/components"

export function PendingRow({ title, type, author, date, status }: Readonly<PendingRowProps>) {
  const statusConfig = PENDING_STATUS_LABELS[status] || PENDING_STATUS_LABELS.pending

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{title}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{type}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{author}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{date}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${statusConfig.className || "bg-muted text-muted-foreground"}`}
        >
          {statusConfig.label || status}
        </span>
      </td>
    </tr>
  )
}
