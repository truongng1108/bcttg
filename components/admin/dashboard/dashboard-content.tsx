"use client"

import { useEffect, useState } from "react"
import { FileText, Users, Music, FolderOpen, Eye, Edit3, Star } from "lucide-react"
import { StatsCard } from "./stats-card"
import { RecentActivity } from "./recent-activity"
import { ContentChart, CategoryChart, AccessChart } from "./quick-stats"
import { StatusItem } from "./components/status-item"
import { PendingRow } from "./components/pending-row"
import { DashboardService } from "@/lib/services/dashboard.service"
import { formatNumber } from "@/lib/utils/formatters"
import type {
  DashboardPendingItem,
  DashboardSummaryCard,
  DashboardSystemStatusItem,
} from "@/lib/data/types"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"

export function DashboardContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdatedAt, setLastUpdatedAt] = useState("")
  const [summaryCards, setSummaryCards] = useState<DashboardSummaryCard[]>([])
  const [systemStatusItems, setSystemStatusItems] = useState<DashboardSystemStatusItem[]>([])
  const [pendingItems, setPendingItems] = useState<DashboardPendingItem[]>([])
  useEffect(() => {
    setIsLoading(true)
    DashboardService.getOverview()
      .then((data) => {
        const now = new Date()
        setLastUpdatedAt(
          now.toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        )

        const cards: DashboardSummaryCard[] = [
          {
            id: "posts",
            title: "Tổng bài viết",
            value: data.summary.totalPosts,
            iconKey: "posts",
            variant: "default",
          },
          {
            id: "profiles",
            title: "Tổng hồ sơ",
            value: data.summary.totalProfiles,
            iconKey: "profiles",
            variant: "default",
          },
          {
            id: "songs",
            title: "Tổng ca khúc",
            value: data.summary.totalSongs,
            iconKey: "songs",
            variant: "default",
          },
          {
            id: "accounts",
            title: "Tổng tài khoản",
            value: data.summary.totalAccounts,
            iconKey: "accounts",
            variant: "default",
          },
          {
            id: "views",
            title: "Lượt xem hôm nay",
            value: data.summary.viewsToday,
            iconKey: "views",
            variant: "primary",
          },
          {
            id: "edits",
            title: "Chỉnh sửa hôm nay",
            value: data.summary.editsToday,
            iconKey: "edits",
            variant: "secondary",
          },
        ]
        setSummaryCards(cards)

        const statusItems: DashboardSystemStatusItem[] = data.systemStatuses.map((item) => {
          let status: "active" | "warning" | "error" = "active"
          if (item.status === "warning" || item.status === "error") {
            status = item.status
          } else if (item.status !== "active") {
            status = "warning"
          }
          return {
            id: item.id,
            label: item.label,
            status,
            detail: item.detail,
          }
        })
        setSystemStatusItems(statusItems)

        const pending: DashboardPendingItem[] = data.pendingItems.map((item) => {
          let status: "pending" | "review" = "pending"
          if (item.status === "review") {
            status = "review"
          }
          return {
            id: item.id,
            title: item.title,
            type: item.type,
            author: item.author,
            date: item.date,
            status,
          }
        })
        setPendingItems(pending)
      })
      .catch(() => {
        toast.error("Không tải được dữ liệu dashboard")
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const summaryIconMap = {
    posts: FileText,
    profiles: FolderOpen,
    songs: Music,
    accounts: Users,
    views: Eye,
    edits: Edit3,
  }

  if (isLoading) {
    return <AdminLoadingState />
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between rounded-md border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <Star className="h-5 w-5 text-accent" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Dashboard - Báo cáo & Thống kê
            </h1>
            <p className="text-sm text-muted-foreground">
              Tổng quan hoạt động hệ thống Sổ Tay Điện Tử Giáo Dục Truyền Thống
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Cập nhật lần cuối</p>
          <p className="text-sm font-semibold text-foreground">
            {lastUpdatedAt}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {summaryCards.map((card) => {
          const Icon = summaryIconMap[card.iconKey]
          return (
            <StatsCard
              key={card.id}
              title={card.title}
              value={formatNumber(card.value)}
              icon={Icon}
              trend={card.trend}
              description={card.description}
              variant={card.variant}
            />
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ContentChart />
        <CategoryChart />
        <AccessChart />
      </div>

      {/* Activity & Quick Access */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <RecentActivity />

        {/* System Status */}
        <div className="rounded-md border border-border bg-card shadow-sm">
          <div className="border-b border-border px-4 py-3">
            <h3 className="text-sm font-semibold text-foreground">
              Trạng thái hệ thống
            </h3>
          </div>
          <div className="divide-y divide-border">
            {systemStatusItems.map((item, index) => (
              <StatusItem
                key={`status-item-${String(item.id || index)}-${index}`}
                label={item.label}
                status={item.status}
                detail={item.detail}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Pending Items */}
      <div className="rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            Nội dung chờ duyệt
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                  Tiêu đề
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                  Loại
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                  Người tạo
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                  Ngày tạo
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase text-muted-foreground">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pendingItems.map((item, index) => (
                <PendingRow
                  key={`pending-item-${String(item.id || index)}-${index}`}
                  title={item.title}
                  type={item.type}
                  author={item.author}
                  date={item.date}
                  status={item.status}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

