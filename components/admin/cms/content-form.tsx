"use client"

import { useEffect, useState } from "react"
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
import { ContentItemFormSchema, type ContentItemFormData } from "@/lib/schemas/content-item.schema"
import type { ContentItem } from "@/lib/types/api"
import { MediaService } from "@/lib/services/media.service"
import type { SelectOption } from "@/lib/data/types"
import { Upload, X, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"

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
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [coverMediaId, setCoverMediaId] = useState<number | null>(
    initialData?.coverMediaId || null
  )
  const [deleteCoverDialogOpen, setDeleteCoverDialogOpen] = useState(false)
  const [pendingDeleteCoverMediaId, setPendingDeleteCoverMediaId] = useState<number | null>(null)

  const form = useForm<ContentItemFormData>({
    resolver: zodResolver(ContentItemFormSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || 0,
      title: initialData?.title || "",
      summary: initialData?.summary || "",
      bodyHtml: initialData?.bodyHtml || "",
      coverMediaId: initialData?.coverMediaId || null,
      isVisible: initialData?.isVisible ?? true,
      sortOrder: initialData?.sortOrder || 0,
      publishedAt: initialData?.publishedAt || null,
    },
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        form.reset({
          categoryId: initialData.categoryId,
          title: initialData.title,
          summary: initialData.summary || "",
          bodyHtml: initialData.bodyHtml || "",
          coverMediaId: initialData.coverMediaId,
          isVisible: initialData.isVisible,
          sortOrder: initialData.sortOrder,
          publishedAt: initialData.publishedAt || null,
        })
        setCoverMediaId(initialData.coverMediaId)
        setCoverFile(null)
        setPreviewImage(null)
        setPendingDeleteCoverMediaId(null)
      } else {
        form.reset({
          categoryId: 0,
          title: "",
          summary: "",
          bodyHtml: "",
          coverMediaId: null,
          isVisible: true,
          sortOrder: 0,
          publishedAt: null,
        })
        setCoverMediaId(null)
        setCoverFile(null)
        setPreviewImage(null)
        setPendingDeleteCoverMediaId(null)
      }
    }
  }, [open, initialData, form])

  useEffect(() => {
    if (coverFile instanceof File) {
      const url = URL.createObjectURL(coverFile)
      setPreviewImage(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    } else if (coverMediaId && !coverFile) {
      MediaService.getById(coverMediaId)
        .then((media) => {
          if (media?.url) {
            setPreviewImage(media.url)
          } else if (media?.storageKey) {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech"
            setPreviewImage(`${baseUrl}/files/${media.storageKey}`)
          }
        })
        .catch(() => {
          setPreviewImage(null)
        })
    } else {
      setPreviewImage(null)
    }
  }, [coverFile, coverMediaId])

  const handleSubmit = async (data: ContentItemFormData) => {
    try {
      let finalCoverMediaId = coverMediaId
      let normalizedPublishedAt = data.publishedAt
      if (normalizedPublishedAt) {
        const trimmed = normalizedPublishedAt.trim()
        if (trimmed.length === 0) {
          normalizedPublishedAt = null
        } else if (!trimmed.includes("T")) {
          normalizedPublishedAt = `${trimmed}T00:00:00Z`
        } else {
          normalizedPublishedAt = trimmed
        }
      }

      if (coverFile instanceof File) {
        try {
          const media = await MediaService.upload(coverFile)
          finalCoverMediaId = media.id
        } catch (err) {
          toast.error("Upload ảnh bìa thất bại")
          throw err
        }
      }

      const submitData: ContentItemFormData = {
        ...data,
        coverMediaId: finalCoverMediaId,
        publishedAt: normalizedPublishedAt,
      }

      await onSubmit(submitData)

      if (pendingDeleteCoverMediaId && pendingDeleteCoverMediaId !== finalCoverMediaId) {
        try {
          await MediaService.delete(pendingDeleteCoverMediaId)
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Xóa file ảnh bìa thất bại")
        }
      }
      onOpenChange(false)
    } catch {
    }
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverMediaId(null)
    setPreviewImage(null)
    form.setValue("coverMediaId", null)
  }

  const confirmDeleteCover = async () => {
    if (!coverMediaId) return
    try {
      setPendingDeleteCoverMediaId(coverMediaId)
      handleRemoveCover()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Xóa ảnh bìa thất bại")
    } finally {
      setDeleteCoverDialogOpen(false)
    }
  }

  const filteredCategoryOptions = categoryOptions.filter((opt) => opt.value !== "all")

  return (
    <>
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
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormFieldRHF
              control={form.control}
              name="categoryId"
              label="Danh mục"
              type="select"
              required
              options={filteredCategoryOptions}
            />

            <FormFieldRHF
              control={form.control}
              name="title"
              label="Tiêu đề"
              required
              placeholder="Nhập tiêu đề bài viết"
            />

            <FormFieldRHF
              control={form.control}
              name="summary"
              label="Tóm tắt"
              type="textarea"
              rows={3}
              placeholder="Nhập tóm tắt bài viết"
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Ảnh bìa
              </p>
              {previewImage ? (
                <div className="relative inline-block">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="h-32 w-32 rounded-lg border object-cover"
                  />
                  {coverMediaId && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute -left-2 -top-2 h-6 w-6 bg-background"
                      onClick={() => setDeleteCoverDialogOpen(true)}
                      disabled={isMutating}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6"
                    onClick={handleRemoveCover}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer" aria-label="Chọn ảnh bìa">
                    <div className="flex h-32 w-32 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                        <span className="mt-2 text-xs text-muted-foreground">
                          Tải ảnh lên
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null
                        setCoverFile(file)
                      }}
                    />
                  </label>
                </div>
              )}
            </div>

            <FormFieldRHF
              control={form.control}
              name="bodyHtml"
              label="Nội dung"
              type="textarea"
              rows={10}
              placeholder="Nhập nội dung bài viết (HTML)"
              helpText="Có thể sử dụng HTML để định dạng nội dung"
            />

            <div className="grid grid-cols-2 gap-4">
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
                name="publishedAt"
                label="Ngày xuất bản"
                type="date"
                placeholder="Chọn ngày"
                helpText="Chọn ngày xuất bản (tùy chọn)"
              />
            </div>

            <FormFieldRHF
              control={form.control}
              name="isVisible"
              label="Hiển thị"
              type="switch"
              helpText="Bật/tắt hiển thị bài viết trên ứng dụng"
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
                  return mode === "create" ? "Thêm bài viết" : "Lưu thay đổi"
                })()}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteCoverDialogOpen}
        onOpenChange={setDeleteCoverDialogOpen}
        title="Xác nhận xóa ảnh bìa"
        description="Bạn có chắc chắn muốn xóa file ảnh bìa khỏi hệ thống? Hành động này không thể hoàn tác."
        confirmText="Xóa file"
        cancelText="Hủy"
        variant="danger"
        icon="delete"
        onConfirm={confirmDeleteCover}
      />
    </>
  )
}

