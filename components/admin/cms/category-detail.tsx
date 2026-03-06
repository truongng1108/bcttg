"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import type { ContentCategory } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"

interface CategoryDetailProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly categoryId: number | null
}

export function CategoryDetail({ open, onOpenChange, categoryId }: CategoryDetailProps) {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState<ContentCategory | null>(null)
  const [parentCategory, setParentCategory] = useState<ContentCategory | null>(null)

  useEffect(() => {
    if (open && categoryId) {
      loadDetail()
    } else {
      setCategory(null)
      setParentCategory(null)
    }
  }, [open, categoryId])

  const loadDetail = async () => {
    if (!categoryId) return
    setLoading(true)
    try {
      const cat = await ContentCategoriesService.getByIdAdmin(categoryId)
      setCategory(cat)

      // Load parent category if exists
      if (cat.parentId) {
        try {
          const parent = await ContentCategoriesService.getByIdAdmin(cat.parentId)
          setParentCategory(parent)
        } catch {
          // Parent might not exist
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin danh mục")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết danh mục</DialogTitle>
          <DialogDescription>Thông tin đầy đủ về danh mục</DialogDescription>
        </DialogHeader>

        {loading && <AdminLoadingState />}

        {!loading && category && (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <DetailSection title="Thông tin cơ bản">
              <DetailRow label="Tên danh mục" value={category.name} />
              <DetailRow label="Slug" value={category.slug} copyable />
              <DetailRow
                label="Loại"
                value={category.type === "TRUYEN_THONG" ? "Truyền thống" : "Nét tiêu biểu"}
              />
              <DetailRow
                label="Danh mục cha"
                value={parentCategory?.name || (category.parentId ? `ID: ${category.parentId}` : "Không có")}
              />
              <DetailRow label="Mô tả" value={category.description || "—"} />
              <DetailRow label="Trạng thái" value={category.isVisible ? "Đang hiển thị" : "Đã ẩn"} />
              <DetailRow label="Thứ tự sắp xếp" value={category.sortOrder} />
            </DetailSection>

            {/* Thông tin thời gian */}
            <DetailSection title="Thông tin thời gian">
              <DetailRow label="Ngày tạo" value={formatDateDetail(category.createdAt)} />
              <DetailRow label="Ngày cập nhật" value={formatDateDetail(category.updatedAt)} />
            </DetailSection>

            {/* Thông tin kỹ thuật */}
            <DetailSection title="Thông tin kỹ thuật">
              <DetailRow label="ID" value={category.id} copyable />
              {category.parentId && (
                <DetailRow label="Parent ID" value={category.parentId} copyable />
              )}
            </DetailSection>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

