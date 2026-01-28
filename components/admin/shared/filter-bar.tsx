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
        {filters.map((filter) => (
          <Select
            key={filter.key}
            value={filterValues[filter.key] || filter.options[0]?.value || ""}
            onValueChange={(value) => onFilterChange?.(filter.key, value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}
      </CardContent>
    </Card>
  )
}
