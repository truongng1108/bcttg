"use client"

import type { SelectOption } from "@/lib/data/types"
import {
  cmsCategoryOptions,
  cmsStatusOptions,
  noteCategoryOptions,
  rankOptions,
  roleOptions,
  songCategoryOptions,
  songStatusOptions,
  starredFilterOptions,
  statusOptions,
  unitOptions,
} from "@/lib/data/mock/options"

export class OptionsService {
  static async getRanks(): Promise<SelectOption[]> {
    return rankOptions
  }

  static async getUnits(): Promise<SelectOption[]> {
    return unitOptions
  }

  static async getRoles(): Promise<SelectOption[]> {
    return roleOptions
  }

  static async getAccountStatuses(): Promise<SelectOption[]> {
    return statusOptions
  }

  static async getSongCategories(): Promise<SelectOption[]> {
    return songCategoryOptions
  }

  static async getSongStatuses(): Promise<SelectOption[]> {
    return songStatusOptions
  }

  static async getCmsCategories(): Promise<SelectOption[]> {
    return cmsCategoryOptions
  }

  static async getCmsStatuses(): Promise<SelectOption[]> {
    return cmsStatusOptions
  }

  static async getNoteCategories(): Promise<SelectOption[]> {
    return noteCategoryOptions
  }

  static async getStarredFilters(): Promise<SelectOption[]> {
    return starredFilterOptions
  }
}
