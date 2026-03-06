export function formatNumber(value: number): string {
  return value.toLocaleString("vi-VN")
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("vi-VN")
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleString("vi-VN")
}

export function mapSongCategoryLabel(value: string): string {
  if (value === "hanh-khuc") return "Hành khúc"
  if (value === "ca-ngoi") return "Ca ngợi"
  if (value === "tru-tinh") return "Trữ tình"
  return value || "Chưa phân loại"
}

export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return "—"
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}