import type { UserAccount } from "@/lib/types/api"

export function getAccountDisplayName(account: UserAccount): string {
  const name = account.profile?.fullName?.trim()
  if (name) return name
  return account.phone
}

export function getAccountRoleLabel(account: UserAccount): string {
  return account.role
}

export function getAccountDetailLine(account: UserAccount): string {
  const p = account.profile
  if (!p) return ""
  const parts: string[] = []
  if (p.unitName?.trim()) parts.push(p.unitName.trim())
  if (p.position?.trim()) parts.push(p.position.trim())
  return parts.join(" · ")
}

export function getAccountInitials(account: UserAccount): string {
  const name = account.profile?.fullName?.trim()
  if (name) {
    const parts = name.split(/\s+/).filter((s) => s.length > 0)
    if (parts.length >= 2) {
      const a = parts[0].charAt(0)
      const b = parts[parts.length - 1].charAt(0)
      return (a + b).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }
  const digits = account.phone.replaceAll(/\D/g, "")
  return digits.slice(-2) || "?"
}
