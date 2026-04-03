"use client"

import { useEffect, useState } from "react"
import { Save, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { useForm } from "react-hook-form"
import type { UserAccount } from "@/lib/types/api"
import { AccountsService } from "@/lib/services/accounts.service"
import { toast } from "sonner"
import { isValidPasswordPolicy } from "@/lib/utils/password-policy"
import { isValidPhone, normalizePhone } from "@/lib/utils/validators"
import { ACCOUNT_FORM_ROLE_OPTIONS } from "@/lib/constants/roles"

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
    <div className="mx-auto w-full space-y-6 pb-4">
      <div className="flex items-start gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mt-0.5 h-10 w-10 shrink-0 rounded-lg border border-border/80 bg-card shadow-sm hover:bg-muted/80"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="min-w-0 space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {mode === "create" ? "Thêm tài khoản mới" : "Chỉnh sửa tài khoản"}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {mode === "create"
              ? "Tạo tài khoản người dùng mới trong hệ thống"
              : "Cập nhật thông tin tài khoản người dùng"}
          </p>
        </div>
      </div>

      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Card className="gap-0 overflow-hidden rounded-xl border-border/80 py-0 shadow-md">
          <div className="border-b border-border bg-gradient-to-r from-muted/60 to-muted/30 px-6 py-4">
            <h2 className="text-base font-semibold text-foreground">
              Thông tin cơ bản
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Thông tin đăng nhập và hồ sơ cá nhân
            </p>
          </div>

          <CardContent className="space-y-5 pt-6">
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <FormFieldRHF
                label="Địa chỉ"
                name="profile.address"
                placeholder="Nhập địa chỉ"
                control={form.control}
              />
              <FormFieldRHF
                label="Ngày sinh"
                name="profile.birthDate"
                type="date"
                placeholder="Chọn ngày sinh"
                control={form.control}
              />
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <FormFieldRHF
                label="Vai trò"
                name="role"
                type="select"
                required
                control={form.control}
                options={ACCOUNT_FORM_ROLE_OPTIONS}
              />
              <FormFieldRHF
                label="Trạng thái"
                name="isActive"
                type="switch"
                control={form.control}
              />
            </div>
          </CardContent>

          {mode === "create" && (
            <>
              <div className="border-t border-border bg-gradient-to-r from-muted/50 to-muted/20 px-6 py-4">
                <h2 className="text-base font-semibold text-foreground">
                  Mật khẩu đăng nhập
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Đặt mật khẩu cho tài khoản mới
                </p>
              </div>
              <CardContent className="space-y-5 pb-6 pt-2">
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
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
              </CardContent>
            </>
          )}

          <CardFooter className="flex flex-col-reverse gap-3 border-t border-border bg-muted/25 px-6 py-5 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-11 w-full gap-2 border-border/80 bg-background shadow-sm sm:w-auto sm:min-w-[140px]"
            >
              <X className="h-4 w-4 shrink-0" />
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={isMutating}
              className="h-11 w-full gap-2 shadow-sm sm:w-auto sm:min-w-[180px]"
            >
              <Save className="h-4 w-4 shrink-0" />
              {mode === "create" ? "Tạo tài khoản" : "Lưu thay đổi"}
            </Button>
          </CardFooter>
        </Card>
      </form>

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
