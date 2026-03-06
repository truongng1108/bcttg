import { ApiClient } from "@/lib/services/api-client"
import type { DashboardOverview } from "@/lib/types/api"

export class DashboardService {
  static async getOverview(): Promise<DashboardOverview> {
    const response = await ApiClient.get<DashboardOverview>(
      "/api/v1/admin/dashboard/overview",
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch dashboard overview")
    }
    return response.data
  }
}
