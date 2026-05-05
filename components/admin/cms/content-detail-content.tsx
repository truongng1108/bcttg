"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { Button } from "@/components/ui/button"
import { ContentItemEditor } from "@/components/admin/cms/content-item-editor"
import { ContentItemsService } from "@/lib/services/content-items.service"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import { MediaService } from "@/lib/services/media.service"
import type { ContentItem, ContentCategory, MediaAsset } from "@/lib/types/api"
import type { SelectOption } from "@/lib/data/types"
import type { ContentItemFormData } from "@/lib/schemas/content-item.schema"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"
import { getMediaUrl } from "@/lib/utils/media"

interface ContentDetailContentProps {
  readonly contentId: number
}

async function loadCoverMediaForItem(item: ContentItem): Promise<MediaAsset | null> {
  if (item.coverMedia) {
    const fromEmbedded = getMediaUrl(item.coverMedia)
    if (fromEmbedded) return item.coverMedia
    if (item.coverMediaId) {
      try {
        return await MediaService.getById(item.coverMediaId)
      } catch {
        return item.coverMedia
      }
    }
    return item.coverMedia
  }
  if (item.coverMediaId) {
    try {
      return await MediaService.getById(item.coverMediaId)
    } catch {
      return null
    }
  }
  return null
}

export function ContentDetailContent({ contentId }: ContentDetailContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditing = searchParams.get("edit") === "1"

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [contentItem, setContentItem] = useState<ContentItem | null>(null)
  const [category, setCategory] = useState<ContentCategory | null>(null)
  const [coverMedia, setCoverMedia] = useState<MediaAsset | null>(null)
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])

  const loadDetail = useCallback(async (silent?: boolean) => {
    if (!contentId) return
    if (!silent) setLoading(true)
    try {
      const item = await ContentItemsService.getByIdAdmin(contentId)
      setContentItem(item)
      setCoverMedia(await loadCoverMediaForItem(item))

      try {
        const cat = await ContentCategoriesService.getByIdAdmin(item.categoryId)
        setCategory(cat)
      } catch {
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin bài viết")
    } finally {
      if (!silent) setLoading(false)
    }
  }, [contentId])

  useEffect(() => {
    if (contentId) {
      loadDetail()
    }
  }, [contentId, loadDetail])

  useEffect(() => {
    if (!contentItem) return
    const loadCategories = async () => {
      try {
        const response = await ContentCategoriesService.getAllAdmin({
          page_size: 500,
          type: contentItem.type ?? undefined,
        })
        const opts: SelectOption[] = [...response.data]
          .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
          .map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          }))
        setCategoryOptions(opts)
      } catch {
        toast.error("Không tải được danh mục")
      }
    }
    loadCategories()
  }, [contentItem])

  const editorCategoryOptions = useMemo(() => {
    if (!contentItem) return categoryOptions
    const id = String(contentItem.categoryId)
    if (categoryOptions.some((o) => o.value === id)) return categoryOptions
    if (category?.id === contentItem.categoryId) {
      return [{ value: id, label: category.name }, ...categoryOptions]
    }
    return [{ value: id, label: `Danh mục #${id}` }, ...categoryOptions]
  }, [contentItem, category, categoryOptions])

  const editorInitialData = useMemo(() => {
    if (!contentItem) return null
    if (!coverMedia) return contentItem
    return {
      ...contentItem,
      coverMedia,
      coverMediaId: contentItem.coverMediaId ?? coverMedia.id,
    }
  }, [contentItem, coverMedia])

  const handleSave = async (data: ContentItemFormData) => {
    if (!contentItem) return
    setSaving(true)
    try {
      await ContentItemsService.update(contentItem.id, data)
      await loadDetail(true)
      toast.success("Đã cập nhật bài viết")
      router.replace(`/cms/${contentItem.id}/detail`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cập nhật bài viết thất bại")
      throw err
    } finally {
      setSaving(false)
    }
  }

  const enterEdit = () => {
    router.push(`/cms/${contentId}/detail?edit=1`)
  }

  const exitEdit = () => {
    router.replace(`/cms/${contentId}/detail`)
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (!contentItem) {
    return <div className="py-8 text-center text-muted-foreground">Không tìm thấy bài viết</div>
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Sửa bài viết</h1>
          <p className="text-sm text-muted-foreground">
            Các trường đã được điền theo dữ liệu hiện tại. Kiểm tra danh mục, ảnh bìa và ngày xuất bản trước khi lưu.
          </p>
        </div>
        <ContentItemEditor
          active={isEditing}
          mode="edit"
          initialData={editorInitialData ?? contentItem}
          resolvedCoverMedia={coverMedia}
          categoryOptions={editorCategoryOptions}
          onSubmit={handleSave}
          isMutating={saving}
          onCancel={exitEdit}
          variant="page"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{contentItem.title}</h1>
        <Button type="button" onClick={enterEdit}>
          Sửa
        </Button>
      </div>

      <DetailSection title="Thông tin cơ bản">
        <DetailRow label="Tiêu đề" value={contentItem.title} />
        <DetailRow label="Danh mục" value={category?.name || "—"} />
        <DetailRow label="Tóm tắt" value={contentItem.summary || "—"} />
        <DetailRow
          label="Trạng thái"
          value={contentItem.isVisible ? "Đang hiển thị" : "Đã ẩn"}
        />
        <DetailRow label="Thứ tự sắp xếp" value={contentItem.sortOrder} />
        <DetailRow label="Lượt xem" value={contentItem.viewCount} />
      </DetailSection>

      {coverMedia && (
        <DetailSection title="Ảnh bìa">
          <div className="py-3 space-y-3">
            <div className="flex justify-center">
              <img
                src={getMediaUrl(coverMedia) || ""}
                alt="Ảnh bìa"
                className="max-w-2xl w-full h-auto rounded-lg border shadow-sm object-contain"
              />
            </div>
            <div className="space-y-2 text-sm">
              <DetailRow label="Tên file" value={coverMedia.fileName || "—"} />
              <DetailRow label="MIME Type" value={coverMedia.mimeType || "—"} />
              <DetailRow
                label="Kích thước"
                value={
                  coverMedia.sizeBytes
                    ? `${(coverMedia.sizeBytes / 1024).toFixed(2)} KB`
                    : "—"
                }
              />
            </div>
          </div>
        </DetailSection>
      )}

      {contentItem.bodyHtml && (
        <DetailSection title="Nội dung">
          <div
            className="py-3 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: contentItem.bodyHtml }}
          />
        </DetailSection>
      )}

      <DetailSection title="Thông tin thời gian">
        <DetailRow
          label="Ngày xuất bản"
          value={formatDateDetail(contentItem.publishedAt)}
        />
        <DetailRow label="Ngày tạo" value={formatDateDetail(contentItem.createdAt)} />
        <DetailRow label="Ngày cập nhật" value={formatDateDetail(contentItem.updatedAt)} />
      </DetailSection>

      <DetailSection title="Thông tin kỹ thuật">
        <DetailRow label="ID" value={contentItem.id} copyable />
        <DetailRow label="Category ID" value={contentItem.categoryId} copyable />
        {contentItem.coverMediaId && (
          <DetailRow label="Cover Media ID" value={contentItem.coverMediaId} copyable />
        )}
      </DetailSection>
    </div>
  )
}
