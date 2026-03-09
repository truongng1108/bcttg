"use client"

import { useEffect, useState } from "react"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { ContentItemsService } from "@/lib/services/content-items.service"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import { MediaService } from "@/lib/services/media.service"
import type { ContentItem, ContentCategory, MediaAsset } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"
import { getMediaUrl } from "@/lib/utils/media"

interface ContentDetailContentProps {
  readonly contentId: number
}

export function ContentDetailContent({ contentId }: ContentDetailContentProps) {
  const [loading, setLoading] = useState(false)
  const [contentItem, setContentItem] = useState<ContentItem | null>(null)
  const [category, setCategory] = useState<ContentCategory | null>(null)
  const [coverMedia, setCoverMedia] = useState<MediaAsset | null>(null)

  useEffect(() => {
    if (contentId) {
      loadDetail()
    }
  }, [contentId])

  const loadDetail = async () => {
    if (!contentId) return
    setLoading(true)
    try {
      const item = await ContentItemsService.getByIdAdmin(contentId)
      setContentItem(item)

      if (item.coverMedia) {
        setCoverMedia(item.coverMedia)
      } else if (item.coverMediaId) {
        try {
          const media = await MediaService.getById(item.coverMediaId)
          setCoverMedia(media)
        } catch {
        }
      }

      try {
        const cat = await ContentCategoriesService.getByIdAdmin(item.categoryId)
        setCategory(cat)
      } catch {
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin bài viết")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (!contentItem) {
    return <div className="py-8 text-center text-muted-foreground">Không tìm thấy bài viết</div>
  }

  return (
    <div className="space-y-6">
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

