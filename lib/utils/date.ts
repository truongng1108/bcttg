import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function formatDateDetail(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  try {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
  } catch {
    return dateString
  }
}

export function formatDateOnly(dateString: string | null | undefined): string {
  if (!dateString) return "—"
  try {
    return format(new Date(dateString), "dd/MM/yyyy", { locale: vi })
  } catch {
    return dateString
  }
}

export function formatReminderDate(dateString: string | null | undefined): string {
  return formatDateDetail(dateString)
}

