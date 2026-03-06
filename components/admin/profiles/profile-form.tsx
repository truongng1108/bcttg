"use client"

import { useEffect, useState } from "react"
import { Save, X, ArrowLeft, Upload, ImageIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { Controller, useForm } from "react-hook-form"
import type { DataProfile } from "@/lib/types/api"
import { DataProfilesService } from "@/lib/services/data-profiles.service"
import { MediaService } from "@/lib/services/media.service"
import { toast } from "sonner"
import { PROFILE_TYPE_LABELS } from "@/lib/constants/profile-types"

interface ProfileFormData {
  fullName: string
  position?: string
  unitName?: string
  rankName?: string
  heroTitle?: string
  contactPhone?: string
  birthDate?: string
  hometown?: string
  summary?: string
  biography?: string
  achievements?: string
  avatar?: File | null
  isVisible: boolean
}

interface ProfileFormProps {
  readonly mode: "create" | "edit"
  readonly profileType: "THU_TRUONG" | "CHIEN_SI" | "ANH_HUNG"
  readonly initialData?: DataProfile
  readonly onBack: () => void
  readonly onSave?: () => void
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
  const [isMutating, setIsMutating] = useState(false)
  const [deleteAvatarDialogOpen, setDeleteAvatarDialogOpen] = useState(false)
  const [pendingDeleteAvatarMediaId, setPendingDeleteAvatarMediaId] = useState<number | null>(null)
  const [removeAvatarRequested, setRemoveAvatarRequested] = useState(false)

  const form = useForm<ProfileFormData>({
    defaultValues: {
      fullName: initialData?.fullName ?? "",
      position: initialData?.position ?? "",
      unitName: initialData?.unitName ?? "",
      rankName: initialData?.rankName ?? "",
      heroTitle: initialData?.heroTitle ?? "",
      contactPhone: initialData?.contactPhone ?? "",
      birthDate: initialData?.birthDate ?? "",
      hometown: initialData?.hometown ?? "",
      summary: initialData?.summary ?? "",
      biography: initialData?.biography ?? "",
      achievements: initialData?.achievements ?? "",
      avatar: null,
      isVisible: initialData?.isVisible ?? true,
    },
  })

  useEffect(() => {
    if (initialData) {
      form.reset({
        fullName: initialData.fullName,
        position: initialData.position ?? "",
        unitName: initialData.unitName ?? "",
        rankName: initialData.rankName ?? "",
        heroTitle: initialData.heroTitle ?? "",
        contactPhone: initialData.contactPhone ?? "",
        birthDate: initialData.birthDate ?? "",
        hometown: initialData.hometown ?? "",
        summary: initialData.summary ?? "",
        biography: initialData.biography ?? "",
        achievements: initialData.achievements ?? "",
        avatar: null,
        isVisible: initialData.isVisible,
      })
      if (initialData.avatarMediaId) {
        setPreviewImage(null)
      }
    }
  }, [form, initialData])

  const avatarFile = form.watch("avatar")

  useEffect(() => {
    setPendingDeleteAvatarMediaId(null)
    setRemoveAvatarRequested(false)
  }, [initialData?.avatarMediaId, mode])

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

  const onSubmit = async (values: ProfileFormData) => {
    if (isMutating) return
    if (!values.fullName) {
      toast.error("Vui lòng nhập họ và tên")
      return
    }

    const resolveAvatarMediaId = async (): Promise<number | null> => {
      if (removeAvatarRequested) {
        return null
      }
      if (values.avatar instanceof File) {
        const media = await MediaService.upload(values.avatar)
        return media.id
      }
      return initialData?.avatarMediaId || null
    }

    const saveProfile = async (profileData: Partial<DataProfile>) => {
      if (mode === "create") {
        await DataProfilesService.create(profileData)
        toast.success("Đã tạo hồ sơ")
        return
      }
      if (initialData) {
        await DataProfilesService.update(initialData.id, profileData)
        toast.success("Đã cập nhật hồ sơ")
      }
    }

    const deletePendingAvatar = async (nextAvatarMediaId: number | null) => {
      if (pendingDeleteAvatarMediaId && pendingDeleteAvatarMediaId !== nextAvatarMediaId) {
        try {
          await MediaService.delete(pendingDeleteAvatarMediaId)
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Xóa file ảnh chân dung thất bại")
        }
      }
    }

    setIsMutating(true)
    try {
      const avatarMediaId = await resolveAvatarMediaId()

      const profileData: Partial<DataProfile> = {
        profileType,
        fullName: values.fullName,
        position: values.position || null,
        unitName: values.unitName || null,
        rankName: values.rankName || null,
        heroTitle: values.heroTitle || null,
        contactPhone: values.contactPhone || null,
        birthDate: values.birthDate || null,
        hometown: values.hometown || null,
        summary: values.summary || null,
        biography: values.biography || null,
        achievements: values.achievements || null,
        avatarMediaId,
        isVisible: values.isVisible,
        sortOrder: initialData?.sortOrder || 0,
      }

      await saveProfile(profileData)
      await deletePendingAvatar(avatarMediaId)

      onSave?.()
      onBack()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thao tác thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const confirmDeleteAvatar = async () => {
    const currentId = initialData?.avatarMediaId || null
    if (!currentId) return
    setPendingDeleteAvatarMediaId(currentId)
    setRemoveAvatarRequested(true)
    setPreviewImage(null)
    form.setValue("avatar", null)
    setDeleteAvatarDialogOpen(false)
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
              ? `Thêm hồ sơ ${PROFILE_TYPE_LABELS[profileType]}`
              : `Chỉnh sửa hồ sơ ${PROFILE_TYPE_LABELS[profileType]}`}
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
              <FormFieldRHF
                label="Họ và tên"
                name="fullName"
                required
                placeholder="Nhập họ và tên đầy đủ"
                control={form.control}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormFieldRHF
                  label="Cấp bậc"
                  name="rankName"
                  placeholder="Nhập cấp bậc"
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
                name="unitName"
                placeholder="Nhập đơn vị"
                control={form.control}
              />

              {profileType === "ANH_HUNG" && (
                <FormFieldRHF
                  label="Danh hiệu anh hùng"
                  name="heroTitle"
                  placeholder="Nhập danh hiệu anh hùng"
                  control={form.control}
                />
              )}

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormFieldRHF
                  label="Số điện thoại"
                  name="contactPhone"
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  control={form.control}
                />
                <FormFieldRHF
                  label="Ngày sinh"
                  name="birthDate"
                  type="date"
                  placeholder="Chọn ngày sinh"
                  control={form.control}
                />
              </div>

              <FormFieldRHF
                label="Quê quán"
                name="hometown"
                placeholder="Nhập quê quán"
                control={form.control}
              />

              <FormFieldRHF
                label="Tóm tắt"
                name="summary"
                type="textarea"
                placeholder="Nhập tóm tắt về người này..."
                control={form.control}
                rows={3}
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
                label="Tiểu sử"
                name="biography"
                type="textarea"
                placeholder="Nhập tiểu sử chi tiết (HTML được hỗ trợ)..."
                control={form.control}
                rows={6}
              />
              <FormFieldRHF
                label="Thành tích"
                name="achievements"
                type="textarea"
                placeholder="Nhập các thành tích nổi bật (HTML được hỗ trợ)..."
                control={form.control}
                rows={6}
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
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onBlur={field.onBlur}
                          onChange={(e) => {
                            const file = e.target.files?.[0] ?? null
                            field.onChange(file)
                            setRemoveAvatarRequested(false)
                            setPendingDeleteAvatarMediaId(null)
                          }}
                        />
                        <span className="inline-flex items-center gap-2 rounded border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                          <Upload className="h-4 w-4" />
                          Tải ảnh lên
                        </span>
                      </label>
                      {mode === "edit" && initialData?.avatarMediaId && !removeAvatarRequested && (
                        <Button
                          type="button"
                          variant="outline"
                          className="gap-2 bg-transparent"
                          onClick={() => setDeleteAvatarDialogOpen(true)}
                          disabled={isMutating}
                        >
                          <Trash2 className="h-4 w-4" />
                          Xóa ảnh
                        </Button>
                      )}
                    </div>
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

          {/* Visibility Status */}
          <div className="rounded-md border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold text-foreground">
                Trạng thái hiển thị
              </h2>
            </div>

            <div className="p-6">
              <FormFieldRHF
                label="Hiển thị công khai"
                name="isVisible"
                type="switch"
                control={form.control}
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

      <ConfirmDialog
        open={deleteAvatarDialogOpen}
        onOpenChange={setDeleteAvatarDialogOpen}
        title="Xác nhận xóa ảnh"
        description="Bạn có chắc chắn muốn xóa file ảnh chân dung khỏi hệ thống? Hành động này không thể hoàn tác."
        confirmText="Xóa file"
        cancelText="Hủy"
        variant="danger"
        icon="delete"
        onConfirm={confirmDeleteAvatar}
      />
    </div>
  )
}
