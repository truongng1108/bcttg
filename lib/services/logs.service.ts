import { ApiClient } from "@/lib/services/api-client"
import type { LoginLog, SystemLog } from "@/lib/data/types"
import type {
  LogsPeriod,
  LoginLogApiItem,
  LogsSummaryResponse,
  PaginationMeta,
  SystemLogApiItem,
} from "@/lib/types/api"
import { formatDateDetail } from "@/lib/utils/date"

type LogStatus = "success" | "failed"
type LogAction = "login" | "logout"
type SortOrder = "asc" | "desc"
type SystemLogLevel = "info" | "warning" | "error"
type ExportFormat = "xlsx" | "csv"
type ApiLogStatus = "SUCCESS" | "FAILED"
type ApiLogAction = "LOGIN" | "LOGOUT"
type ApiSystemLogLevel = "INFO" | "WARNING" | "ERROR"

export interface LoginLogsQuery {
  page?: number
  page_size?: number
  q?: string
  status?: LogStatus
  action?: LogAction
  period?: LogsPeriod
  from?: string
  to?: string
  sort?: string
  order?: SortOrder
}

export interface SystemLogsQuery {
  page?: number
  page_size?: number
  q?: string
  level?: SystemLogLevel
  module?: string
  action?: string
  period?: LogsPeriod
  from?: string
  to?: string
  sort?: string
  order?: SortOrder
}

export interface LogsExportQuery {
  type: "login" | "system"
  format?: ExportFormat
  q?: string
  status?: LogStatus
  action?: string
  level?: SystemLogLevel
  module?: string
  period?: LogsPeriod
  from?: string
  to?: string
  sort?: string
  order?: SortOrder
}

export interface PagedLogsResult<T> {
  items: T[]
  meta: PaginationMeta
}

function normalizeAction(value: string): LogAction {
  return value.toLowerCase() === "logout" ? "logout" : "login"
}

function normalizeStatus(value: string): LogStatus {
  return value.toLowerCase() === "success" ? "success" : "failed"
}

function normalizeLevel(value: string): SystemLogLevel {
  const level = value.toLowerCase()
  if (level === "warning") return "warning"
  if (level === "error") return "error"
  return "info"
}

function resolveMeta(
  meta: PaginationMeta | null,
  fallbackPage: number,
  fallbackPageSize: number,
  itemCount: number
): PaginationMeta {
  if (meta) {
    return {
      page: meta.page > 0 ? meta.page : fallbackPage,
      page_size: meta.page_size > 0 ? meta.page_size : fallbackPageSize,
      total_elements: meta.total_elements >= 0 ? meta.total_elements : itemCount,
      total_pages: meta.total_pages > 0 ? meta.total_pages : 1,
    }
  }
  return {
    page: fallbackPage,
    page_size: fallbackPageSize,
    total_elements: itemCount,
    total_pages: 1,
  }
}

function mapLoginLog(item: LoginLogApiItem): LoginLog {
  return {
    id: item.id,
    user: item.userName,
    unit: item.unitName,
    action: normalizeAction(item.action),
    ip: item.ipAddress,
    device: item.device,
    time: formatDateDetail(item.createdAt),
    status: normalizeStatus(item.status),
  }
}

function mapSystemLog(item: SystemLogApiItem): SystemLog {
  return {
    id: item.id,
    action: item.action.toLowerCase(),
    module: item.module,
    description: item.description,
    user: item.actorName,
    time: formatDateDetail(item.createdAt),
    level: normalizeLevel(item.level),
  }
}

function mapSummary(data: LogsSummaryResponse): LogsSummaryResponse {
  return {
    totalLogins: data.totalLogins ?? ((data.successfulLogins ?? 0) + (data.failedLogins ?? 0)),
    successfulLogins: data.successfulLogins ?? 0,
    failedLogins: data.failedLogins ?? 0,
    systemActions: data.systemActions ?? data.totalActions ?? 0,
    totalActions: data.totalActions ?? data.systemActions ?? 0,
    errorCount: data.errorCount,
  }
}

function toApiStatus(status: LogStatus | undefined): ApiLogStatus | undefined {
  if (!status) return undefined
  return status === "success" ? "SUCCESS" : "FAILED"
}

function toApiAction(action: LogAction | undefined): ApiLogAction | undefined {
  if (!action) return undefined
  return action === "login" ? "LOGIN" : "LOGOUT"
}

function toApiLevel(level: SystemLogLevel | undefined): ApiSystemLogLevel | undefined {
  if (!level) return undefined
  if (level === "info") return "INFO"
  if (level === "warning") return "WARNING"
  return "ERROR"
}

function toApiLoginQuery(query: LoginLogsQuery) {
  return {
    page: query.page,
    page_size: query.page_size,
    q: query.q,
    status: toApiStatus(query.status),
    action: toApiAction(query.action),
    period: query.period,
    from: query.from,
    to: query.to,
  }
}

function toApiSystemQuery(query: SystemLogsQuery) {
  return {
    page: query.page,
    page_size: query.page_size,
    q: query.q,
    level: toApiLevel(query.level),
    module: query.module,
    action: query.action,
    period: query.period,
    from: query.from,
    to: query.to,
  }
}

function toApiExportQuery(query: LogsExportQuery) {
  return {
    type: query.type,
    format: query.format,
    q: query.q,
    status: toApiStatus(query.status),
    action: query.action,
    level: toApiLevel(query.level),
    module: query.module,
    period: query.period,
    from: query.from,
    to: query.to,
  }
}

export class LogsService {
  static async getLoginLogs(query: LoginLogsQuery): Promise<PagedLogsResult<LoginLog>> {
    const response = await ApiClient.get<LoginLogApiItem[]>(
      "/api/v1/admin/logs/login",
      toApiLoginQuery(query),
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? "Không tải được nhật ký đăng nhập")
    }
    const items = response.data.map(mapLoginLog)
    const meta = resolveMeta(response.meta, query.page ?? 1, query.page_size ?? 10, items.length)
    return { items, meta }
  }

  static async getSystemLogs(query: SystemLogsQuery): Promise<PagedLogsResult<SystemLog>> {
    const response = await ApiClient.get<SystemLogApiItem[]>(
      "/api/v1/admin/logs/system",
      toApiSystemQuery(query),
      true
    )
    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? "Không tải được nhật ký hệ thống")
    }
    const items = response.data.map(mapSystemLog)
    const meta = resolveMeta(response.meta, query.page ?? 1, query.page_size ?? 10, items.length)
    return { items, meta }
  }

  static async getSummary(): Promise<LogsSummaryResponse> {
    const response = await ApiClient.get<LogsSummaryResponse>("/api/v1/admin/logs/summary", undefined, true)
    if (!response.success || !response.data) {
      throw new Error(response.error?.message ?? "Không tải được tổng quan nhật ký")
    }
    return mapSummary(response.data)
  }

  static async exportLogs(query: LogsExportQuery): Promise<{ blob: Blob; filename: string | null }> {
    return ApiClient.download("/api/v1/admin/logs/export", toApiExportQuery(query), true)
  }
}
