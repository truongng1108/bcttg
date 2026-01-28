import {
  dashboardLastUpdatedAt,
  dashboardPendingItems,
  dashboardSummaryCards,
  dashboardSystemStatusItems,
  mockActivities,
} from "@/lib/data/mock/dashboard"
import type {
  ActivityItem,
  DashboardPendingItem,
  DashboardSummaryCard,
  DashboardSystemStatusItem,
} from "@/lib/data/types"

export class DashboardService {
  static async getRecentActivities(): Promise<ActivityItem[]> {
    return mockActivities
  }

  static async getLastUpdatedAt(): Promise<string> {
    return dashboardLastUpdatedAt
  }

  static async getSummaryCards(): Promise<DashboardSummaryCard[]> {
    return dashboardSummaryCards
  }

  static async getSystemStatusItems(): Promise<DashboardSystemStatusItem[]> {
    return dashboardSystemStatusItems
  }

  static async getPendingItems(): Promise<DashboardPendingItem[]> {
    return dashboardPendingItems
  }
}
