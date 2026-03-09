"use client"

import { useEffect, useState } from "react"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { SongCategoriesService } from "@/lib/services/song-categories.service"
import type { SongCategory } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"

interface SongCategoryDetailContentProps {
  readonly categoryId: number
}

export function SongCategoryDetailContent({ categoryId }: SongCategoryDetailContentProps) {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<SongCategory | null>(null)

  useEffect(() => {
    if (categoryId) {
      loadDetail()
    }
  }, [categoryId])

  const loadDetail = async () => {
    if (!categoryId) return
    setLoading(true)
    try {
      const cat = await SongCategoriesService.getByIdAdmin(categoryId)
      setCategory(cat)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin danh mục")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (!category) {
    return <div className="py-8 text-center text-muted-foreground">Không tìm thấy danh mục</div>
  }

  return (
    <div className="space-y-6">
      <DetailSection title="Thông tin cơ bản">
        <DetailRow label="Tên danh mục" value={category.name} />
        <DetailRow label="Slug" value={category.slug} copyable />
        <DetailRow label="Mô tả" value={category.description || "—"} />
        <DetailRow label="Trạng thái" value={category.isVisible ? "Đang hiển thị" : "Đã ẩn"} />
        <DetailRow label="Thứ tự sắp xếp" value={category.sortOrder} />
      </DetailSection>

      <DetailSection title="Thông tin thời gian">
        <DetailRow label="Ngày tạo" value={formatDateDetail(category.createdAt)} />
        <DetailRow label="Ngày cập nhật" value={formatDateDetail(category.updatedAt)} />
      </DetailSection>

      <DetailSection title="Thông tin kỹ thuật">
        <DetailRow label="ID" value={category.id} copyable />
      </DetailSection>
    </div>
  )
}

