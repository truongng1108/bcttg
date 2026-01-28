"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

export interface AdminPaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: AdminPaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalItems)

  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else if (currentPage <= 3) {
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i)
      }
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        pages.push(i)
      }
    }

    return pages
  }

  return (
    <div className={`flex items-center justify-between ${className || ""}`}>
      <p className="text-sm text-muted-foreground">
        Hiển thị {startItem} - {endItem} trong tổng số {totalItems} mục
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
          <span className="sr-only">Trang đầu</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Trang trước</span>
        </Button>

        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="sm"
            className="h-8 w-8"
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Trang sau</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 bg-transparent"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
          <span className="sr-only">Trang cuối</span>
        </Button>
      </div>
    </div>
  )
}
