"use client"

import type { SettingsFormData } from "@/lib/schemas/settings.schema"
import type { SettingsStatusCard } from "@/lib/data/types"
import { defaultSettingsFormData, settingsStatusCards, settingsVersion } from "@/lib/data/mock/settings"

export class SettingsService {
  static async getSettings(): Promise<SettingsFormData> {
    return defaultSettingsFormData
  }

  static async getSystemStatusCards(): Promise<SettingsStatusCard[]> {
    return settingsStatusCards
  }

  static async getVersion(): Promise<string> {
    return settingsVersion
  }
}
