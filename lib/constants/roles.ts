const USER_ROLE_BADGE_CLASSES: Record<"ADMIN" | "MANAGER" | "USER", string> = {
  ADMIN: "bg-destructive/10 text-destructive border-destructive/20",
  MANAGER: "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/20",
  USER: "bg-sky-600/10 text-sky-800 border-sky-600/25 dark:bg-sky-500/15 dark:text-sky-200 dark:border-sky-500/35",
}

export function getUserRoleBadgeClassName(role: string): string {
  if (role === "ADMIN" || role === "MANAGER" || role === "USER") {
    return USER_ROLE_BADGE_CLASSES[role]
  }
  return "bg-muted text-foreground border-border"
}

export const ACCOUNT_FORM_ROLE_OPTIONS = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "USER", label: "Người dùng" },
] as const
