import { monthlyData, reportsSummaryCards, topContentData, userActivityData } from "@/lib/data/mock/reports"
import type { MonthlyData, ReportsSummaryCard, TopContentData, UserActivityData } from "@/lib/data/types"

export class ReportsService {
  static async getMonthlyData(): Promise<MonthlyData[]> {
    return monthlyData
  }

  static async getUserActivityData(): Promise<UserActivityData[]> {
    return userActivityData
  }

  static async getTopContentData(): Promise<TopContentData[]> {
    return topContentData
  }

  static async getSummaryCards(): Promise<ReportsSummaryCard[]> {
    return reportsSummaryCards
  }
}
