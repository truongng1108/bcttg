import { ApiClient } from "@/lib/services/api-client"
import type { MonthlyData, ReportsSummaryCard, TopContentData, UserActivityData } from "@/lib/data/types"
import type {
  ReportsOverviewResponse,
  ReportsPeriod,
  ReportsSummaryCardItem,
  ReportsTopContentItem,
  ReportsTrendSeriesItem,
  ReportsUserActivityItem,
} from "@/lib/types/api"

export interface ReportsOverviewData {
  monthlyData: MonthlyData[]
  userActivityData: UserActivityData[]
  topContentData: TopContentData[]
  summaryCards: ReportsSummaryCard[]
}

type ReportsExportType = "overview" | "trend" | "user-activity" | "top-content"
type ReportsUiExportType =
  | "tong-hop"
  | "nguoi-dung"
  | "noi-dung"
  | "noi-dung-chi-tiet"
  | "nhat-ky"
  | "luot-xem"
  | "hoat-dong"
  | "dang-nhap"

function mapExportType(type: ReportsUiExportType): ReportsExportType {
  if (type === "luot-xem" || type === "dang-nhap") return "trend"
  if (type === "hoat-dong" || type === "nguoi-dung") return "user-activity"
  if (type === "noi-dung" || type === "noi-dung-chi-tiet") return "top-content"
  return "overview"
}

function toSummaryCard(item: ReportsSummaryCardItem): ReportsSummaryCard {
  const value =
    typeof item.value === "number" ? item.value.toLocaleString("vi-VN") : String(item.value)
  return {
    id: item.id,
    title: item.title,
    value,
    change: item.change,
    period: item.period,
    iconKey: item.iconKey,
  }
}

function toMonthlyData(item: ReportsTrendSeriesItem): MonthlyData {
  return {
    label: item.label,
    views: item.views,
    edits: item.edits,
    logins: item.logins,
  }
}

function toUserActivityData(item: ReportsUserActivityItem): UserActivityData {
  return {
    name: item.name,
    value: item.value,
    activity: item.activity,
  }
}

function toTopContentData(item: ReportsTopContentItem): TopContentData {
  return {
    title: item.title,
    views: item.views,
    trend: item.trend,
  }
}

export class ReportsService {
  static async getOverview(period: ReportsPeriod): Promise<ReportsOverviewData> {
    const response = await ApiClient.get<ReportsOverviewResponse>(
      "/api/v1/admin/reports/overview",
      { period },
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? "Không tải được dữ liệu báo cáo")
    }
    return {
      monthlyData: response.data.trendSeries.map(toMonthlyData),
      userActivityData: response.data.userActivity.map(toUserActivityData),
      topContentData: response.data.topContent.map(toTopContentData),
      summaryCards: response.data.summaryCards.map(toSummaryCard),
    }
  }

  static async exportReport(
    type: ReportsUiExportType,
    period: ReportsPeriod,
    format: "xlsx" | "csv" = "xlsx"
  ): Promise<{ blob: Blob; filename: string | null }> {
    const mappedType = mapExportType(type)
    return ApiClient.download(
      "/api/v1/admin/reports/export",
      { type: mappedType, period, format },
      true
    )
  }
}
