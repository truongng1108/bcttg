"use client"

import { useMemo, useState, useEffect } from "react"
import {
  Edit,
  Eye,
  EyeOff,
  FileText,
  Folder,
  FolderOpen,
  MoreVertical,
  Plus,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ContentCategory } from "@/lib/types/api"
import { cn } from "@/lib/utils"

interface CMSCategoryTreeProps {
  readonly categories: readonly ContentCategory[]
  readonly selectedCategoryId: number | null
  readonly onSelectCategory: (categoryId: number | null) => void
  readonly onAddChild: (parentId: number) => void
  readonly onEditCategory: (category: ContentCategory) => void
  readonly onViewCategoryDetail: (categoryId: number) => void
  readonly onToggleCategoryVisibility: (category: ContentCategory) => void
  readonly onDeleteCategory: (category: ContentCategory) => void
}

export function CMSCategoryTree({
  categories,
  selectedCategoryId,
  onSelectCategory,
  onAddChild,
  onEditCategory,
  onViewCategoryDetail,
  onToggleCategoryVisibility,
  onDeleteCategory,
}: CMSCategoryTreeProps) {
  const [expandedLevel1Ids, setExpandedLevel1Ids] = useState<Set<number>>(() => new Set())

  const byParentId = useMemo(() => {
    const map = new Map<number | null, ContentCategory[]>()
    for (const category of categories) {
      const key = category.parentId ?? null
      const current = map.get(key) ?? []
      current.push(category)
      map.set(key, current)
    }
    for (const [, list] of map) {
      list.sort((a, b) => a.sortOrder - b.sortOrder)
    }
    return map
  }, [categories])

  const rootCategories = byParentId.get(null) ?? []

  useEffect(() => {
    if (selectedCategoryId === null) return
    const selected = categories.find((c) => c.id === selectedCategoryId) ?? null
    if (selected === null) return
    if (selected.parentId === null) {
      const selectedId = selected.id
      setExpandedLevel1Ids((prev) => {
        const next = new Set(prev)
        next.add(selectedId)
        return next
      })
    } else {
      const parentId = selected.parentId
      setExpandedLevel1Ids((prev) => {
        const next = new Set(prev)
        next.add(parentId)
        return next
      })
    }
  }, [categories, selectedCategoryId])

  const renderCategoryRow = (category: ContentCategory, level: 1 | 2) => {
    const isSelected = selectedCategoryId === category.id
    const children = byParentId.get(category.id) ?? []
    const hasChildren = children.length > 0
    const canAddChild = category.parentId === null

    const Icon = isSelected ? FolderOpen : Folder

    return (
      <div
        key={category.id}
        className={cn(
          "group flex items-center justify-between rounded-md px-2 py-1",
          isSelected ? "bg-primary/10" : "hover:bg-muted/40"
        )}
        style={{ paddingLeft: level === 1 ? 0 : 16 }}
      >
        <button
          type="button"
          onClick={() => onSelectCategory(category.id)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          {level === 1 ? (
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="min-w-0 flex-1 truncate text-sm font-medium">
            {category.name}
          </span>
          <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
            {category.isVisible ? "Hiển thị" : "Đã ẩn"}
          </span>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn("h-8 w-8 opacity-0 group-hover:opacity-100", isSelected && "opacity-100")}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={!canAddChild}
              onClick={() => onAddChild(category.id)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm thư mục con
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEditCategory(category)}>
              <Edit className="mr-2 h-4 w-4" />
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleCategoryVisibility(category)}>
              {category.isVisible ? (
                <EyeOff className="mr-2 h-4 w-4" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {category.isVisible ? "Ẩn" : "Hiện"}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={hasChildren}
              className={cn(hasChildren && "pointer-events-none")}
              onClick={() => onDeleteCategory(category)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onViewCategoryDetail(category.id)}>
              <FileText className="mr-2 h-4 w-4" />
              Chi tiết
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="space-y-1">
        {rootCategories.length === 0 ? (
          <div className="px-2 py-3 text-center text-sm text-muted-foreground">Chưa có danh mục</div>
        ) : (
          rootCategories.map((root) => {
            const level1Children = byParentId.get(root.id) ?? []
            const isExpanded = expandedLevel1Ids.has(root.id)
            const isSelected = selectedCategoryId === root.id
            const hasChildren = level1Children.length > 0
            return (
              <div key={root.id} className="group space-y-1">
                <div
                  className={cn(
                    "flex items-center justify-between rounded-md px-2 py-1",
                    isSelected ? "bg-primary/10" : "hover:bg-muted/40"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCategory(root.id)
                      setExpandedLevel1Ids((prev) => {
                        const next = new Set(prev)
                        if (next.has(root.id)) next.delete(root.id)
                        else next.add(root.id)
                        return next
                      })
                    }}
                    className="flex flex-1 items-center gap-2 text-left"
                    style={{ paddingLeft: 0 }}
                  >
                    {isExpanded ? (
                      <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{root.name}</span>
                    <span className="text-xs text-muted-foreground">{level1Children.length}</span>
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn("h-8 w-8 opacity-0 group-hover:opacity-100", isSelected && "opacity-100")}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onAddChild(root.id)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Thêm thư mục con
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onEditCategory(root)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Sửa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onToggleCategoryVisibility(root)}>
                        {root.isVisible ? (
                          <EyeOff className="mr-2 h-4 w-4" />
                        ) : (
                          <Eye className="mr-2 h-4 w-4" />
                        )}
                        {root.isVisible ? "Ẩn" : "Hiện"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        disabled={hasChildren}
                        className={cn(hasChildren && "pointer-events-none")}
                        onClick={() => onDeleteCategory(root)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Xóa
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onViewCategoryDetail(root.id)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Chi tiết
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {isExpanded && level1Children.map((child) => renderCategoryRow(child, 2))}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

