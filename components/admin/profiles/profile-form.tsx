"use client"

import { useEffect, useState } from "react"
import { Save, X, ArrowLeft, Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "../shared/form-field-rhf"
import { ConfirmDialog } from "../shared/confirm-dialog"
import { rankOptions, unitOptions } from "@/lib/data/mock/options"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { ProfileFormSchema, type ProfileFormData } from "@/lib/schemas/profile.schema"

interface ProfileFormProps {
  readonly mode: "create" | "edit"
  readonly profileType: "thu-truong" | "chien-si" | "anh-hung"
  readonly initialData?: Partial<ProfileFormData>
  readonly onBack: () => void
  readonly onSave: (data: ProfileFormData) => void
}

const profileTypeLabels = {
  "thu-truong": "Thủ trưởng",
  "chien-si": "Chiến sĩ",
  "anh-hung": "Anh hùng",
}

export function ProfileForm({
  mode,
  profileType,
  initialData,
  onBack,
  onSave,
}: ProfileFormProps) {
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      rank: initialData?.rank ?? "",
      fullName: initialData?.fullName ?? "",
      birthDate: initialData?.birthDate ?? "",
      birthPlace: initialData?.birthPlace ?? "",
      joinDate: initialData?.joinDate ?? "",
      position: initialData?.position ?? "",
      unit: initialData?.unit ?? "",
      achievements: initialData?.achievements ?? "",
      biography: initialData?.biography ?? "",
      avatar: null,
      publicationStatus: initialData?.publicationStatus ?? "draft",
    },
  })

  useEffect(() => {
    form.reset({
      rank: initialData?.rank ?? "",
      fullName: initialData?.fullName ?? "",
      birthDate: initialData?.birthDate ?? "",
      birthPlace: initialData?.birthPlace ?? "",
      joinDate: initialData?.joinDate ?? "",
      position: initialData?.position ?? "",
      unit: initialData?.unit ?? "",
      achievements: initialData?.achievements ?? "",
      biography: initialData?.biography ?? "",
      avatar: null,
      publicationStatus: initialData?.publicationStatus ?? "draft",
    })
  }, [form, initialData])

  const avatarFile = form.watch("avatar")

  useEffect(() => {
    if (!(avatarFile instanceof File)) {
      setPreviewImage(null)
      return
    }
    const url = URL.createObjectURL(avatarFile)
    setPreviewImage(url)
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [avatarFile])

  const onSubmit = (values: ProfileFormData) => {
    const parsed = ProfileFormSchema.parse(values)
    onSave(parsed)
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
            {mode === "create"
              ? `Thêm hồ sơ ${profileTypeLabels[profileType]}`
              : `Chỉnh sửa hồ sơ ${profileTypeLabels[profileType]}`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "create"
              ? "Tạo hồ sơ mới trong danh mục dữ liệu"
              : "Cập nhật thông tin hồ sơ"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Basic Information Card */}
          <div className="rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Thông tin cơ bản
              </h2>
            </div>

            <div className="space-y-6 p-6">
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

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormFieldRHF
                  label="Ngày sinh"
                  name="birthDate"
                  required
                  placeholder="DD/MM/YYYY"
                  control={form.control}
                />
                <FormFieldRHF
                  label="Quê quán"
                  name="birthPlace"
                  placeholder="Nhập quê quán"
                  control={form.control}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormFieldRHF
                  label="Ngày nhập ngũ"
                  name="joinDate"
                  placeholder="DD/MM/YYYY"
                  control={form.control}
                />
                <FormFieldRHF
                  label="Chức vụ"
                  name="position"
                  placeholder="Nhập chức vụ"
                  control={form.control}
                />
              </div>

              <FormFieldRHF
                label="Đơn vị"
                name="unit"
                type="select"
                required
                control={form.control}
                options={unitOptions}
              />
            </div>
          </div>

          {/* Biography Card */}
          <div className="rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Tiểu sử & Thành tích
              </h2>
            </div>

            <div className="space-y-6 p-6">
              <FormFieldRHF
                label="Thành tích nổi bật"
                name="achievements"
                type="textarea"
                placeholder="Nhập các thành tích nổi bật..."
                control={form.control}
                rows={4}
              />
              <FormFieldRHF
                label="Tiểu sử"
                name="biography"
                type="textarea"
                placeholder="Nhập tiểu sử chi tiết..."
                control={form.control}
                rows={8}
              />
            </div>
          </div>
        </div>

        {/* Sidebar - Image Upload */}
        <div className="space-y-6">
          <div className="rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Ảnh chân dung
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-48 w-36 items-center justify-center overflow-hidden rounded border border-border bg-muted">
                  {previewImage ? (
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-muted-foreground" />
                  )}
                </div>

                <Controller
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onBlur={field.onBlur}
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null
                          field.onChange(file)
                        }}
                      />
                      <span className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                        <Upload className="h-4 w-4" />
                        Tải ảnh lên
                      </span>
                    </label>
                  )}
                />

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Định dạng: JPG, PNG
                  <br />
                  Kích thước tối đa: 2MB
                  <br />
                  Tỷ lệ: 3:4
                </p>
              </div>
            </div>
          </div>

          {/* Publication Status */}
          <div className="rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Trạng thái xuất bản
              </h2>
            </div>

            <div className="p-6">
              <FormFieldRHF
                label="Trạng thái"
                name="publicationStatus"
                type="select"
                control={form.control}
                options={[
                  { value: "draft", label: "Bản nháp" },
                  { value: "pending", label: "Chờ duyệt" },
                  { value: "published", label: "Đã xuất bản" },
                  { value: "hidden", label: "Đã ẩn" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="sticky bottom-0 -mx-6 -mb-6 border-t border-border bg-card px-6 py-4 shadow-lg">
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              if (form.formState.isDirty) {
                setCancelDialogOpen(true)
                return
              }
              onBack()
            }}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Hủy bỏ
          </Button>
          <Button variant="outline" className="gap-2 bg-transparent">
            Lưu bản nháp
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            {mode === "create" ? "Tạo hồ sơ" : "Lưu thay đổi"}
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
