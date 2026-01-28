export const ROLE_LABELS = {
  admin: "Quản trị viên",
  editor: "Biên tập viên",
  user: "Người dùng",
} as const

export type RoleLabel = typeof ROLE_LABELS[keyof typeof ROLE_LABELS]

