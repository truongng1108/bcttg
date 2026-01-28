import { mockContent } from "@/lib/data/mock/cms"
import type { CMSItem } from "@/lib/data/types"

let cmsStore: CMSItem[] = [...mockContent]

export class CMSService {
  static async getAll(): Promise<CMSItem[]> {
    return cmsStore
  }

  static async getById(id: string): Promise<CMSItem | null> {
    return cmsStore.find((item) => item.id === id) || null
  }

  static async create(data: Omit<CMSItem, "id">): Promise<CMSItem> {
    const maxId = cmsStore.reduce((max, item) => {
      const n = Number.parseInt(item.id, 10)
      return Number.isFinite(n) ? Math.max(max, n) : max
    }, 0)
    const newItem: CMSItem = {
      ...data,
      id: String(maxId + 1),
    }
    cmsStore = [newItem, ...cmsStore]
    return newItem
  }

  static async update(id: string, data: Partial<CMSItem>): Promise<CMSItem> {
    const index = cmsStore.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error(`CMS item with id ${id} not found`)
    }
    const updated = { ...cmsStore[index], ...data }
    cmsStore = cmsStore.map((item) => (item.id === id ? updated : item))
    return updated
  }

  static async delete(id: string): Promise<boolean> {
    const exists = cmsStore.some((item) => item.id === id)
    if (!exists) return false
    cmsStore = cmsStore.filter((item) => item.id !== id)
    return true
  }
}
