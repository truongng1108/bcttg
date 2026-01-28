"use client"

import type React from "react"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface Column<T> {
  readonly key: keyof T | string
  readonly title: string
  readonly sortable?: boolean
  readonly width?: string
  readonly render?: (value: DataTableValue, row: T) => React.ReactNode
}

type DataTablePrimitive = string | number | boolean | null | undefined
type DataTableRecord = { [key: string]: DataTableValue }
type DataTableValue = DataTablePrimitive | DataTableRecord | readonly DataTableValue[]
type DataTableFilterValues = Record<string, string>

export interface DataTableProps<T> {
  readonly columns: readonly Column<T>[]
  readonly data: readonly T[]
  readonly searchPlaceholder?: string
  readonly onSearch?: (value: string) => void
  readonly filters?: readonly {
    readonly key: string
    readonly label: string
    readonly options: readonly { value: string; label: string }[]
  }[]
  readonly filterValues?: DataTableFilterValues
  readonly onFilterChange?: (key: string, value: string) => void
  readonly onClearFilters?: () => void
  readonly pageSize?: number
  readonly totalItems?: number
  readonly currentPage?: number
  readonly onPageChange?: (page: number) => void
  readonly onSort?: (key: string, direction: "asc" | "desc") => void
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "Tìm kiếm...",
  onSearch,
  filters,
  filterValues,
  onFilterChange,
  onClearFilters,
  pageSize = 10,
  totalItems,
  currentPage = 1,
  onPageChange,
  onSort,
}: DataTableProps<T>) {
  const [searchValue, setSearchValue] = useState("")
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showFilters, setShowFilters] = useState(false)
  const [localFilterValues, setLocalFilterValues] = useState<DataTableFilterValues>({})

  const total = totalItems ?? data.length
  const totalPages = Math.ceil(total / pageSize)
  const startItem = (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, total)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const displayData = data.slice(startIndex, endIndex)
  const effectiveFilterValues = filterValues ?? localFilterValues

  const handleSearch = (value: string) => {
    setSearchValue(value)
    onSearch?.(value)
  }

  const handleSort = (key: string) => {
    const newDirection =
      sortKey === key && sortDirection === "asc" ? "desc" : "asc"
    setSortKey(key)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  const formatCellValue = (value: DataTableValue): string => {
    if (value === null || value === undefined) return ""
    if (typeof value === "string") return value
    if (typeof value === "number") return String(value)
    if (typeof value === "boolean") return value ? "true" : "false"
    return ""
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3 w-3 opacity-50" />
    if (sortDirection === "asc") return <ArrowUp className="h-3 w-3" />
    return <ArrowDown className="h-3 w-3" />
  }

  const getValue = (row: T, key: string): DataTableValue => {
    const parts = key.split(".")
    let current: DataTableValue = row as DataTableRecord

    for (const part of parts) {
      if (!current || typeof current !== "object" || Array.isArray(current)) {
        return undefined
      }
      const record = current as DataTableRecord
      current = record[part]
    }

    return current
  }

  const handleFilterValueChange = (key: string, value: string) => {
    if (!filterValues) {
      setLocalFilterValues((prev) => ({ ...prev, [key]: value }))
    }
    onFilterChange?.(key, value)
  }

  const handleClearAllFilters = () => {
    if (!filterValues) {
      setLocalFilterValues({})
    }
    onClearFilters?.()
  }

  const hasAnyFilterSelected = Object.values(effectiveFilterValues).some(
    (value) => value !== "all"
  )

  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          {filters && filters.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "bg-muted")}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Bộ lọc
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && filters && filters.length > 0 && (
        <div className="flex flex-wrap gap-3 border-b border-border bg-muted/30 p-4">
          {filters.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {filter.label}:
              </span>
              <Select
                value={effectiveFilterValues[filter.key] ?? "all"}
                onValueChange={(value) => handleFilterValueChange(filter.key, value)}
              >
                <SelectTrigger className="h-8 w-40">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            disabled={!hasAnyFilterSelected}
            onClick={handleClearAllFilters}
          >
            Xóa bộ lọc
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={cn(
                    "px-4 py-3 text-left text-xs font-semibold uppercase text-muted-foreground",
                    column.width
                  )}
                >
                  {column.sortable ? (
                    <button
                      className="flex items-center gap-1 transition-colors hover:text-foreground"
                      onClick={() => handleSort(String(column.key))}
                    >
                      {column.title}
                      {getSortIcon(String(column.key))}
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              displayData.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-4 py-3 text-sm text-foreground"
                    >
                      {column.render
                        ? column.render(getValue(row, String(column.key)), row)
                        : formatCellValue(getValue(row, String(column.key)))}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          Hiển thị {startItem} - {endItem} trong tổng số {total} mục
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => onPageChange?.(1)}
            disabled={currentPage === 1}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Trang đầu</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => onPageChange?.(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Trang trước</span>
          </Button>

          {/* Page numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum: number
            if (totalPages <= 5) {
              pageNum = i + 1
            } else if (currentPage <= 3) {
              pageNum = i + 1
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i
            } else {
              pageNum = currentPage - 2 + i
            }
            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                className="h-8 w-8"
                onClick={() => onPageChange?.(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => onPageChange?.(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Trang sau</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => onPageChange?.(totalPages)}
            disabled={currentPage === totalPages}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Trang cuối</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
