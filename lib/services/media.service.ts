import { ApiClient } from "@/lib/services/api-client"
import type { MediaAsset } from "@/lib/types/api"

export class MediaService {
  static async upload(file: File): Promise<MediaAsset> {
    const response = await ApiClient.upload<MediaAsset>("/api/v1/admin/media", file, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to upload media")
    }
    return response.data
  }

  static async getById(id: number): Promise<MediaAsset> {
    const response = await ApiClient.get<MediaAsset>(`/api/v1/admin/media/${id}`, undefined, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch media")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/media/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete media")
    }
  }
}

