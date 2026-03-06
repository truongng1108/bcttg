"use client"

import type { ReactNode } from "react"
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"

type SortableId = string | number

interface SortableListProps<TItem> {
  readonly items: readonly TItem[]
  readonly getId: (item: TItem) => SortableId
  readonly onReorder: (next: readonly TItem[]) => void
  readonly children: (item: TItem, index: number) => ReactNode
}

export function SortableList<TItem>({
  items,
  getId,
  onReorder,
  children,
}: SortableListProps<TItem>) {
  const ids = items.map(getId)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const oldIndex = ids.findIndex((id) => String(id) === String(active.id))
    const newIndex = ids.findIndex((id) => String(id) === String(over.id))
    if (oldIndex === -1 || newIndex === -1) return

    const next = arrayMove([...items], oldIndex, newIndex)
    onReorder(next)
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={String(getId(item))}>{children(item, index)}</div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}


