import { ApiClient } from "@/lib/services/api-client"
import type { PersonalNote, PaginationMeta, PinRequest, ArchiveRequest } from "@/lib/types/api"

export interface NoteListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  q?: string
  is_archived?: boolean
}

export class NotesService {
  static async getAll(
    params?: NoteListParams
  ): Promise<{ data: PersonalNote[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<PersonalNote[]>(
      "/api/v1/notes",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch notes")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getById(id: number): Promise<PersonalNote> {
    const response = await ApiClient.get<PersonalNote>(`/api/v1/notes/${id}`, undefined, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch note")
    }
    return response.data
  }

  static async create(data: Partial<PersonalNote>): Promise<PersonalNote> {
    const response = await ApiClient.post<PersonalNote>("/api/v1/notes", data, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create note")
    }
    return response.data
  }

  static async update(id: number, data: Partial<PersonalNote>): Promise<PersonalNote> {
    const response = await ApiClient.put<PersonalNote>(`/api/v1/notes/${id}`, data, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update note")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/notes/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete note")
    }
  }

  static async pin(id: number, value: boolean): Promise<PersonalNote> {
    const request: PinRequest = { value }
    const response = await ApiClient.patch<PersonalNote>(`/api/v1/notes/${id}/pin`, request, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to pin/unpin note")
    }
    return response.data
  }

  static async archive(id: number, value: boolean): Promise<PersonalNote> {
    const request: ArchiveRequest = { value }
    const response = await ApiClient.patch<PersonalNote>(
      `/api/v1/notes/${id}/archive`,
      request,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to archive/unarchive note")
    }
    return response.data
  }
}
