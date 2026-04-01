import type { ExportType } from "../constants/export-types"
import type { ReportsPeriod } from "@/lib/types/api"
import { ReportsService } from "@/lib/services/reports.service"

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

function buildFallbackFilename(type: ExportType, period: ReportsPeriod): string {
  return `bao-cao-${type}-${period}.xlsx`
}

export async function handleExportExcel(type: ExportType, period: ReportsPeriod): Promise<void> {
  const result = await ReportsService.exportReport(type, period, "xlsx")
  const filename = result.filename ?? buildFallbackFilename(type, period)
  triggerDownload(result.blob, filename)
}
