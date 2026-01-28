import type { SettingsFormData } from "@/lib/schemas/settings.schema"
import type { SettingsStatusCard } from "@/lib/data/types"

export const settingsVersion = "1.0.0"

export const defaultSettingsFormData: SettingsFormData = {
  systemName: "Sổ Tay Điện Tử Giáo Dục Truyền Thống",
  systemDescription:
    "Hệ thống Sổ Tay Điện Tử Giáo Dục Truyền Thống - Binh chủng Tăng Thiết Giáp - Quân đội Nhân dân Việt Nam",
  timezone: "asia-ho_chi_minh",
  language: "vi",
  recordsPerPage: "20",
  showAvatar: true,
  compactMode: false,

  passwordMinLength: "8",
  requireUppercase: true,
  requireNumber: true,
  requireSpecialChar: false,
  sessionTimeout: "30",
  maxLoginAttempts: "5",
  require2fa: false,

  smtpHost: "",
  smtpPort: "",
  smtpUser: "",
  smtpPass: "",
  emailFrom: "",
  notifyNewLogin: true,
  notifyPendingContent: true,
  notifySecurityAlerts: true,
  notifyPeriodicReports: false,

  autoBackupEnabled: true,
  backupFrequency: "daily",
  backupRetention: "7",
}

export const settingsStatusCards: SettingsStatusCard[] = [
  { id: "server", title: "Trạng thái Server", value: "Hoạt động", iconKey: "server", variant: "success" },
  { id: "db", title: "Database", value: "Kết nối tốt", iconKey: "database", variant: "accent" },
  { id: "storage", title: "Bộ nhớ sử dụng", value: "45.2 GB / 100 GB", iconKey: "storage", variant: "primary" },
  { id: "uptime", title: "Uptime", value: "99.9%", iconKey: "uptime", variant: "default" },
]
