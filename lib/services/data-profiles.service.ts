import { ApiClient } from "@/lib/services/api-client"
import type {
  DataProfile,
  PaginationMeta,
  VisibilityRequest,
  ReorderRequest,
} from "@/lib/types/api"

export interface DataProfileListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  profileType?: "THU_TRUONG" | "CHIEN_SI" | "ANH_HUNG"
  q?: string
  is_visible?: boolean
}

export class DataProfilesService {
  static async getAllPublic(
    params?: DataProfileListParams
  ): Promise<{ data: DataProfile[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<DataProfile[]>(
      "/api/v1/public/data-profiles",
      params as Record<string, string | number | boolean | null | undefined>,
      false
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch data profiles")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdPublic(id: number): Promise<DataProfile> {
    const response = await ApiClient.get<DataProfile>(
      `/api/v1/public/data-profiles/${id}`,
      undefined,
      false
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch data profile")
    }
    return response.data
  }

  static async getAllAdmin(
    params?: DataProfileListParams
  ): Promise<{ data: DataProfile[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<DataProfile[]>(
      "/api/v1/admin/data-profiles",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch data profiles")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdAdmin(id: number): Promise<DataProfile> {
    const response = await ApiClient.get<DataProfile>(
      `/api/v1/admin/data-profiles/${id}`,
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch data profile")
    }
    return response.data
  }

  static async create(data: Partial<DataProfile>): Promise<DataProfile> {
    const response = await ApiClient.post<DataProfile>(
      "/api/v1/admin/data-profiles",
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create data profile")
    }
    return response.data
  }

  static async update(id: number, data: Partial<DataProfile>): Promise<DataProfile> {
    const response = await ApiClient.put<DataProfile>(
      `/api/v1/admin/data-profiles/${id}`,
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update data profile")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/data-profiles/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete data profile")
    }
  }

  static async toggleVisibility(id: number, isVisible: boolean): Promise<DataProfile> {
    const request: VisibilityRequest = { isVisible }
    const response = await ApiClient.patch<DataProfile>(
      `/api/v1/admin/data-profiles/${id}/visibility`,
      request,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to toggle visibility")
    }
    return response.data
  }

  static async reorder(data: ReorderRequest): Promise<void> {
    const response = await ApiClient.patch<void>(
      "/api/v1/admin/data-profiles/reorder",
      data,
      true
    )
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to reorder data profiles")
    }
  }
}

