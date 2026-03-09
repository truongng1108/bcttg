import { ApiClient } from "@/lib/services/api-client"
import type { HomeModuleApi, HomeModulesPatchRequest } from "@/lib/types/api"
import type { HomeModule } from "@/lib/data/types"
import { HOME_MODULE_ICONS } from "@/lib/constants/home-module-icons"
import { FileText } from "lucide-react"

function apiToDisplay(api: HomeModuleApi): HomeModule {
  const icon = HOME_MODULE_ICONS[api.id] ?? FileText
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    icon,
    enabled: api.enabled,
    order: api.sortOrder,
    itemCount: api.itemCount,
  }
}

export class HomeModulesService {
  static async getPublicModules(): Promise<HomeModule[]> {
    const response = await ApiClient.get<HomeModuleApi[]>(
      "/api/v1/public/home-modules",
      undefined,
      true
    )
    if (response.success && response.data) {
      return response.data.map(apiToDisplay)
    }
    throw new Error(response.error?.message ?? "Failed to fetch public home modules")
  }

  static async getAll(): Promise<HomeModule[]> {
    const response = await ApiClient.get<HomeModuleApi[]>(
      "/api/v1/admin/home-modules",
      undefined,
      true
    )
    if (response.success && response.data) {
      return response.data.map(apiToDisplay)
    }
    throw new Error(response.error?.message ?? "Failed to fetch home modules")
  }

  static async saveAll(modules: readonly HomeModule[]): Promise<HomeModule[]> {
    const ordered = [...modules].sort((a, b) => a.order - b.order)
    const payload: HomeModulesPatchRequest = {
      modules: ordered.map((m) => ({
        id: m.id,
        name: m.name,
        description: m.description,
        enabled: m.enabled,
        sortOrder: m.order,
      })),
    }
    const response = await ApiClient.patch<HomeModuleApi[]>(
      "/api/v1/admin/home-modules",
      payload,
      true
    )
    if (response.success && response.data) {
      return response.data.map(apiToDisplay)
    }
    throw new Error(response.error?.message ?? "Failed to save home modules")
  }
}
