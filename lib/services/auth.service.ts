import { ApiClient } from "@/lib/services/api-client"
import type { AuthLoginRequest, AuthLoginResponse } from "@/lib/types/api"

export class AuthService {
  static async login(phone: string, password: string): Promise<AuthLoginResponse> {
    const request: AuthLoginRequest = { phone, password }
    const response = await ApiClient.post<AuthLoginResponse>("/api/v1/auth/login", request, false)
    if (response.success && response.data) {
      ApiClient.setToken(response.data.accessToken)
      return response.data
    }
    throw new Error(response.error?.message || "Login failed")
  }

  static logout(): void {
    ApiClient.clearToken()
  }

  static isAuthenticated(): boolean {
    return ApiClient.getToken() !== null
  }

  static getToken(): string | null {
    return ApiClient.getToken()
  }
}

