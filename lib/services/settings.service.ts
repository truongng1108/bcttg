"use client"

import { ApiClient } from "@/lib/services/api-client"
import type { SettingsFormData } from "@/lib/schemas/settings.schema"
import type { SettingsStatusCard, SettingsStatusIconKey, SettingsStatusVariant } from "@/lib/data/types"
import type { SettingsStatusItem, SettingsVersionResponse } from "@/lib/types/api"

type StatusIconKeyMap = Record<string, SettingsStatusIconKey>
type StatusVariantMap = Record<string, SettingsStatusVariant>

const STATUS_ID_TO_ICON: StatusIconKeyMap = {
  server: "server",
  database: "database",
  db: "database",
  storage: "storage",
  uptime: "uptime",
}

const STATUS_TO_VARIANT: StatusVariantMap = {
  active: "success",
  ok: "success",
  success: "success",
  warning: "accent",
  error: "primary",
  failed: "primary",
  default: "default",
}

function mapStatusToCard(item: SettingsStatusItem): SettingsStatusCard {
  const iconKey = STATUS_ID_TO_ICON[item.id] ?? "server"
  const statusKey = item.status?.toLowerCase() ?? ""
  const variant = STATUS_TO_VARIANT[statusKey] ?? "default"
  return {
    id: item.id,
    title: item.label,
    value: item.detail ? item.detail : item.status,
    iconKey,
    variant,
  }
}

type RawSettingValue = string | number | boolean | undefined
type SettingsRaw = Record<string, string | number | boolean>

function rawToFormData(raw: SettingsRaw): SettingsFormData {
  const str = (v: RawSettingValue, d: string) =>
    (v === null || v === undefined) ? d : String(v)
  const bool = (v: RawSettingValue, d: boolean) =>
    (v === null || v === undefined) ? d : Boolean(v)
  return {
    systemName: str(raw.systemName, ""),
    systemDescription: str(raw.systemDescription, ""),
    timezone: str(raw.timezone, "Asia/Ho_Chi_Minh"),
    language: str(raw.language, "vi"),
    recordsPerPage: str(raw.recordsPerPage, "20"),
    showAvatar: bool(raw.showAvatar, true),
    compactMode: bool(raw.compactMode, false),
    passwordMinLength: str(raw.passwordMinLength, "8"),
    requireUppercase: bool(raw.requireUppercase, true),
    requireNumber: bool(raw.requireNumber, true),
    requireSpecialChar: bool(raw.requireSpecialChar, false),
    sessionTimeout: str(raw.sessionTimeout, "30"),
    maxLoginAttempts: str(raw.maxLoginAttempts, "5"),
    require2fa: bool(raw.require2fa, false),
    smtpHost: str(raw.smtpHost, ""),
    smtpPort: str(raw.smtpPort, ""),
    smtpUser: str(raw.smtpUser, ""),
    smtpPass: str(raw.smtpPass, ""),
    emailFrom: str(raw.emailFrom, ""),
    notifyNewLogin: bool(raw.notifyNewLogin, true),
    notifyPendingContent: bool(raw.notifyPendingContent, true),
    notifySecurityAlerts: bool(raw.notifySecurityAlerts, true),
    notifyPeriodicReports: bool(raw.notifyPeriodicReports, false),
    autoBackupEnabled: bool(raw.autoBackupEnabled, false),
    backupFrequency: str(raw.backupFrequency, "daily"),
    backupRetention: str(raw.backupRetention, "7"),
  }
}

function buildSettingsPayload(data: Partial<SettingsFormData>): SettingsRaw {
  const payload: SettingsRaw = {}
  const keys: (keyof SettingsFormData)[] = [
    "systemName", "systemDescription", "timezone", "language", "recordsPerPage",
    "showAvatar", "compactMode", "passwordMinLength", "requireUppercase", "requireNumber",
    "requireSpecialChar", "sessionTimeout", "maxLoginAttempts", "require2fa",
    "smtpHost", "smtpPort", "smtpUser", "smtpPass", "emailFrom",
    "notifyNewLogin", "notifyPendingContent", "notifySecurityAlerts", "notifyPeriodicReports",
    "autoBackupEnabled", "backupFrequency", "backupRetention",
  ]
  for (const key of keys) {
    const value = data[key]
    if (value !== undefined) {
      payload[key] = value
    }
  }
  return payload
}

export class SettingsService {
  static async getSettings(): Promise<SettingsFormData> {
    const response = await ApiClient.get<SettingsRaw>(
      "/api/v1/admin/settings",
      undefined,
      true
    )
    if (response.success && response.data) {
      return rawToFormData(response.data)
    }
    throw new Error(response.error?.message ?? "Failed to fetch settings")
  }

  static async getSystemStatusCards(): Promise<SettingsStatusCard[]> {
    const response = await ApiClient.get<SettingsStatusItem[]>(
      "/api/v1/admin/settings/status",
      undefined,
      true
    )
    if (response.success && response.data) {
      return response.data.map(mapStatusToCard)
    }
    throw new Error(response.error?.message ?? "Failed to fetch system status")
  }

  static async getVersion(): Promise<string> {
    const response = await ApiClient.get<SettingsVersionResponse>(
      "/api/v1/admin/settings/version",
      undefined,
      true
    )
    if (response.success && response.data) {
      const data = response.data
      return typeof data.version === "string" ? data.version : String(data.version ?? "1.0.0")
    }
    throw new Error(response.error?.message ?? "Failed to fetch version")
  }

  static async update(data: Partial<SettingsFormData>): Promise<void> {
    const payload = buildSettingsPayload(data)
    const res = await ApiClient.patch<SettingsRaw>(
      "/api/v1/admin/settings",
      payload,
      true
    )
    if (res.success) return
    throw new Error(res.error?.message ?? "Failed to update settings")
  }

  static async reset(): Promise<void> {
    const response = await ApiClient.post<void>("/api/v1/admin/settings/reset", {}, true)
    if (response.success) return
    throw new Error(response.error?.message ?? "Failed to reset settings")
  }
}
