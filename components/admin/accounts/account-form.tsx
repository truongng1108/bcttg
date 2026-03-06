"use client"

import { useEffect, useState } from "react"
import { Save, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { useForm } from "react-hook-form"
import type { UserAccount } from "@/lib/types/api"
import { AccountsService } from "@/lib/services/accounts.service"
import { toast } from "sonner"
import { isValidPasswordPolicy } from "@/lib/utils/password-policy"
import { isValidPhone, normalizePhone } from "@/lib/utils/validators"

interface AccountFormData {
  phone: string
  password?: string
  confirmPassword?: string
  role: "ADMIN" | "MANAGER" | "USER"
  isActive: boolean
  profile: {
    fullName: string
    position?: string
    unitName?: string
    rankName?: string
    email?: string
    address?: string
    birthDate?: string
  }
}

interface AccountFormProps {
  readonly mode: "create" | "edit"
  readonly initialData?: UserAccount
  readonly onBack: () => void
  readonly onSave?: () => void
}

const roleOptions = [
  { value: "ADMIN", label: "Quản trị viên" },
  { value: "MANAGER", label: "Quản lý" },
  { value: "USER", label: "Người dùng" },
]

export function AccountForm({
  mode,
  initialData,
  onBack,
  onSave,
}: AccountFormProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [isMutating, setIsMutating] = useState(false)

  const form = useForm<AccountFormData>({
    defaultValues: {
      phone: initialData?.phone ?? "",
      password: "",
      confirmPassword: "",
      role: initialData?.role ?? "USER",
      isActive: initialData?.isActive ?? true,
      profile: {
        fullName: initialData?.profile?.fullName ?? "",
        position: initialData?.profile?.position ?? "",
        unitName: initialData?.profile?.unitName ?? "",
        rankName: initialData?.profile?.rankName ?? "",
        email: initialData?.profile?.email ?? "",
        address: initialData?.profile?.address ?? "",
        birthDate: initialData?.profile?.birthDate ?? "",
      },
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        phone: initialData.phone,
        role: initialData.role,
        isActive: initialData.isActive,
        profile: {
          fullName: initialData.profile?.fullName ?? "",
          position: initialData.profile?.position ?? "",
          unitName: initialData.profile?.unitName ?? "",
          rankName: initialData.profile?.rankName ?? "",
          email: initialData.profile?.email ?? "",
          address: initialData.profile?.address ?? "",
          birthDate: initialData.profile?.birthDate ?? "",
        },
      })
    }
  }, [form, initialData])

  const normalizeProfilePayload = (values: AccountFormData["profile"]) => ({
    fullName: values.fullName,
    position: values.position || null,
    unitName: values.unitName || null,
    rankName: values.rankName || null,
    email: values.email || null,
    address: values.address || null,
    birthDate: values.birthDate || null,
  })

  const getCreateValidationMessage = (values: AccountFormData): string | null => {
    if (!values.password) return "Vui lòng nhập mật khẩu"
    if (!isValidPasswordPolicy(values.password)) {
      return "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số"
    }
    if (values.password !== values.confirmPassword) return "Mật khẩu xác nhận không khớp"
    if (!values.profile.fullName) return "Vui lòng nhập họ và tên"
    return null
  }

  const onSubmit = async (values: AccountFormData) => {
    if (isMutating) return
    const normalizedPhone = normalizePhone(values.phone)

    if (!isValidPhone(normalizedPhone)) {
      toast.error("Số điện thoại phải có 8-15 chữ số")
      return
    }

    if (mode === "create") {
      const message = getCreateValidationMessage(values)
      if (message) {
        toast.error(message)
        return
      }
    }

    setIsMutating(true)
    try {
      if (mode === "create") {
        const createData = {
          phone: normalizedPhone,
          password: values.password || "",
          role: values.role,
          isActive: values.isActive,
          profile: normalizeProfilePayload(values.profile),
        }
        await AccountsService.create(createData)
        toast.success("Đã tạo tài khoản")
      } else if (initialData) {
        await AccountsService.update(initialData.id, {
          phone: values.phone,
          role: values.role,
          isActive: values.isActive,
          profile: normalizeProfilePayload(values.profile),
        })
        toast.success("Đã cập nhật tài khoản")
      }
      onSave?.()
      onBack()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thao tác thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleCancel = () => {
    if (form.formState.isDirty) {
      setCancelDialogOpen(true)
      return
    }
    onBack()
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
          {/* Row 1: Phone & Full Name */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Số điện thoại"
              name="phone"
              type="tel"
              required
              placeholder="Nhập số điện thoại (8-15 chữ số)"
              control={form.control}
              disabled={mode === "edit"}
            />
            <FormFieldRHF
              label="Họ và tên"
              name="profile.fullName"
              required
              placeholder="Nhập họ và tên đầy đủ"
              control={form.control}
            />
          </div>

          {/* Row 2: Rank & Position */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Cấp bậc"
              name="profile.rankName"
              placeholder="Nhập cấp bậc"
              control={form.control}
            />
            <FormFieldRHF
              label="Chức vụ"
              name="profile.position"
              placeholder="Nhập chức vụ"
              control={form.control}
            />
          </div>

          {/* Row 3: Unit & Email */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Đơn vị"
              name="profile.unitName"
              placeholder="Nhập đơn vị"
              control={form.control}
            />
            <FormFieldRHF
              label="Email"
              name="profile.email"
              type="email"
              placeholder="Nhập địa chỉ email"
              control={form.control}
            />
          </div>

          {/* Row 4: Address & Birth Date */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Địa chỉ"
              name="profile.address"
              placeholder="Nhập địa chỉ"
              control={form.control}
            />
            <FormFieldRHF
              label="Ngày sinh"
              name="profile.birthDate"
              type="text"
              placeholder="YYYY-MM-DD"
              control={form.control}
            />
          </div>

          {/* Row 5: Role & Status */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Vai trò"
              name="role"
              type="select"
              required
              control={form.control}
              options={roleOptions}
            />
            <FormFieldRHF
              label="Trạng thái"
              name="isActive"
              type="switch"
              control={form.control}
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
                <FormFieldRHF
                  label="Mật khẩu"
                  name="password"
                  type="password"
                  required
                  placeholder="Nhập mật khẩu"
                  control={form.control}
                  helpText="Tối thiểu 8 ký tự, bao gồm chữ hoa, chữ thường và số"
                />
                <FormFieldRHF
                  label="Xác nhận mật khẩu"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu"
                  control={form.control}
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
            onClick={form.handleSubmit(onSubmit)}
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
