import { ApiClient } from "@/lib/services/api-client"
import type {
  UserAccount,
  PaginationMeta,
  ActiveRequest,
  RoleRequest,
  ResetPasswordRequest,
  UserCreateRequest,
  UserUpdateRequest,
} from "@/lib/types/api"

export interface UserListParams {
  page?: number
  page_size?: number
  sort?: string
  order?: "asc" | "desc"
  q?: string
  role?: "ADMIN" | "MANAGER" | "USER"
  is_active?: boolean
}

export class AccountsService {
  static async getAll(
    params?: UserListParams
  ): Promise<{ data: UserAccount[]; meta: PaginationMeta | null }> {
    const response = await ApiClient.get<UserAccount[]>(
      "/api/v1/admin/users",
      params as Record<string, string | number | boolean | null | undefined>,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch users")
    }
    return { data: response.data, meta: response.meta }
  }

  static async getById(id: number): Promise<UserAccount> {
    const response = await ApiClient.get<UserAccount>(`/api/v1/admin/users/${id}`, undefined, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to fetch user")
    }
    return response.data
  }

  static async create(data: UserCreateRequest): Promise<UserAccount> {
    const response = await ApiClient.post<UserAccount>("/api/v1/admin/users", data, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to create user")
    }
    return response.data
  }

  static async update(id: number, data: UserUpdateRequest): Promise<UserAccount> {
    const response = await ApiClient.put<UserAccount>(`/api/v1/admin/users/${id}`, data, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to update user")
    }
    return response.data
  }

  static async delete(id: number): Promise<void> {
    const response = await ApiClient.delete(`/api/v1/admin/users/${id}`, true)
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to delete user")
    }
  }

  static async toggleActive(id: number, value: boolean): Promise<UserAccount> {
    const request: ActiveRequest = { value }
    const response = await ApiClient.patch<UserAccount>(
      `/api/v1/admin/users/${id}/active`,
      request,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to toggle active status")
    }
    return response.data
  }

  static async changeRole(
    id: number,
    role: "ADMIN" | "MANAGER" | "USER"
  ): Promise<UserAccount> {
    const request: RoleRequest = { role }
    const response = await ApiClient.patch<UserAccount>(
      `/api/v1/admin/users/${id}/role`,
      request,
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message || "Failed to change role")
    }
    return response.data
  }

  static async resetPassword(id: number, newPassword: string): Promise<void> {
    const request: ResetPasswordRequest = { newPassword }
    const response = await ApiClient.patch<void>(
      `/api/v1/admin/users/${id}/reset-password`,
      request,
      true
    )
    if (!response.success) {
      throw new Error(response.error?.message || "Failed to reset password")
    }
  }
}
