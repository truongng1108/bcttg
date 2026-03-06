import type { SelectOption } from "@/lib/data/types"

export const ROLE_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "USER", label: "Người dùng" },
]

export const ARCHIVE_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "not-archived", label: "Chưa lưu trữ" },
  { value: "archived", label: "Đã lưu trữ" },
]

export const PINNED_FILTER_OPTIONS: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "pinned", label: "Đã ghim" },
  { value: "not-pinned", label: "Chưa ghim" },
]

