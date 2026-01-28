export class ApiClient {
  private static readonly baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api"

  static isRecord(value: object): value is Record<string, string> {
    return Object.prototype.toString.call(value) === "[object Object]"
  }

  static toJsonBody(value: object): string {
    if (this.isRecord(value)) {
      return JSON.stringify(value)
    }
    return JSON.stringify(value)
  }

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  static async post<T>(endpoint: string, data: object): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: this.toJsonBody(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  static async put<T>(endpoint: string, data: object): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: this.toJsonBody(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  static async delete(endpoint: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "DELETE",
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
  }
}
