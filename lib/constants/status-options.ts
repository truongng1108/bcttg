import type { SelectOption } from "@/lib/data/types"

export const STATUS_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Đang hiển thị" },
  { value: "hidden", label: "Đã ẩn" },
]

export const VISIBILITY_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "active", label: "Hoạt động" },
  { value: "locked", label: "Đã khóa" },
]

