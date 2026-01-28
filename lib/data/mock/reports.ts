import type { MonthlyData, ReportsSummaryCard, TopContentData, UserActivityData } from "../types"

export const monthlyData: MonthlyData[] = [
  { month: "T1", views: 4500, edits: 120, logins: 850 },
  { month: "T2", views: 5200, edits: 145, logins: 920 },
  { month: "T3", views: 4800, edits: 132, logins: 880 },
  { month: "T4", views: 6100, edits: 167, logins: 1050 },
  { month: "T5", views: 5500, edits: 156, logins: 980 },
  { month: "T6", views: 6700, edits: 189, logins: 1120 },
  { month: "T7", views: 7200, edits: 201, logins: 1200 },
  { month: "T8", views: 5800, edits: 145, logins: 950 },
  { month: "T9", views: 6400, edits: 178, logins: 1080 },
  { month: "T10", views: 7800, edits: 212, logins: 1350 },
  { month: "T11", views: 8200, edits: 234, logins: 1420 },
  { month: "T12", views: 9100, edits: 256, logins: 1580 },
]

export const userActivityData: UserActivityData[] = [
  { name: "Quản trị viên", value: 5, activity: 89 },
  { name: "Chỉ huy", value: 8, activity: 76 },
  { name: "Cán bộ CT", value: 12, activity: 82 },
  { name: "Biên tập viên", value: 15, activity: 95 },
  { name: "Người dùng", value: 25, activity: 45 },
]

export const topContentData: TopContentData[] = [
  { title: "Lịch sử hình thành Binh chủng", views: 2156, trend: 15 },
  { title: "Chiến dịch Hồ Chí Minh", views: 1892, trend: 8 },
  { title: "60 năm xây dựng (1965-2025)", views: 1547, trend: 23 },
  { title: "Trận Đường 9 - Nam Lào", views: 1234, trend: -5 },
  { title: "Tinh thần đoàn kết", views: 987, trend: 12 },
]

export const reportsSummaryCards: ReportsSummaryCard[] = [
  {
    id: "views",
    title: "Tổng lượt xem",
    value: "77,400",
    change: 18.5,
    iconKey: "views",
    period: "so với năm trước",
  },
  {
    id: "actions",
    title: "Tổng thao tác",
    value: "2,135",
    change: 12.3,
    iconKey: "actions",
    period: "so với năm trước",
  },
  {
    id: "users",
    title: "Người dùng hoạt động",
    value: "65",
    change: 8.7,
    iconKey: "users",
    period: "so với năm trước",
  },
  {
    id: "avgTime",
    title: "Thời gian trung bình",
    value: "4:32",
    change: -2.1,
    iconKey: "avgTime",
    period: "phút/phiên",
  },
]
