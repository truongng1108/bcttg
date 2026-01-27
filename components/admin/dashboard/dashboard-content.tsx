"use client"

import { FileText, Users, Music, FolderOpen, Eye, Edit3, Star } from "lucide-react"
import { StatsCard } from "./stats-card"
import { RecentActivity } from "./recent-activity"
import { ContentChart, CategoryChart, AccessChart } from "./quick-stats"
import { LotusDivider } from "../decorations/lotus-decoration"

export function DashboardContent() {
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
            27/01/2026 - 14:30
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Tổng bài viết"
          value="156"
          icon={FileText}
          trend={{ value: 12, isPositive: true }}
          description="so với tháng trước"
          variant="primary"
        />
        <StatsCard
          title="Hồ sơ dữ liệu"
          value="89"
          icon={FolderOpen}
          trend={{ value: 8, isPositive: true }}
          description="so với tháng trước"
          variant="secondary"
        />
        <StatsCard
          title="Ca khúc"
          value="24"
          icon={Music}
          description="trong thư viện"
          variant="accent"
        />
        <StatsCard
          title="Tài khoản"
          value="42"
          icon={Users}
          trend={{ value: 5, isPositive: true }}
          description="đang hoạt động"
        />
        <StatsCard
          title="Lượt xem hôm nay"
          value="1,247"
          icon={Eye}
          trend={{ value: 23, isPositive: true }}
          description="so với hôm qua"
        />
        <StatsCard
          title="Chỉnh sửa hôm nay"
          value="18"
          icon={Edit3}
          description="thao tác"
        />
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
            <StatusItem
              label="Cơ sở dữ liệu"
              status="active"
              detail="Hoạt động ổn định"
            />
            <StatusItem
              label="Bộ nhớ đệm"
              status="active"
              detail="85% dung lượng"
            />
            <StatusItem
              label="Sao lưu tự động"
              status="active"
              detail="Lần cuối: 27/01/2026 06:00"
            />
            <StatusItem
              label="Bảo mật"
              status="active"
              detail="Đã bật xác thực 2 lớp"
            />
            <StatusItem
              label="SSL/TLS"
              status="active"
              detail="Chứng chỉ còn 89 ngày"
            />
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
              <PendingRow
                title="Trận đánh Đường 9 - Nam Lào"
                type="Truyền thống"
                author="Thượng úy Lê Văn C"
                date="26/01/2026"
                status="pending"
              />
              <PendingRow
                title="Hồ sơ Thiếu tướng Nguyễn Văn E"
                type="Hồ sơ"
                author="Đại úy Trần Văn F"
                date="25/01/2026"
                status="pending"
              />
              <PendingRow
                title="Ca khúc kỷ niệm 60 năm"
                type="Ca khúc"
                author="Trung úy Phạm Văn G"
                date="24/01/2026"
                status="review"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatusItem({
  label,
  status,
  detail,
}: {
  label: string
  status: "active" | "warning" | "error"
  detail: string
}) {
  const statusColors = {
    active: "bg-[#2E7D32]",
    warning: "bg-[#F57C00]",
    error: "bg-destructive",
  }

  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${statusColors[status]}`} />
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{detail}</span>
    </div>
  )
}

function PendingRow({
  title,
  type,
  author,
  date,
  status,
}: {
  title: string
  type: string
  author: string
  date: string
  status: "pending" | "review"
}) {
  const statusLabels = {
    pending: { label: "Chờ duyệt", className: "bg-[#F57C00]/10 text-[#F57C00]" },
    review: { label: "Đang xem xét", className: "bg-info/10 text-info" },
  }

  const s = statusLabels[status]

  return (
    <tr className="transition-colors hover:bg-muted/30">
      <td className="px-4 py-3 text-sm font-medium text-foreground">{title}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{type}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{author}</td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{date}</td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex rounded px-2 py-0.5 text-xs font-medium ${s.className}`}
        >
          {s.label}
        </span>
      </td>
    </tr>
  )
}
