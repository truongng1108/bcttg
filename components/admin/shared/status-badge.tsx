import { cn } from "@/lib/utils"

export type StatusType = "active" | "inactive" | "locked" | "pending" | "hidden"

interface StatusBadgeProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<
  StatusType,
  { label: string; className: string }
> = {
  active: {
    label: "Hoạt động",
    className: "bg-[#2E7D32]/10 text-[#2E7D32]",
  },
  inactive: {
    label: "Không hoạt động",
    className: "bg-muted text-muted-foreground",
  },
  locked: {
    label: "Đã khóa",
    className: "bg-destructive/10 text-destructive",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-[#F57C00]/10 text-[#F57C00]",
  },
  hidden: {
    label: "Đã ẩn",
    className: "bg-muted text-muted-foreground",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
