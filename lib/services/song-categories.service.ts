import { ApiClient } from "@/lib/services/api-client"
import type {
  SongCategory,
  PaginationMeta,
  VisibilityRequest,
  ReorderRequest,
} from "@/lib/types/api"

export interface SongCategoryListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  is_visible?: boolean
}

export class SongCategoriesService {
  static async getAllPublic(
    params?: SongCategoryListParams
  ): Promise<{ data: SongCategory[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<SongCategory[]>(
      "/api/v1/public/song-categories",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch song categories")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdPublic(id: number): Promise<SongCategory> {
    const response = await ApiClient.get<SongCategory>(
      `/api/v1/public/song-categories/${id}`,
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch song category")
    }
    return response.data
  }

  static async getAllAdmin(
    params?: SongCategoryListParams
  ): Promise<{ data: SongCategory[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<SongCategory[]>(
      "/api/v1/admin/song-categories",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch song categories")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdAdmin(id: number): Promise<SongCategory> {
    const response = await ApiClient.get<SongCategory>(
      `/api/v1/admin/song-categories/${id}`,
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch song category")
    }
    return response.data
  }

  static async create(data: Partial<SongCategory>): Promise<SongCategory> {
    const response = await ApiClient.post<SongCategory>(
      "/api/v1/admin/song-categories",
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create song category")
    }
    return response.data
  }

  static async update(id: number, data: Partial<SongCategory>): Promise<SongCategory> {
    const response = await ApiClient.patch<SongCategory>(
      `/api/v1/admin/song-categories/${id}`,
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update song category")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/song-categories/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete song category")
    }
  }

  static async toggleVisibility(id: number, isVisible: boolean): Promise<SongCategory> {
    const request: VisibilityRequest = { isVisible }
    const response = await ApiClient.patch<SongCategory>(
      `/api/v1/admin/song-categories/${id}/visibility`,
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
      "/api/v1/admin/song-categories/reorder",
      data,
      true
    )
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to reorder song categories")
    }
  }
}

