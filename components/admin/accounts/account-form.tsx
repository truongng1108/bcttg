"use client"

import { useState } from "react"
import { Save, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormField } from "../shared/form-field"
import { ConfirmDialog } from "../shared/confirm-dialog"

interface AccountFormProps {
  mode: "create" | "edit"
  initialData?: {
    rank: string
    fullName: string
    username: string
    email: string
    phone: string
    unit: string
    role: string
    status: string
  }
  onBack: () => void
  onSave: (data: unknown) => void
}

const rankOptions = [
  { value: "binh-nhi", label: "Binh nhì" },
  { value: "binh-nhat", label: "Binh nhất" },
  { value: "ha-si", label: "Hạ sĩ" },
  { value: "trung-si", label: "Trung sĩ" },
  { value: "thuong-si", label: "Thượng sĩ" },
  { value: "thieu-uy", label: "Thiếu úy" },
  { value: "trung-uy", label: "Trung úy" },
  { value: "thuong-uy", label: "Thượng úy" },
  { value: "dai-uy", label: "Đại úy" },
  { value: "thieu-ta", label: "Thiếu tá" },
  { value: "trung-ta", label: "Trung tá" },
  { value: "thuong-ta", label: "Thượng tá" },
  { value: "dai-ta", label: "Đại tá" },
]

const unitOptions = [
  { value: "phong-chinh-tri", label: "Phòng Chính trị" },
  { value: "phong-ky-thuat", label: "Phòng Kỹ thuật" },
  { value: "phong-hau-can", label: "Phòng Hậu cần" },
  { value: "ban-chi-huy", label: "Ban Chỉ huy" },
  { value: "tieu-doan-1", label: "Tiểu đoàn 1" },
  { value: "tieu-doan-2", label: "Tiểu đoàn 2" },
  { value: "tieu-doan-3", label: "Tiểu đoàn 3" },
]

const roleOptions = [
  { value: "admin", label: "Quản trị viên" },
  { value: "commander", label: "Chỉ huy" },
  { value: "political", label: "Cán bộ chính trị" },
  { value: "editor", label: "Biên tập viên" },
  { value: "user", label: "Người dùng" },
]

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Không hoạt động" },
  { value: "pending", label: "Chờ duyệt" },
]

export function AccountForm({
  mode,
  initialData,
  onBack,
  onSave,
}: AccountFormProps) {
  const [formData, setFormData] = useState({
    rank: initialData?.rank ?? "",
    fullName: initialData?.fullName ?? "",
    username: initialData?.username ?? "",
    email: initialData?.email ?? "",
    phone: initialData?.phone ?? "",
    unit: initialData?.unit ?? "",
    role: initialData?.role ?? "",
    status: initialData?.status ?? "active",
    password: "",
    confirmPassword: "",
  })

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when field changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.rank) newErrors.rank = "Vui lòng chọn cấp bậc"
    if (!formData.fullName.trim())
      newErrors.fullName = "Vui lòng nhập họ và tên"
    if (!formData.username.trim())
      newErrors.username = "Vui lòng nhập tên đăng nhập"
    if (!formData.unit) newErrors.unit = "Vui lòng chọn đơn vị"
    if (!formData.role) newErrors.role = "Vui lòng chọn vai trò"

    if (mode === "create") {
      if (!formData.password) {
        newErrors.password = "Vui lòng nhập mật khẩu"
      } else if (formData.password.length < 8) {
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleCancel = () => {
    setCancelDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-9 w-9"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {mode === "create" ? "Thêm tài khoản mới" : "Chỉnh sửa tài khoản"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create"
              ? "Tạo tài khoản người dùng mới trong hệ thống"
              : "Cập nhật thông tin tài khoản người dùng"}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="rounded-md border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Thông tin cơ bản
          </h2>
        </div>

        <div className="space-y-6 p-6">
          {/* Row 1: Rank & Full Name */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Cấp bậc"
              name="rank"
              type="select"
              required
              value={formData.rank}
              onChange={(v) => handleChange("rank", v)}
              options={rankOptions}
              error={errors.rank}
            />
            <FormField
              label="Họ và tên"
              name="fullName"
              required
              placeholder="Nhập họ và tên đầy đủ"
              value={formData.fullName}
              onChange={(v) => handleChange("fullName", v)}
              error={errors.fullName}
            />
          </div>

          {/* Row 2: Username & Email */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Tên đăng nhập"
              name="username"
              required
              placeholder="Nhập tên đăng nhập"
              value={formData.username}
              onChange={(v) => handleChange("username", v)}
              error={errors.username}
              helpText="Chỉ sử dụng chữ cái, số và dấu gạch dưới"
              disabled={mode === "edit"}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              value={formData.email}
              onChange={(v) => handleChange("email", v)}
              error={errors.email}
            />
          </div>

          {/* Row 3: Phone & Unit */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Số điện thoại"
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(v) => handleChange("phone", v)}
            />
            <FormField
              label="Đơn vị"
              name="unit"
              type="select"
              required
              value={formData.unit}
              onChange={(v) => handleChange("unit", v)}
              options={unitOptions}
              error={errors.unit}
            />
          </div>

          {/* Row 4: Role & Status */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
              label="Vai trò"
              name="role"
              type="select"
              required
              value={formData.role}
              onChange={(v) => handleChange("role", v)}
              options={roleOptions}
              error={errors.role}
            />
            <FormField
              label="Trạng thái"
              name="status"
              type="select"
              required
              value={formData.status}
              onChange={(v) => handleChange("status", v)}
              options={statusOptions}
            />
          </div>
        </div>

        {/* Password Section - Only for Create */}
        {mode === "create" && (
          <>
            <div className="border-t border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Mật khẩu đăng nhập
              </h2>
            </div>
            <div className="space-y-6 p-6 pt-0">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  required
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={(v) => handleChange("password", v)}
                  error={errors.password}
                  helpText="Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                />
                <FormField
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={(v) => handleChange("confirmPassword", v)}
                  error={errors.confirmPassword}
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-border bg-card px-6 py-4 shadow-lg">
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            {mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        open={cancelDialogOpen}
        onOpenChange={setCancelDialogOpen}
        title="Xác nhận hủy bỏ"
        description="Bạn có chắc chắn muốn hủy bỏ? Mọi thay đổi chưa lưu sẽ bị mất."
        confirmText="Hủy bỏ"
        cancelText="Tiếp tục chỉnh sửa"
        variant="warning"
        icon="warning"
        onConfirm={onBack}
      />
    </div>
  )
}
