import type React from "react"

export interface SummaryCardProps {
  title: string
  value: string
  change: number
  icon: React.ElementType
  period: string
}

export interface ExportOptionProps {
  title: string
  description: string
  onClick: () => void
}

export interface ChartContainerProps {
  title: string
  children: React.ReactNode
  onExport?: () => void
}

export interface StatusItemProps {
  label: string
  status: "active" | "warning" | "error"
  detail: string
}

export interface PendingRowProps {
  title: string
  type: string
  author: string
  date: string
  status: "pending" | "review"
}

export interface PageHeaderProps {
  icon?: React.ElementType
  title: string
  description?: string
  actions?: React.ReactNode
  metadata?: React.ReactNode
}

export interface FilterOption {
  value: string
  label: string
}

export interface FilterConfig {
  key: string
  label: string
  options: FilterOption[]
}

export interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  filters?: FilterConfig[]
  filterValues?: Record<string, string>
  onFilterChange?: (key: string, value: string) => void
  searchPlaceholder?: string
}

export interface NavItemData {
  readonly id: string
  readonly href?: string
  readonly label: string
  readonly icon: React.ElementType
  readonly children?: readonly NavItemData[]
}

export interface NavItemComponentProps {
  readonly item: NavItemData
  readonly collapsed: boolean
  readonly pathname: string
  readonly level?: number
}

export interface AdminFilterConfig<TFilterKey extends string = string> {
  readonly key: TFilterKey
  readonly label: string
  readonly options: readonly FilterOption[]
}
