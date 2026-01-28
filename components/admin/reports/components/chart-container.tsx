"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChartContainerProps } from "@/lib/types/components"

export function ChartContainer({ title, children, onExport }: ChartContainerProps) {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {onExport && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 text-xs"
            onClick={onExport}
          >
            <Download className="h-3 w-3" />
            Xuất Excel
          </Button>
        )}
      </div>
      <div className="p-4">
        <div className="h-72">{children}</div>
      </div>
    </div>
  )
}
