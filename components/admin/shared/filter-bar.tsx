"use client"

import { Search } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { FilterBarProps } from "@/lib/types/components"

const getUniqueOptionsByValue = (
  options: readonly { value: string; label: string }[]
) => {
  const seen = new Set<string>()
  return options.filter((opt) => {
    if (seen.has(opt.value)) return false
    seen.add(opt.value)
    return true
  })
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  searchPlaceholder = "Tìm kiếm...",
}: FilterBarProps) {
  return (
    <Card className="border-border">
      <CardContent className="flex items-center gap-4 p-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {filters.map((filter) => {
          const uniqueOptions = getUniqueOptionsByValue(filter.options)
          const value = filterValues[filter.key] || uniqueOptions[0]?.value || ""
          return (
            <Select
              key={filter.key}
              value={value}
              onValueChange={(v) => onFilterChange?.(filter.key, v)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                {uniqueOptions.map((option, index) => (
                  <SelectItem
                    key={`${filter.key}-${option.value}-${index}`}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        })}
      </CardContent>
    </Card>
  )
}
