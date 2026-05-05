import { CMS_ADMIN_CATEGORY_FETCH_PAGE_SIZE } from "@/lib/constants/cms-admin"
import { ApiClient } from "@/lib/services/api-client"
import type {
  ContentCategory,
  PaginationMeta,
  VisibilityRequest,
  ReorderRequest,
} from "@/lib/types/api"

export interface ContentCategoryListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  type?: string
  is_visible?: boolean
  parent_id?: number
}

type ContentCategoryListParamsWithoutPaging = Omit<
  ContentCategoryListParams,
  "page" | "page_size"
>

export class ContentCategoriesService {
  static async getAllPublic(
    params?: ContentCategoryListParams
  ): Promise<{ data: ContentCategory[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<ContentCategory[]>(
      "/api/v1/public/content-categories",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content categories")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getByIdPublic(id: number): Promise<ContentCategory> {
    const response = await ApiClient.get<ContentCategory>(
      `/api/v1/public/content-categories/${id}`,
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content category")
    }
    return response.data
  }

  static async getAllAdmin(
    params?: ContentCategoryListParams
  ): Promise<{ data: ContentCategory[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<ContentCategory[]>(
      "/api/v1/admin/content-categories",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content categories")
    }
    return { data: response.data, meta: response.meta }
  }

  /** Gộp toàn bộ trang (backend giới hạn page_size tối đa 100). */
  static async getAllAdminMerged(
    params?: ContentCategoryListParamsWithoutPaging
  ): Promise<ContentCategory[]> {
    const merged: ContentCategory[] = []
    const seen = new Set<number>()
    let page = 1
    const page_size = CMS_ADMIN_CATEGORY_FETCH_PAGE_SIZE
    while (true) {
      const { data, meta } = await this.getAllAdmin({ ...params, page, page_size })
      for (const category of data) {
        if (!seen.has(category.id)) {
          seen.add(category.id)
          merged.push(category)
        }
      }
      if (!data.length) break
      if (meta && page >= meta.total_pages) break
      if (!meta && data.length < page_size) break
      page += 1
    }
    return merged
  }

  static async getByIdAdmin(id: number): Promise<ContentCategory> {
    const response = await ApiClient.get<ContentCategory>(
      `/api/v1/admin/content-categories/${id}`,
      undefined,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch content category")
    }
    return response.data
  }

  static async create(data: Partial<ContentCategory>): Promise<ContentCategory> {
    const response = await ApiClient.post<ContentCategory>(
      "/api/v1/admin/content-categories",
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create content category")
    }
    return response.data
  }

  static async update(id: number, data: Partial<ContentCategory>): Promise<ContentCategory> {
    const response = await ApiClient.patch<ContentCategory>(
      `/api/v1/admin/content-categories/${id}`,
      data,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update content category")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/content-categories/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete content category")
    }
  }

  static async toggleVisibility(id: number, isVisible: boolean): Promise<ContentCategory> {
    const request: VisibilityRequest = { isVisible }
    const response = await ApiClient.patch<ContentCategory>(
      `/api/v1/admin/content-categories/${id}/visibility`,
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
      "/api/v1/admin/content-categories/reorder",
      data,
      true
    )
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to reorder content categories")
    }
  }
}

