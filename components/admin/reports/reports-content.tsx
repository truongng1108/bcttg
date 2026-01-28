"use client"

import { useState, useEffect } from "react"
import { FileSpreadsheet, Calendar, TrendingUp, TrendingDown, Users, FileText, Eye, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

import type { MonthlyData, UserActivityData, TopContentData, ReportsSummaryCard } from "@/lib/data/types"
import { ReportsService } from "@/lib/services/reports.service"
import { SummaryCard } from "./components/summary-card"
import { ExportOption } from "./components/export-option"
import { ChartContainer } from "./components/chart-container"
import { TIME_PERIODS } from "./constants/time-periods"
import { EXPORT_TYPES } from "./constants/export-types"
import { handleExportExcel } from "./utils/export-handlers"

export function ReportsContent() {
  const [timePeriod, setTimePeriod] = useState("year")
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [userActivityData, setUserActivityData] = useState<UserActivityData[]>([])
  const [topContentData, setTopContentData] = useState<TopContentData[]>([])
  const [summaryCards, setSummaryCards] = useState<ReportsSummaryCard[]>([])

  useEffect(() => {
    Promise.all([
      ReportsService.getMonthlyData(),
      ReportsService.getUserActivityData(),
      ReportsService.getTopContentData(),
      ReportsService.getSummaryCards(),
    ]).then(([monthly, userActivity, topContent, summary]) => {
      setMonthlyData(monthly)
      setUserActivityData(userActivity)
      setTopContentData(topContent)
      setSummaryCards(summary)
    })
  }, [])

  const summaryIconMap = {
    views: Eye,
    actions: FileText,
    users: Users,
    avgTime: Clock,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Báo cáo & Thống kê
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Thống kê hoạt động và báo cáo tổng hợp hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIME_PERIODS.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            onClick={() => handleExportExcel(EXPORT_TYPES.TONG_HOP)}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Xuất báo cáo Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = summaryIconMap[card.iconKey]
          return (
            <SummaryCard
              key={card.id}
              title={card.title}
              value={card.value}
              change={card.change}
              icon={Icon}
              period={card.period}
            />
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartContainer
          title="Lượt xem theo tháng"
          onExport={() => handleExportExcel(EXPORT_TYPES.LUOT_XEM)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5D0C4" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D0C4",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#C62828"
                fill="#C62828"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Hoạt động theo vai trò"
          onExport={() => handleExportExcel(EXPORT_TYPES.HOAT_DONG)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userActivityData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#D5D0C4" />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
                width={100}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D0C4",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="activity" fill="#2E4A32" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Lượt đăng nhập theo tháng"
          onExport={() => handleExportExcel(EXPORT_TYPES.DANG_NHAP)}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5D0C4" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D0C4",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="logins"
                stroke="#C9A227"
                strokeWidth={2}
                dot={{ fill: "#C9A227", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>

        <ChartContainer
          title="Nội dung được xem nhiều nhất"
          onExport={() => handleExportExcel(EXPORT_TYPES.NOI_DUNG)}
        >
          <div className="divide-y divide-border">
            {topContentData.map((item, index) => (
              <div
                key={item.title}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-medium text-muted-foreground">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {item.views.toLocaleString()} lượt
                  </span>
                  <span
                    className={`flex items-center gap-1 text-xs font-medium ${
                      item.trend >= 0 ? "text-[#2E7D32]" : "text-destructive"
                    }`}
                  >
                    {item.trend >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {Math.abs(item.trend)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartContainer>
      </div>

      <div className="rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            Xuất báo cáo tùy chọn
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <ExportOption
            title="Báo cáo tổng hợp"
            description="Tất cả dữ liệu thống kê"
            onClick={() => handleExportExcel(EXPORT_TYPES.TONG_HOP)}
          />
          <ExportOption
            title="Báo cáo người dùng"
            description="Danh sách và hoạt động"
            onClick={() => handleExportExcel(EXPORT_TYPES.NGUOI_DUNG)}
          />
          <ExportOption
            title="Báo cáo nội dung"
            description="Bài viết và lượt xem"
            onClick={() => handleExportExcel(EXPORT_TYPES.NOI_DUNG_CHI_TIET)}
          />
          <ExportOption
            title="Nhật ký hệ thống"
            description="Log đăng nhập và thao tác"
            onClick={() => handleExportExcel(EXPORT_TYPES.NHAT_KY)}
          />
        </div>
      </div>
    </div>
  )
}
