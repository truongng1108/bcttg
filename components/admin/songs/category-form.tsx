"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import { SongCategoryFormSchema, type SongCategoryFormData } from "@/lib/schemas/song-category.schema"
import type { SongCategory } from "@/lib/types/api"

interface SongCategoryFormProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly mode: "create" | "edit"
  readonly initialData?: SongCategory
  readonly onSubmit: (data: SongCategoryFormData) => Promise<void>
  readonly isMutating?: boolean
}

export function SongCategoryForm({
  open,
  onOpenChange,
  mode,
  initialData,
  onSubmit,
  isMutating = false,
}: SongCategoryFormProps) {
  const form = useForm<SongCategoryFormData>({
    resolver: zodResolver(SongCategoryFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      description: initialData?.description || "",
      isVisible: initialData?.isVisible ?? true,
      sortOrder: initialData?.sortOrder || 0,
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          isVisible: initialData.isVisible,
          sortOrder: initialData.sortOrder,
        })
      } else {
        form.reset({
          name: "",
          slug: "",
          description: "",
          isVisible: true,
          sortOrder: 0,
        })
      }
    }
  }, [open, initialData, form])

  const handleSubmit = async (data: SongCategoryFormData) => {
    try {
      await onSubmit(data)
      onOpenChange(false)
    } catch {
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm danh mục" : "Sửa danh mục"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Thêm danh mục mới cho ca khúc"
              : "Cập nhật thông tin danh mục"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormFieldRHF
            control={form.control}
            name="name"
            label="Tên danh mục"
            required
            placeholder="Nhập tên danh mục"
          />
          <FormFieldRHF
            control={form.control}
            name="slug"
            label="Slug"
            required
            placeholder="ca-khuc-truyen-thong"
            helpText="URL-friendly identifier (chỉ chữ thường, số và dấu gạch ngang)"
          />
          <FormFieldRHF
            control={form.control}
            name="description"
            label="Mô tả"
            type="textarea"
            rows={3}
            placeholder="Nhập mô tả danh mục"
          />
          <FormFieldRHF
            control={form.control}
            name="sortOrder"
            label="Thứ tự sắp xếp"
            type="number"
            placeholder="0"
            helpText="Số càng nhỏ, hiển thị càng trước"
          />
          <FormFieldRHF
            control={form.control}
            name="isVisible"
            label="Hiển thị"
            type="switch"
            helpText="Bật/tắt hiển thị danh mục trên ứng dụng"
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isMutating}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isMutating || !form.formState.isValid}>
              {(() => {
                if (isMutating) return "Đang lưu..."
                return mode === "create" ? "Thêm danh mục" : "Lưu thay đổi"
              })()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

