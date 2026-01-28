import type { SelectOption } from "../types"

export const rankOptions: SelectOption[] = [
  { value: "Binh nhì", label: "Binh nhì" },
  { value: "Binh nhất", label: "Binh nhất" },
  { value: "Hạ sĩ", label: "Hạ sĩ" },
  { value: "Trung sĩ", label: "Trung sĩ" },
  { value: "Thượng sĩ", label: "Thượng sĩ" },
  { value: "Thiếu úy", label: "Thiếu úy" },
  { value: "Trung úy", label: "Trung úy" },
  { value: "Thượng úy", label: "Thượng úy" },
  { value: "Đại úy", label: "Đại úy" },
  { value: "Thiếu tá", label: "Thiếu tá" },
  { value: "Trung tá", label: "Trung tá" },
  { value: "Thượng tá", label: "Thượng tá" },
  { value: "Đại tá", label: "Đại tá" },
  { value: "Thiếu tướng", label: "Thiếu tướng" },
  { value: "Trung tướng", label: "Trung tướng" },
  { value: "Thượng tướng", label: "Thượng tướng" },
  { value: "Đại tướng", label: "Đại tướng" },
]

export const unitOptions: SelectOption[] = [
  { value: "Phòng Chính trị", label: "Phòng Chính trị" },
  { value: "Phòng Kỹ thuật", label: "Phòng Kỹ thuật" },
  { value: "Phòng Hậu cần", label: "Phòng Hậu cần" },
  { value: "Ban Chỉ huy", label: "Ban Chỉ huy" },
  { value: "Tiểu đoàn 1", label: "Tiểu đoàn 1" },
  { value: "Tiểu đoàn 2", label: "Tiểu đoàn 2" },
  { value: "Tiểu đoàn 3", label: "Tiểu đoàn 3" },
]

export const roleOptions: SelectOption[] = [
  { value: "Quản trị viên", label: "Quản trị viên" },
  { value: "Chỉ huy", label: "Chỉ huy" },
  { value: "Cán bộ chính trị", label: "Cán bộ chính trị" },
  { value: "Biên tập viên", label: "Biên tập viên" },
  { value: "Người dùng", label: "Người dùng" },
]

export const statusOptions: SelectOption[] = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "locked", label: "Đã khóa" },
  { value: "pending", label: "Chờ duyệt" },
]

export const songCategoryOptions: SelectOption[] = [
  { value: "hanh-khuc", label: "Hành khúc" },
  { value: "ca-ngoi", label: "Ca ngợi" },
  { value: "tru-tinh", label: "Trữ tình" },
]

export const songStatusOptions: SelectOption[] = [
  { value: "active", label: "Đang hiển thị" },
  { value: "hidden", label: "Đang ẩn" },
]

export const cmsCategoryOptions: SelectOption[] = [
  { value: "truyen-thong", label: "Truyền thống" },
  { value: "net-tieu-bieu", label: "Nét tiêu biểu" },
]

export const cmsStatusOptions: SelectOption[] = [
  { value: "active", label: "Đang hiển thị" },
  { value: "hidden", label: "Đã ẩn" },
  { value: "pending", label: "Chờ duyệt" },
]

export const noteCategoryOptions: SelectOption[] = [
  { value: "Công việc", label: "Công việc" },
  { value: "Duyệt nội dung", label: "Duyệt nội dung" },
  { value: "Hệ thống", label: "Hệ thống" },
  { value: "Liên hệ", label: "Liên hệ" },
  { value: "Phản hồi", label: "Phản hồi" },
]

export const starredFilterOptions: SelectOption[] = [
  { value: "all", label: "Tất cả" },
  { value: "starred", label: "Quan trọng" },
  { value: "unstarred", label: "Thông thường" },
]
