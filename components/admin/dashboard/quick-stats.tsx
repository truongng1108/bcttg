"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"

export interface ChartDataPoint {
  label: string
  value: number
}

const CHART_COLOR_PALETTE = [
  "#C62828",
  "#B71C1C",
  "#C9A227",
  "#D4A574",
  "#8B4513",
  "#5D4037",
]

function toNameValue(data: ChartDataPoint[]) {
  return data.map((d) => ({ name: d.label, value: d.value }))
}

function toPieData(data: ChartDataPoint[]) {
  return data.map((d, i) => ({
    name: d.label,
    value: d.value,
    color: CHART_COLOR_PALETTE[i % CHART_COLOR_PALETTE.length],
  }))
}

function legendFormatter(value: string) {
  return <span className="text-foreground">{value}</span>
}

export interface ContentChartProps {
  readonly data: ChartDataPoint[]
}

export function ContentChart({ data }: ContentChartProps) {
  const chartData = toNameValue(data)
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Nội dung theo tháng
      </h3>
      <div className="h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5D0C4" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D0C4",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="value" fill="#C62828" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export interface CategoryChartProps {
  readonly data: ChartDataPoint[]
}

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = toPieData(data)
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Phân loại nội dung
      </h3>
      <div className="h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D0C4",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: "12px" }}
                formatter={legendFormatter}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

export interface AccessChartProps {
  readonly data: ChartDataPoint[]
}

export function AccessChart({ data }: AccessChartProps) {
  const chartData = toNameValue(data)
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Lượt truy cập tuần này
      </h3>
      <div className="h-64">
        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D5D0C4" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#5C5C5C" }}
                axisLine={{ stroke: "#D5D0C4" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #D5D0C4",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#C9A227"
                strokeWidth={2}
                dot={{ fill: "#C9A227", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
