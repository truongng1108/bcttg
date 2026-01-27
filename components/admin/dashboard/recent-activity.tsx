import { cn } from "@/lib/utils"
import { FileText, User, Music, Settings, Shield } from "lucide-react"

interface ActivityItem {
  id: string
  action: string
  target: string
  user: string
  timestamp: string
  type: "content" | "user" | "song" | "system" | "profile"
}

const mockActivities: ActivityItem[] = [
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

const typeIcons = {
  content: FileText,
  user: User,
  song: Music,
  system: Settings,
  profile: Shield,
}

const typeColors = {
  content: "bg-primary/10 text-primary",
  user: "bg-secondary/10 text-secondary",
  song: "bg-accent/10 text-accent",
  system: "bg-muted text-muted-foreground",
  profile: "bg-info/10 text-info",
}

export function RecentActivity() {
  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Hoạt động gần đây
        </h3>
      </div>
      <div className="divide-y divide-border">
        {mockActivities.map((activity) => {
          const Icon = typeIcons[activity.type]
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded",
                  typeColors[activity.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.action}</span>
                  {" - "}
                  <span className="text-muted-foreground">{activity.target}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.user} &bull; {activity.timestamp}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="border-t border-border px-4 py-2">
        <button className="text-sm font-medium text-primary hover:underline">
          Xem tất cả hoạt động
        </button>
      </div>
    </div>
  )
}
