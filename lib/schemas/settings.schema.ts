import { z } from "zod"

export const SettingsFormSchema = z.object({
  systemName: z.string().min(1, "Vui lòng nhập tên hệ thống"),
  systemDescription: z.string().optional().or(z.literal("")),
  timezone: z.string().min(1),
  language: z.string().min(1),
  recordsPerPage: z.string().min(1),
  showAvatar: z.boolean(),
  compactMode: z.boolean(),

  passwordMinLength: z.string().min(1),
  requireUppercase: z.boolean(),
  requireNumber: z.boolean(),
  requireSpecialChar: z.boolean(),
  sessionTimeout: z.string().min(1),
  maxLoginAttempts: z.string().min(1),
  require2fa: z.boolean(),

  smtpHost: z.string().optional().or(z.literal("")),
  smtpPort: z.string().optional().or(z.literal("")),
  smtpUser: z.string().optional().or(z.literal("")),
  smtpPass: z.string().optional().or(z.literal("")),
  emailFrom: z.string().optional().or(z.literal("")),
  notifyNewLogin: z.boolean(),
  notifyPendingContent: z.boolean(),
  notifySecurityAlerts: z.boolean(),
  notifyPeriodicReports: z.boolean(),

  autoBackupEnabled: z.boolean(),
  backupFrequency: z.string().min(1),
  backupRetention: z.string().min(1),
})

export type SettingsFormData = z.infer<typeof SettingsFormSchema>

