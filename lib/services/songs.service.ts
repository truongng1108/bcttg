import { ApiClient } from "@/lib/services/api-client"
import type { Song, PaginationMeta, VisibilityRequest, ReorderRequest } from "@/lib/types/api"

export interface SongListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  q?: string
  is_visible?: boolean
  category_id?: number
}

export class SongsService {
  static async getAllPublic(
    params?: SongListParams
  ): Promise<{ data: Song[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<Song[]>(
      "/api/v1/public/songs",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch songs")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdPublic(id: number): Promise<Song> {
    const response = await ApiClient.get<Song>(`/api/v1/public/songs/${id}`, undefined, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch song")
    }
    return response.data
  }

  static async getAllAdmin(
    params?: SongListParams
  ): Promise<{ data: Song[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<Song[]>(
      "/api/v1/admin/songs",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch songs")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdAdmin(id: number): Promise<Song> {
    const response = await ApiClient.get<Song>(`/api/v1/admin/songs/${id}`, undefined, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch song")
    }
    return response.data
  }

  static async create(data: Partial<Song>): Promise<Song> {
    const response = await ApiClient.post<Song>("/api/v1/admin/songs", data, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create song")
    }
    return response.data
  }

  static async update(id: number, data: Partial<Song>): Promise<Song> {
    const response = await ApiClient.patch<Song>(`/api/v1/admin/songs/${id}`, data, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update song")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/songs/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete song")
    }
  }

  static async toggleVisibility(id: number, isVisible: boolean): Promise<Song> {
    const request: VisibilityRequest = { isVisible }
    const response = await ApiClient.patch<Song>(
      `/api/v1/admin/songs/${id}/visibility`,
      request,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to toggle visibility")
    }
    return response.data
  }

  static async reorder(data: ReorderRequest): Promise<void> {
    const response = await ApiClient.patch<void>("/api/v1/admin/songs/reorder", data, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to reorder songs")
    }
  }
}
