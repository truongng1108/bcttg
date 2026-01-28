"use client"

import { FilterBar } from "@/components/admin/shared/filter-bar"
import type { FilterConfig } from "@/lib/types/components"
import type { SelectOption } from "@/lib/data/types"

export interface SongsFiltersProps {
  readonly searchQuery: string
  readonly onSearchChange: (query: string) => void
  readonly categoryFilter: string
  readonly statusFilter: string
  readonly categoryOptions: readonly SelectOption[]
  readonly statusOptions: readonly SelectOption[]
  readonly onFilterChange: (key: string, value: string) => void
}

export function SongsFilters({
  searchQuery,
  onSearchChange,
  categoryFilter,
  statusFilter,
  categoryOptions,
  statusOptions,
  onFilterChange,
}: SongsFiltersProps) {
  const filterConfigs: FilterConfig[] = [
    {
      key: "category",
      label: "Thể loại",
      options: [{ value: "all", label: "Tất cả thể loại" }, ...categoryOptions],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [{ value: "all", label: "Tất cả" }, ...statusOptions],
    },
  ]

  return (
    <FilterBar
      searchQuery={searchQuery}
      onSearchChange={onSearchChange}
      filters={filterConfigs}
      filterValues={{ category: categoryFilter, status: statusFilter }}
      onFilterChange={onFilterChange}
      searchPlaceholder="Tìm kiếm theo tên ca khúc, tác giả..."
    />
  )
}
