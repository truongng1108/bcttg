"use client"

import { FileSpreadsheet } from "lucide-react"
import type { ExportOptionProps } from "@/lib/types/components"

export function ExportOption({ title, description, onClick }: ExportOptionProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-md border border-border bg-background p-4 text-left transition-colors hover:bg-muted"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded bg-secondary/10">
        <FileSpreadsheet className="h-5 w-5 text-secondary" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}
