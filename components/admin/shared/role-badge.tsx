"use client"

import { cn } from "@/lib/utils"
import { ROLE_LABELS } from "@/lib/constants/roles"

export interface RoleBadgeProps {
  readonly role: string
  readonly className?: string
}

const roleStyles: Record<string, string> = {
  [ROLE_LABELS.admin]: "bg-destructive/10 text-destructive border-destructive/20",
  [ROLE_LABELS.editor]: "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/20",
  [ROLE_LABELS.user]: "bg-primary/10 text-primary border-primary/20",
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const style = roleStyles[role] ?? "bg-muted text-foreground border-border"
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

