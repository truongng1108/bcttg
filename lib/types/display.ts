import type { StatusType } from "@/components/admin/shared/status-badge"

export interface CMSItemDisplay {
  id: string
  title: string
  category: string
  author: string
  status: StatusType
  views: number
  publishedAt: string
  updatedAt: string
  order: number
  isVisible: boolean
  categoryId: number
}

export interface AccountDisplay {
  id: string
  rank: string
  fullName: string
  username: string
  unit: string
  role: "ADMIN" | "MANAGER" | "USER"
  status: StatusType
  lastLogin: string
  createdAt: string
}

export interface NoteDisplay {
  id: number
  title: string
  content: string
  category: string
  starred: boolean
  createdAt: string
  updatedAt: string
  isPinned: boolean
  isArchived: boolean
}

