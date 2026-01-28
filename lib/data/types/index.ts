import type React from "react"
import type { StatusType } from "@/components/admin/shared/status-badge"

export interface Account {
  id: string
  rank: string
  fullName: string
  username: string
  unit: string
  role: string
  status: StatusType
  lastLogin: string
  createdAt: string
}

export interface CMSItem {
  id: string
  title: string
  category: string
  author: string
  status: StatusType
  views: number
  publishedAt: string
  updatedAt: string
  order: number
}

export interface Song {
  id: number
  title: string
  composer: string
  year: number
  duration: string
  category: SelectOption
  status: "active" | "hidden"
  plays: number
  hasAudio: boolean
  hasLyrics: boolean
}

export interface Note {
  id: number
  title: string
  content: string
  category: string
  starred: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginLog {
  id: number
  user: string
  unit: string
  action: "login" | "logout"
  ip: string
  device: string
  time: string
  status: "success" | "failed"
}

export interface SystemLog {
  id: number
  action: string
  module: string
  description: string
  user: string
  time: string
  level: "info" | "warning" | "error"
}

export interface ActivityItem {
  id: string
  action: string
  target: string
  user: string
  timestamp: string
  type: "content" | "user" | "song" | "system" | "profile"
}

export type DashboardSummaryVariant = "default" | "primary" | "secondary" | "accent"

export type DashboardSummaryIconKey =
  | "posts"
  | "profiles"
  | "songs"
  | "accounts"
  | "views"
  | "edits"

export interface DashboardSummaryCard {
  id: string
  title: string
  value: number
  iconKey: DashboardSummaryIconKey
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: DashboardSummaryVariant
}

export interface DashboardSystemStatusItem {
  id: string
  label: string
  status: "active" | "warning" | "error"
  detail: string
}

export interface DashboardPendingItem {
  id: string
  title: string
  type: string
  author: string
  date: string
  status: "pending" | "review"
}

export type ReportsSummaryIconKey = "views" | "actions" | "users" | "avgTime"

export interface ReportsSummaryCard {
  id: string
  title: string
  value: string
  change: number
  period: string
  iconKey: ReportsSummaryIconKey
}

export type SettingsStatusIconKey = "server" | "database" | "storage" | "uptime"

export type SettingsStatusVariant = "success" | "accent" | "primary" | "default"

export interface SettingsStatusCard {
  id: string
  title: string
  value: string
  iconKey: SettingsStatusIconKey
  variant: SettingsStatusVariant
}

export interface MonthlyData {
  month: string
  views: number
  edits: number
  logins: number
}

export interface UserActivityData {
  name: string
  value: number
  activity: number
}

export interface TopContentData {
  title: string
  views: number
  trend: number
}

export interface ContentChartData {
  name: string
  value: number
}

export interface CategoryChartData {
  name: string
  value: number
  color: string
}

export interface AccessChartData {
  name: string
  value: number
}

export interface HomeModule {
  id: string
  name: string
  description: string
  icon: React.ElementType
  enabled: boolean
  order: number
  itemCount: number
}

export interface SelectOption {
  value: string
  label: string
}
