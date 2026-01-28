"use client"

import { GripVertical, Eye, EyeOff, Settings } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import type { HomeModule } from "@/lib/data/types"

export interface HomeModuleSortableCardProps {
  readonly module: HomeModule
  readonly index: number
  readonly onToggle: (id: string) => void
  readonly onOpenEdit: (module: HomeModule) => void
}

export function HomeModuleSortableCard({
  module,
  index,
  onToggle,
  onOpenEdit,
}: HomeModuleSortableCardProps) {
  const sortable = useSortable({ id: module.id })
  const style = {
    transform: sortable.transform ? CSS.Transform.toString(sortable.transform) : undefined,
    transition: sortable.transition,
  }
  const Icon = module.icon

  return (
    <Card
      ref={sortable.setNodeRef}
      style={style}
      className={
        module.enabled
          ? "border-primary/20 bg-card transition-all"
          : "border-border bg-muted/30 opacity-70 transition-all"
      }
    >
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="cursor-grab text-muted-foreground hover:text-foreground"
          {...sortable.attributes}
          {...sortable.listeners}
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-sm font-bold text-primary">
          {index + 1}
        </div>

        <div
          className={
            module.enabled
              ? "flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary"
              : "flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground"
          }
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className={
                module.enabled ? "font-semibold text-foreground" : "font-semibold text-muted-foreground"
              }
            >
              {module.name}
            </h3>
            <Badge variant={module.enabled ? "default" : "secondary"} className="text-xs">
              {module.itemCount} mục
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{module.description}</p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          {module.enabled ? (
            <span className="flex items-center gap-1 text-primary">
              <Eye className="h-4 w-4" />
              Hiển thị
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground">
              <EyeOff className="h-4 w-4" />
              Đang ẩn
            </span>
          )}
        </div>

        <Switch checked={module.enabled} onCheckedChange={() => onToggle(module.id)} />

        <Button
          variant="outline"
          size="icon"
          onClick={() => onOpenEdit(module)}
          className="border-border hover:border-primary/50 hover:bg-primary/10"
        >
          <Settings className="h-4 w-4" />
          <span className="sr-only">Cài đặt module</span>
        </Button>
      </CardContent>
    </Card>
  )
}

