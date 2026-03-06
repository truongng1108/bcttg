export const ROLE_LABELS = {
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  user: "Người dùng",
} as const

export type RoleLabel = typeof ROLE_LABELS[keyof typeof ROLE_LABELS]

// UserRole labels for admin panel
export const USER_ROLE_LABELS: Record<"ADMIN" | "MANAGER" | "USER", string> = {
  ADMIN: "Quản trị viên",
  MANAGER: "Quản lý",
  USER: "Người dùng",
}

