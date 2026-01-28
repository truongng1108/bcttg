"use client"

import { AdminPagination } from "@/components/admin/shared/admin-pagination"

export interface SongsPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  filteredItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function SongsPagination({
  currentPage,
  totalPages,
  totalItems,
  filteredItems,
  pageSize,
  onPageChange,
}: SongsPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Hiển thị {filteredItems} / {totalItems} ca khúc
      </p>
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredItems}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  )
}
