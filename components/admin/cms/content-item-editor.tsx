"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { Controller, useForm, type Control } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import { Label } from "@/components/ui/label"
import { ContentItemFormSchema, type ContentItemFormData } from "@/lib/schemas/content-item.schema"
import type { ContentItem, MediaAsset } from "@/lib/types/api"
import { MediaService } from "@/lib/services/media.service"
import type { SelectOption } from "@/lib/data/types"
import { Upload, X } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getMediaUrl } from "@/lib/utils/media"

const CKEditorField = dynamic(
  () =>
    import("@/components/admin/shared/rich-text-editor/ckeditor-field").then(
      (mod) => mod.CKEditorField
    ),
  { ssr: false }
)

interface BodyHtmlFieldBlockProps {
  readonly control: Control<ContentItemFormData>
  readonly label: string
  readonly helpText: string
  readonly disabled: boolean
}

function BodyHtmlFieldBlock({
  control,
  label,
  helpText,
  disabled,
}: Readonly<BodyHtmlFieldBlockProps>) {
  return (
    <Controller
      control={control}
      name="bodyHtml"
      render={({ field, fieldState }) => {
        const errorMessage = fieldState.error?.message
        const htmlValue = field.value ?? ""
        return (
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">{label}</Label>
            <CKEditorField
              value={htmlValue}
              onChange={(html) => {
                field.onChange(html)
              }}
              disabled={disabled}
              minHeight={288}
            />
            {helpText && !errorMessage && (
              <p className="text-xs text-muted-foreground">{helpText}</p>
            )}
            {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
          </div>
        )
      }}
    />
  )
}

function normalizePublishedAtInput(value: string | null | undefined): string | null | undefined {
  if (value == null) return value
  const trimmed = value.trim()
  if (trimmed.length === 0) return null
  if (trimmed.includes("T")) return trimmed
  return `${trimmed}T00:00:00Z`
}

export interface ContentItemEditorProps {
  readonly mode: "create" | "edit"
  readonly initialData?: ContentItem
  readonly resolvedCoverMedia?: MediaAsset | null
  readonly categoryOptions: readonly SelectOption[]
  readonly onSubmit: (data: ContentItemFormData) => Promise<void>
  readonly isMutating?: boolean
  readonly onCancel?: () => void
  readonly onAfterSuccess?: () => void
  readonly active?: boolean
  readonly variant?: "dialog" | "page"
}

export function ContentItemEditor({
  mode,
  initialData,
  resolvedCoverMedia = null,
  categoryOptions,
  onSubmit,
  isMutating = false,
  onCancel,
  onAfterSuccess,
  active = true,
  variant = "page",
}: Readonly<ContentItemEditorProps>) {
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [coverMediaId, setCoverMediaId] = useState<number | null>(
    initialData?.coverMediaId ?? initialData?.coverMedia?.id ?? null
  )
  const form = useForm<ContentItemFormData>({
    resolver: zodResolver(ContentItemFormSchema),
    defaultValues: {
      categoryId: initialData?.categoryId || 0,
      title: initialData?.title || "",
      summary: initialData?.summary || "",
      bodyHtml: initialData?.bodyHtml || "",
      coverMediaId: initialData?.coverMediaId ?? initialData?.coverMedia?.id ?? null,
      isVisible: initialData?.isVisible ?? true,
      sortOrder: initialData?.sortOrder || 0,
      publishedAt: initialData?.publishedAt || null,
    },
  })

  useEffect(() => {
    if (!active) return
    if (initialData) {
      const effectiveCoverId = initialData.coverMediaId ?? initialData.coverMedia?.id ?? null
      form.reset({
        categoryId: initialData.categoryId,
        title: initialData.title,
        summary: initialData.summary ?? "",
        bodyHtml: initialData.bodyHtml ?? "",
        coverMediaId: effectiveCoverId,
        isVisible: initialData.isVisible,
        sortOrder: initialData.sortOrder,
        publishedAt: initialData.publishedAt ?? null,
      })
      setCoverMediaId(effectiveCoverId)
      setCoverFile(null)
      const idsMatch =
        resolvedCoverMedia != null &&
        effectiveCoverId != null &&
        Number(resolvedCoverMedia.id) === Number(effectiveCoverId)
      const previewFromResolved = idsMatch ? getMediaUrl(resolvedCoverMedia) : null
      const previewFromEmbedded = initialData.coverMedia
        ? getMediaUrl(initialData.coverMedia)
        : null
      setPreviewImage(previewFromResolved ?? previewFromEmbedded ?? null)
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
    }
  }, [active, initialData, form, resolvedCoverMedia])

  useEffect(() => {
    if (coverFile instanceof File) {
      const url = URL.createObjectURL(coverFile)
      setPreviewImage(url)
      return () => {
        URL.revokeObjectURL(url)
      }
    }
    if (coverMediaId && !coverFile) {
      if (
        resolvedCoverMedia != null &&
        Number(resolvedCoverMedia.id) === Number(coverMediaId)
      ) {
        const url = getMediaUrl(resolvedCoverMedia)
        if (url) {
          setPreviewImage(url)
          return
        }
      }
      const embedded = initialData?.coverMedia
      const embeddedId = initialData?.coverMediaId ?? initialData?.coverMedia?.id
      if (embedded && embeddedId != null && Number(embeddedId) === Number(coverMediaId)) {
        const url = getMediaUrl(embedded)
        if (url) {
          setPreviewImage(url)
          return
        }
      }
      MediaService.getById(coverMediaId)
        .then((media) => {
          const url = getMediaUrl(media)
          if (url) {
            setPreviewImage(url)
          }
        })
        .catch(() => {
          setPreviewImage(null)
        })
      return
    }
    setPreviewImage(null)
  }, [coverFile, coverMediaId, initialData?.coverMedia, initialData?.coverMediaId, resolvedCoverMedia])

  const handleSubmit = async (data: ContentItemFormData) => {
    try {
      let finalCoverMediaId = coverMediaId
      const normalizedPublishedAt = normalizePublishedAtInput(data.publishedAt)

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

      onAfterSuccess?.()
    } catch {
    }
  }

  const handleRemoveCover = () => {
    setCoverFile(null)
    setCoverMediaId(null)
    setPreviewImage(null)
    form.setValue("coverMediaId", null)
  }

  const filteredCategoryOptions = categoryOptions.filter((opt) => opt.value !== "all")

  let submitLabel = "Lưu thay đổi"
  if (isMutating) {
    submitLabel = "Đang lưu..."
  } else if (mode === "create") {
    submitLabel = "Thêm bài viết"
  }

  const coverBlock = (
    <div className="space-y-3">
      {previewImage ? (
        <div className="relative inline-block">
          <img
            src={previewImage}
            alt="Ảnh bìa"
            className="max-h-48 w-auto max-w-full rounded-lg border border-border object-contain object-left"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -right-2 -top-2 h-8 w-8 shadow-sm"
            onClick={handleRemoveCover}
            disabled={isMutating}
            aria-label="Gỡ ảnh bìa"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <label className="cursor-pointer" aria-label="Chọn ảnh bìa">
            <div className="flex h-36 w-36 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 hover:border-primary">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <span className="mt-2 block text-xs text-muted-foreground">Tải ảnh lên</span>
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
  )

  const formFieldsInner = (
    <>
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
        <p className="text-sm font-medium text-foreground">Ảnh bìa</p>
        {coverBlock}
      </div>

      <BodyHtmlFieldBlock
        control={form.control}
        label="Nội dung"
        helpText="Có thể sử dụng HTML để định dạng nội dung"
        disabled={isMutating}
      />

      <div className="grid gap-4 sm:grid-cols-2">
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
    </>
  )

  const actionButtons = (
    <>
      <Button type="button" variant="outline" onClick={() => onCancel?.()} disabled={isMutating}>
        Hủy
      </Button>
      <Button type="submit" disabled={isMutating || !form.formState.isValid}>
        {submitLabel}
      </Button>
    </>
  )

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className={variant === "page" ? "" : "space-y-4"}>
        {variant === "page" ? (
          <Card className="border-border/80 shadow-sm">
            <CardContent className="space-y-10 pt-6">
              <div className="space-y-4 rounded-lg border border-border/80 bg-muted/25 p-4 md:p-5">
                <p className="text-sm font-semibold text-foreground">Thông tin chính</p>
                <div className="space-y-4">
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
                </div>
              </div>

              <div className="space-y-4 rounded-lg border border-border/80 bg-muted/25 p-4 md:p-5">
                <p className="text-sm font-semibold text-foreground">Ảnh bìa</p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {coverMediaId != null && coverMediaId !== 0
                    ? "Chọn ảnh khác hoặc gỡ ảnh — thay đổi có hiệu lực sau khi bấm Lưu."
                    : "Chưa có ảnh bìa. Chọn ảnh để thêm (áp dụng khi Lưu)."}
                </p>
                {coverBlock}
              </div>

              <div className="space-y-4 rounded-lg border border-border/80 bg-muted/25 p-4 md:p-5">
                <p className="text-sm font-semibold text-foreground">Nội dung</p>
                <BodyHtmlFieldBlock
                  control={form.control}
                  label="Nội dung (HTML)"
                  helpText="Có thể sử dụng HTML để định dạng nội dung"
                  disabled={isMutating}
                />
              </div>

              <div className="space-y-4 rounded-lg border border-border/80 bg-muted/25 p-4 md:p-5">
                <p className="text-sm font-semibold text-foreground">Xuất bản & hiển thị</p>
                <div className="grid gap-4 sm:grid-cols-2">
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
              </div>
            </CardContent>
            <CardFooter className="flex flex-wrap justify-end gap-2 border-t">{actionButtons}</CardFooter>
          </Card>
        ) : (
          <>
            {formFieldsInner}
            <DialogFooter>{actionButtons}</DialogFooter>
          </>
        )}
    </form>
  )
}
