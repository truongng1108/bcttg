import { initialModules } from "@/lib/data/mock/home-modules"
import type { HomeModule } from "@/lib/data/types"

let modulesStore: HomeModule[] = [...initialModules]

export class HomeModulesService {
  static async getAll(): Promise<HomeModule[]> {
    return modulesStore
  }

  static async update(id: string, data: Partial<HomeModule>): Promise<HomeModule> {
    const index = modulesStore.findIndex((module) => module.id === id)
    if (index === -1) {
      throw new Error(`Module with id ${id} not found`)
    }
    const next = { ...modulesStore[index], ...data }
    modulesStore[index] = next
    return next
  }

  static async saveAll(next: readonly HomeModule[]): Promise<HomeModule[]> {
    modulesStore = next.map((module, index) => ({
      ...module,
      order: index + 1,
    }))
    return modulesStore
  }
}
