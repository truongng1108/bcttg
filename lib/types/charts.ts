export interface ChartConfig {
  dataKey: string
  stroke?: string
  fill?: string
  fillOpacity?: number
  strokeWidth?: number
}

export interface ChartData {
  [key: string]: string | number
}
