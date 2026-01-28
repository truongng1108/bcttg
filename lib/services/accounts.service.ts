import { mockAccounts } from "@/lib/data/mock/accounts"
import type { Account } from "@/lib/data/types"

let accountsStore: Account[] = [...mockAccounts]

export class AccountsService {
  static async getAll(): Promise<Account[]> {
    return accountsStore
  }

  static async getById(id: string): Promise<Account | null> {
    return accountsStore.find((a) => a.id === id) || null
  }

  static async create(data: Omit<Account, "id">): Promise<Account> {
    const maxId = accountsStore.reduce((max, a) => {
      const n = Number.parseInt(a.id, 10)
      return Number.isFinite(n) ? Math.max(max, n) : max
    }, 0)
    const newAccount: Account = {
      ...data,
      id: String(maxId + 1),
    }
    accountsStore = [newAccount, ...accountsStore]
    return newAccount
  }

  static async update(id: string, data: Partial<Account>): Promise<Account> {
    const index = accountsStore.findIndex((a) => a.id === id)
    if (index === -1) {
      throw new Error(`Account with id ${id} not found`)
    }
    const updated = { ...accountsStore[index], ...data }
    accountsStore = accountsStore.map((a) => (a.id === id ? updated : a))
    return updated
  }

  static async delete(id: string): Promise<boolean> {
    const exists = accountsStore.some((a) => a.id === id)
    if (!exists) return false
    accountsStore = accountsStore.filter((a) => a.id !== id)
    return true
  }
}
