import type { ApiResponse, ApiError } from "@/lib/types/api"

export class ApiClient {
  private static readonly baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech/"

  static getToken(): string | null {
    if (globalThis.window === undefined) return null
    return globalThis.window.localStorage.getItem("auth_token") ||
      globalThis.window.sessionStorage.getItem("auth_token")
  }

  static setToken(token: string): void {
    if (globalThis.window === undefined) return
    globalThis.window.localStorage.setItem("auth_token", token)
  }

  static clearToken(): void {
    if (globalThis.window === undefined) return
    globalThis.window.localStorage.removeItem("auth_token")
    globalThis.window.sessionStorage.removeItem("auth_token")
  }

  static buildQueryString(params: Record<string, string | number | boolean | null | undefined>): string {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    return queryString ? `?${queryString}` : ""
  }

  private static getHeaders(includeAuth = true, contentType = "application/json"): HeadersInit {
    const headers: HeadersInit = {}
    if (contentType) {
      headers["Content-Type"] = contentType
    }
    if (includeAuth) {
      const token = this.getToken()
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }
    return headers
  }

  private static handleUnauthorized(): void {
    this.clearToken()
    if (globalThis.window === undefined) return
    if (globalThis.window.location.pathname === "/dang-nhap") return
    globalThis.window.location.assign("/dang-nhap")
  }

  private static async handleResponse<T>(
    response: Response,
    requireAuth: boolean
  ): Promise<ApiResponse<T>> {
    if (response.status === 401 && requireAuth) {
      this.handleUnauthorized()
      throw new Error("Unauthorized")
    }
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error: ApiError = data.error || {
        code: `HTTP_${response.status}`,
        message: response.statusText || "An error occurred",
        details: [],
      }
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }
    return data as ApiResponse<T>
  }

  static async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | null | undefined>,
    requireAuth = false
  ): Promise<ApiResponse<T>> {
    const queryString = params ? this.buildQueryString(params) : ""
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}${queryString}`
    const response = await fetch(url, {
      method: "GET",
      headers: this.getHeaders(requireAuth),
    })
    return this.handleResponse<T>(response, requireAuth)
  }

  static async post<T>(
    endpoint: string,
    data: object,
    requireAuth = false
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}`
    const response = await fetch(url, {
      method: "POST",
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response, requireAuth)
  }

  static async put<T>(
    endpoint: string,
    data: object,
    requireAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}`
    const response = await fetch(url, {
      method: "PUT",
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response, requireAuth)
  }

  static async patch<T>(
    endpoint: string,
    data: object,
    requireAuth = true
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}`
    const response = await fetch(url, {
      method: "PATCH",
      headers: this.getHeaders(requireAuth),
      body: JSON.stringify(data),
    })
    return this.handleResponse<T>(response, requireAuth)
  }

  static async delete(endpoint: string, requireAuth = true): Promise<ApiResponse<void>> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}`
    const response = await fetch(url, {
      method: "DELETE",
      headers: this.getHeaders(requireAuth),
    })
    return this.handleResponse<void>(response, requireAuth)
  }

  static async upload<T>(endpoint: string, file: File, requireAuth = true): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl.replace(/\/$/, "")}${endpoint}`
    const formData = new FormData()
    formData.append("file", file)
    const token = this.getToken()
    const headers: HeadersInit = {}
    if (requireAuth && token) {
      headers["Authorization"] = `Bearer ${token}`
    }
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    })
    return this.handleResponse<T>(response, requireAuth)
  }
}
