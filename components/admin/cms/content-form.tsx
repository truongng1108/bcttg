"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContentItemEditor } from "@/components/admin/cms/content-item-editor"
import type { ContentItem } from "@/lib/types/api"
import type { SelectOption } from "@/lib/data/types"
import type { ContentItemFormData } from "@/lib/schemas/content-item.schema"

interface ContentFormProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly mode: "create" | "edit"
  readonly initialData?: ContentItem
  readonly categoryOptions: readonly SelectOption[]
  readonly onSubmit: (data: ContentItemFormData) => Promise<void>
  readonly isMutating?: boolean
}

export function ContentForm({
  open,
  onOpenChange,
  mode,
  initialData,
  categoryOptions,
  onSubmit,
  isMutating = false,
}: ContentFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm bài viết" : "Sửa bài viết"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Thêm bài viết mới cho nội dung CMS"
              : "Cập nhật thông tin bài viết"}
          </DialogDescription>
        </DialogHeader>
        <ContentItemEditor
          active={open}
          mode={mode}
          initialData={initialData}
          categoryOptions={categoryOptions}
          onSubmit={onSubmit}
          isMutating={isMutating}
          onCancel={() => onOpenChange(false)}
          onAfterSuccess={() => onOpenChange(false)}
          variant="dialog"
        />
      </DialogContent>
    </Dialog>
  )
}
