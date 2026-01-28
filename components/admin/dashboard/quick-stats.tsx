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

import { contentData, categoryData, accessData } from "@/lib/data/mock/dashboard"

export function ContentChart() {
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Nội dung theo tháng
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={contentData}>
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
      </div>
    </div>
  )
}

export function CategoryChart() {
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Phân loại nội dung
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {categoryData.map((entry) => (
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
              formatter={(value) => (
                <span className="text-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function AccessChart() {
  return (
    <div className="rounded-md border border-border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Lượt truy cập tuần này
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={accessData}>
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
      </div>
    </div>
  )
}
