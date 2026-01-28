import type { ExportType } from "../constants/export-types"

export function handleExportExcel(type: ExportType | string): void {
  alert(`Đang xuất báo cáo ${type} ra file Excel...`)
}
