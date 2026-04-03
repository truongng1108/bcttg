"use client"

import { cn } from "@/lib/utils"
import { getUserRoleBadgeClassName } from "@/lib/constants/roles"

export interface RoleBadgeProps {
  readonly role: string
  readonly className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const style = getUserRoleBadgeClassName(role)
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-1 text-xs font-semibold",
        style,
        className
      )}
    >
      {role}
    </span>
  )
}
