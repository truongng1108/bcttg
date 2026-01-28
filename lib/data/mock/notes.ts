import type { Note } from "../types"

export const notesData: Note[] = [
  {
    id: 1,
    title: "Họp giao ban tuần - Phòng Chính trị",
    content: "Nội dung cần chuẩn bị: báo cáo tiến độ cập nhật hồ sơ chiến sĩ, thống kê số lượng truy cập ứng dụng trong tuần...",
    category: "Công việc",
    starred: true,
    createdAt: "27/01/2026 09:30",
    updatedAt: "27/01/2026 14:15",
  },
  {
    id: 2,
    title: "Danh sách cần duyệt nội dung CMS",
    content: "- Bài viết về lịch sử hình thành Binh chủng\n- Hồ sơ Anh hùng Nguyễn Văn B\n- Ca khúc truyền thống mới cập nhật",
    category: "Duyệt nội dung",
    starred: true,
    createdAt: "26/01/2026 16:00",
    updatedAt: "26/01/2026 16:00",
  },
  {
    id: 3,
    title: "Ghi nhớ - Cập nhật hệ thống",
    content: "Thời gian bảo trì định kỳ: 22:00 - 02:00 ngày 01/02/2026. Thông báo trước cho các đơn vị sử dụng.",
    category: "Hệ thống",
    starred: false,
    createdAt: "25/01/2026 11:20",
    updatedAt: "25/01/2026 11:20",
  },
  {
    id: 4,
    title: "Liên hệ kỹ thuật",
    content: "Đ/c Trần Văn C - Phòng CNTT\nĐT: 0123.456.789\nEmail: c.tranvan@ttg.vn",
    category: "Liên hệ",
    starred: false,
    createdAt: "24/01/2026 08:45",
    updatedAt: "24/01/2026 08:45",
  },
  {
    id: 5,
    title: "Yêu cầu bổ sung tính năng",
    content: "Người dùng phản hồi cần bổ sung:\n- Chức năng tìm kiếm nâng cao\n- Xuất báo cáo theo đơn vị\n- Thông báo push",
    category: "Phản hồi",
    starred: false,
    createdAt: "23/01/2026 15:30",
    updatedAt: "23/01/2026 15:30",
  },
]

export const categoryColors: Record<string, string> = {
  "Công việc": "bg-primary/10 text-primary border-primary/20",
  "Duyệt nội dung": "bg-accent/10 text-accent border-accent/20",
  "Hệ thống": "bg-[#1565C0]/10 text-[#1565C0] border-[#1565C0]/20",
  "Liên hệ": "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20",
  "Phản hồi": "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/20",
}
