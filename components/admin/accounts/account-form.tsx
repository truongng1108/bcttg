"use client"

import { useEffect, useState } from "react"
import { Save, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "../shared/form-field-rhf"
import { ConfirmDialog } from "../shared/confirm-dialog"
import { rankOptions, unitOptions, roleOptions, statusOptions } from "@/lib/data/mock/options"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  AccountCreateFormSchema,
  AccountUpdateFormSchema,
  type AccountCreateFormData,
  type AccountFormData,
  type AccountUpdateFormData,
} from "@/lib/schemas/account.schema"

interface AccountFormProps {
  readonly mode: "create" | "edit"
  readonly initialData?: Partial<AccountFormData>
  readonly onBack: () => void
  readonly onSave: (data: AccountCreateFormData | AccountUpdateFormData) => void
}

export function AccountForm({
  mode,
  initialData,
  onBack,
  onSave,
}: AccountFormProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const form = useForm<AccountFormData>({
    resolver: zodResolver(
      mode === "create" ? AccountCreateFormSchema : AccountUpdateFormSchema
    ),
    defaultValues: {
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
    },
  })

  useEffect(() => {
    form.reset({
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
  }, [form, initialData])

  const onSubmit = (values: AccountFormData) => {
    if (mode === "create") {
      const parsed = AccountCreateFormSchema.parse(values)
      onSave(parsed)
      return
    }
    const parsed = AccountUpdateFormSchema.parse(values)
    onSave(parsed)
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
          {/* Row 1: Rank & Full Name */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Cấp bậc"
              name="rank"
              type="select"
              required
              control={form.control}
              options={rankOptions}
            />
            <FormFieldRHF
              label="Họ và tên"
              name="fullName"
              required
              placeholder="Nhập họ và tên đầy đủ"
              control={form.control}
            />
          </div>

          {/* Row 2: Username & Email */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Tên đăng nhập"
              name="username"
              required
              placeholder="Nhập tên đăng nhập"
              control={form.control}
              helpText="Chỉ sử dụng chữ cái, số và dấu gạch dưới"
              disabled={mode === "edit"}
            />
            <FormFieldRHF
              label="Email"
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email"
              control={form.control}
            />
          </div>

          {/* Row 3: Phone & Unit */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormFieldRHF
              label="Số điện thoại"
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              control={form.control}
            />
            <FormFieldRHF
              label="Đơn vị"
              name="unit"
              type="select"
              required
              control={form.control}
              options={unitOptions}
            />
          </div>

          {/* Row 4: Role & Status */}
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
              name="status"
              type="select"
              required
              control={form.control}
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
