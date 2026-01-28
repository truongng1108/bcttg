export const STATUS_COLORS = {
  active: "bg-[#2E7D32]",
  warning: "bg-[#F57C00]",
  error: "bg-destructive",
} as const

export const PENDING_STATUS_LABELS = {
  pending: { label: "Chờ duyệt", className: "bg-[#F57C00]/10 text-[#F57C00]" },
  review: { label: "Đang xem xét", className: "bg-info/10 text-info" },
} as const
