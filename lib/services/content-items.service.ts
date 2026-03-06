import { ApiClient } from "@/lib/services/api-client"
import type {
  ContentItem,
  PaginationMeta,
  VisibilityRequest,
  ReorderRequest,
  MediaAsset,
} from "@/lib/types/api"

export interface ContentItemListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  q?: string
  is_visible?: boolean
  category_id?: number
  type?: string
}

export class ContentItemsService {
  static async getAllPublic(
    params?: ContentItemListParams
  ): Promise<{ data: ContentItem[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<ContentItem[]>(
      "/api/v1/public/content-items",
      params as Record<string, string | number | boolean | null | undefined>,
      false
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content items")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdPublic(id: number): Promise<ContentItem> {
    const response = await ApiClient.get<ContentItem>(
      `/api/v1/public/content-items/${id}`,
      undefined,
      false
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content item")
    }
    return response.data
  }

  static async getAllAdmin(
    params?: ContentItemListParams
  ): Promise<{ data: ContentItem[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<ContentItem[]>(
      "/api/v1/admin/content-items",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content items")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdAdmin(id: number): Promise<ContentItem> {
    const response = await ApiClient.get<ContentItem>(
      `/api/v1/admin/content-items/${id}`,
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content item")
    }
    return response.data
  }

  static async create(data: Partial<ContentItem>): Promise<ContentItem> {
    const response = await ApiClient.post<ContentItem>(
      "/api/v1/admin/content-items",
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create content item")
    }
    return response.data
  }

  static async update(id: number, data: Partial<ContentItem>): Promise<ContentItem> {
    const response = await ApiClient.put<ContentItem>(
      `/api/v1/admin/content-items/${id}`,
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update content item")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/content-items/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete content item")
    }
  }

  static async toggleVisibility(id: number, isVisible: boolean): Promise<ContentItem> {
    const request: VisibilityRequest = { isVisible }
    const response = await ApiClient.patch<ContentItem>(
      `/api/v1/admin/content-items/${id}/visibility`,
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
      "/api/v1/admin/content-items/reorder",
      data,
      true
    )
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to reorder content items")
    }
  }

  static async uploadMedia(id: number, file: File): Promise<MediaAsset> {
    const response = await ApiClient.upload<MediaAsset>(
      `/api/v1/admin/content-items/${id}/media`,
      file,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to upload media")
    }
    return response.data
  }
}

