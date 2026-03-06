"use client"

import type { ReactNode } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SortableCardProps {
  readonly id: string | number
  readonly index: number
  readonly title: string
  readonly subtitle?: string
  readonly right?: ReactNode
}

export function SortableCard({ id, index, title, subtitle, right }: SortableCardProps) {
  const sortable = useSortable({ id })
  const style = {
    transform: sortable.transform ? CSS.Transform.toString(sortable.transform) : undefined,
    transition: sortable.transition,
  }

  return (
    <Card ref={sortable.setNodeRef} style={style} className="border-border bg-card">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="cursor-grab text-muted-foreground hover:text-foreground"
          {...sortable.attributes}
          {...sortable.listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium text-foreground">{title}</div>
          {subtitle && <div className="truncate text-sm text-muted-foreground">{subtitle}</div>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </CardContent>
    </Card>
  )
}


