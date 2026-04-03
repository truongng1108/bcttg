import type { ProfileType } from "@/lib/constants/profile-types"
import { DataProfilesService } from "@/lib/services/data-profiles.service"
import type { DataProfile } from "@/lib/types/api"

export function getUniqueSortedUnitNamesFromProfiles(items: readonly DataProfile[]): string[] {
  const unique = new Set<string>()
  for (const item of items) {
    if (item.unitName) unique.add(item.unitName)
  }
  return Array.from(unique).sort((a, b) => a.localeCompare(b, "vi"))
}

export async function fetchAllProfilesForUnitTree(profileType: ProfileType): Promise<DataProfile[]> {
  const pageSizeFetch = 500
  let page = 1
  const all: DataProfile[] = []
  while (true) {
    const res = await DataProfilesService.getAllAdmin({
      page,
      page_size: pageSizeFetch,
      profileType,
    })
    all.push(...res.data)
    if (res.data.length === 0) break
    const totalPages = res.meta?.total_pages
    if (totalPages !== undefined && totalPages > 0) {
      if (page >= totalPages) break
    } else if (res.data.length < pageSizeFetch) {
      break
    }
    page += 1
  }
  return all
}

export async function loadUnitNamesForProfileType(profileType: ProfileType): Promise<string[]> {
  const all = await fetchAllProfilesForUnitTree(profileType)
  return getUniqueSortedUnitNamesFromProfiles(all)
}
