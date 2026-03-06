import { useState } from "react"

export function useTableState(initialPageSize = 20) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(initialPageSize)

  const resetFilters = () => {
    setFilterValues({})
    setCurrentPage(1)
  }

  return {
    searchQuery,
    setSearchQuery,
    filterValues,
    setFilterValues,
    currentPage,
    setCurrentPage,
    pageSize,
    resetFilters,
  }
}

