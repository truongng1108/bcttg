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
import {
  ContentCategoryFormInputSchema,
  type ContentCategoryFormInput,
  type ContentCategoryFormData,
} from "@/lib/schemas/content-category.schema"
import type { ContentCategory } from "@/lib/types/api"
import { CONTENT_TYPES, CONTENT_TYPE_OPTIONS } from "@/lib/constants/content-types"

interface CategoryFormProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly mode: "create" | "edit"
  readonly initialData?: ContentCategory
  readonly defaultParentId?: number | null
  readonly parentCategories?: ContentCategory[]
  readonly onSubmit: (data: ContentCategoryFormData) => Promise<void>
  readonly isMutating?: boolean
}

const NO_PARENT_CATEGORY_VALUE = "none"

export function CategoryForm({
  open,
  onOpenChange,
  mode,
  initialData,
  defaultParentId,
  parentCategories = [],
  onSubmit,
  isMutating = false,
}: CategoryFormProps) {
  let resolvedParentId = NO_PARENT_CATEGORY_VALUE
  if (mode === "edit") {
    resolvedParentId = initialData?.parentId ? String(initialData.parentId) : NO_PARENT_CATEGORY_VALUE
  } else if (defaultParentId !== null && defaultParentId !== undefined) {
    resolvedParentId = String(defaultParentId)
  }

  const form = useForm<ContentCategoryFormInput>({
    resolver: zodResolver(ContentCategoryFormInputSchema),
    defaultValues: {
      type: initialData?.type || CONTENT_TYPES.TRUYEN_THONG,
      parentId: resolvedParentId,
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
          type: initialData.type,
          parentId: resolvedParentId,
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          isVisible: initialData.isVisible,
          sortOrder: initialData.sortOrder,
        })
      } else {
        form.reset({
          type: CONTENT_TYPES.TRUYEN_THONG,
          parentId: resolvedParentId,
          name: "",
          slug: "",
          description: "",
          isVisible: true,
          sortOrder: 0,
        })
      }
    }
  }, [open, initialData, form, resolvedParentId])

  const handleSubmit = async (data: ContentCategoryFormInput) => {
    try {
      const transformed: ContentCategoryFormData = {
        ...data,
        parentId: data.parentId === NO_PARENT_CATEGORY_VALUE ? null : Number(data.parentId),
      }
      await onSubmit(transformed)
      onOpenChange(false)
    } catch {
    }
  }

  const parentOptions = [
    { value: NO_PARENT_CATEGORY_VALUE, label: "Không có danh mục cha" },
    ...parentCategories
      .filter((cat) => cat.type === form.watch("type") && cat.id !== initialData?.id)
      .map((cat) => ({
        value: String(cat.id),
        label: cat.name,
      })),
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Thêm danh mục" : "Sửa danh mục"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Thêm danh mục mới cho nội dung CMS"
              : "Cập nhật thông tin danh mục"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormFieldRHF
            control={form.control}
            name="type"
            label="Loại danh mục"
            type="select"
            required
            options={CONTENT_TYPE_OPTIONS}
          />
          <FormFieldRHF
            control={form.control}
            name="parentId"
            label="Danh mục cha"
            type="select"
            options={parentOptions}
            helpText="Chọn danh mục cha nếu muốn tạo danh mục con (tối đa 2 cấp)"
          />
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
            placeholder="tin-noi-bo"
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

