import type {
  AccessChartData,
  ActivityItem,
  CategoryChartData,
  ContentChartData,
  DashboardPendingItem,
  DashboardSummaryCard,
  DashboardSystemStatusItem,
} from "../types"

export const mockActivities: ActivityItem[] = [
  {
    id: "1",
    action: "Cập nhật nội dung",
    target: "Lịch sử hình thành Binh chủng",
    user: "Đại úy Nguyễn Văn A",
    timestamp: "10 phút trước",
    type: "content",
  },
  {
    id: "2",
    action: "Thêm mới hồ sơ",
    target: "Thiếu tướng Trần Văn B",
    user: "Thượng úy Lê Văn C",
    timestamp: "25 phút trước",
    type: "profile",
  },
  {
    id: "3",
    action: "Tải lên ca khúc",
    target: "Hành khúc Tăng Thiết Giáp",
    user: "Đại úy Nguyễn Văn A",
    timestamp: "1 giờ trước",
    type: "song",
  },
  {
    id: "4",
    action: "Tạo tài khoản",
    target: "Trung úy Phạm Văn D",
    user: "Quản trị viên",
    timestamp: "2 giờ trước",
    type: "user",
  },
  {
    id: "5",
    action: "Cập nhật cấu hình",
    target: "Thiết lập bảo mật",
    user: "Quản trị viên",
    timestamp: "3 giờ trước",
    type: "system",
  },
]

export const contentData: ContentChartData[] = [
  { name: "T1", value: 45 },
  { name: "T2", value: 52 },
  { name: "T3", value: 48 },
  { name: "T4", value: 61 },
  { name: "T5", value: 55 },
  { name: "T6", value: 67 },
  { name: "T7", value: 72 },
  { name: "T8", value: 58 },
  { name: "T9", value: 64 },
  { name: "T10", value: 78 },
  { name: "T11", value: 82 },
  { name: "T12", value: 91 },
]

export const categoryData: CategoryChartData[] = [
  { name: "Truyền thống", value: 35, color: "#C62828" },
  { name: "Nét tiêu biểu", value: 28, color: "#B71C1C" },
  { name: "Hồ sơ thủ trưởng", value: 15, color: "#C9A227" },
  { name: "Hồ sơ chiến sĩ", value: 45, color: "#D4A574" },
  { name: "Ca khúc", value: 22, color: "#8B4513" },
]

export const accessData: AccessChartData[] = [
  { name: "T2", value: 120 },
  { name: "T3", value: 145 },
  { name: "T4", value: 132 },
  { name: "T5", value: 167 },
  { name: "T6", value: 189 },
  { name: "T7", value: 156 },
  { name: "CN", value: 98 },
]

export const dashboardLastUpdatedAt = "27/01/2026 - 14:30"

export const dashboardSummaryCards: DashboardSummaryCard[] = [
  {
    id: "posts",
    title: "Tổng bài viết",
    value: 156,
    iconKey: "posts",
    trend: { value: 12, isPositive: true },
    description: "so với tháng trước",
    variant: "primary",
  },
  {
    id: "profiles",
    title: "Hồ sơ dữ liệu",
    value: 89,
    iconKey: "profiles",
    trend: { value: 8, isPositive: true },
    description: "so với tháng trước",
    variant: "secondary",
  },
  {
    id: "songs",
    title: "Ca khúc",
    value: 24,
    iconKey: "songs",
    description: "trong thư viện",
    variant: "accent",
  },
  {
    id: "accounts",
    title: "Tài khoản",
    value: 42,
    iconKey: "accounts",
    trend: { value: 5, isPositive: true },
    description: "đang hoạt động",
    variant: "default",
  },
  {
    id: "views",
    title: "Lượt xem hôm nay",
    value: 1247,
    iconKey: "views",
    trend: { value: 23, isPositive: true },
    description: "so với hôm qua",
    variant: "default",
  },
  {
    id: "edits",
    title: "Chỉnh sửa hôm nay",
    value: 18,
    iconKey: "edits",
    description: "thao tác",
    variant: "default",
  },
]

export const dashboardSystemStatusItems: DashboardSystemStatusItem[] = [
  { id: "db", label: "Cơ sở dữ liệu", status: "active", detail: "Hoạt động ổn định" },
  { id: "cache", label: "Bộ nhớ đệm", status: "active", detail: "85% dung lượng" },
  { id: "backup", label: "Sao lưu tự động", status: "active", detail: "Lần cuối: 27/01/2026 06:00" },
  { id: "security", label: "Bảo mật", status: "active", detail: "Đã bật xác thực 2 lớp" },
  { id: "ssl", label: "SSL/TLS", status: "active", detail: "Chứng chỉ còn 89 ngày" },
]

export const dashboardPendingItems: DashboardPendingItem[] = [
  {
    id: "p1",
    title: "Trận đánh Đường 9 - Nam Lào",
    type: "Truyền thống",
    author: "Thượng úy Lê Văn C",
    date: "26/01/2026",
    status: "pending",
  },
  {
    id: "p2",
    title: "Hồ sơ Thiếu tướng Nguyễn Văn E",
    type: "Hồ sơ",
    author: "Đại úy Trần Văn F",
    date: "25/01/2026",
    status: "pending",
  },
  {
    id: "p3",
    title: "Ca khúc kỷ niệm 60 năm",
    type: "Ca khúc",
    author: "Trung úy Phạm Văn G",
    date: "24/01/2026",
    status: "review",
  },
]
