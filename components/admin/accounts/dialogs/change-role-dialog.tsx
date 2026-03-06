"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"

const ChangeRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "USER"], {
    required_error: "Vui lòng chọn vai trò",
  }),
})

type ChangeRoleFormData = z.infer<typeof ChangeRoleSchema>

interface ChangeRoleDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly currentRole: "ADMIN" | "MANAGER" | "USER"
  readonly isMutating: boolean
  readonly onConfirm: (role: "ADMIN" | "MANAGER" | "USER") => Promise<void>
}

export function ChangeRoleDialog({
  open,
  onOpenChange,
  currentRole,
  isMutating,
  onConfirm,
}: ChangeRoleDialogProps) {
  const form = useForm<ChangeRoleFormData>({
    resolver: zodResolver(ChangeRoleSchema),
    defaultValues: { role: currentRole },
    mode: "onChange",
  })

  useEffect(() => {
    if (open) {
      form.reset({ role: currentRole })
    }
  }, [currentRole, form, open])

  const roleOptions = [
    { value: "ADMIN", label: "Quản trị viên" },
    { value: "MANAGER", label: "Quản lý" },
    { value: "USER", label: "Người dùng" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi vai trò</DialogTitle>
          <DialogDescription>Chọn vai trò mới cho tài khoản</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onConfirm(values.role)
            onOpenChange(false)
          })}
          className="space-y-4"
        >
          <FormFieldRHF
            control={form.control}
            name="role"
            label="Vai trò"
            type="select"
            required
            options={roleOptions}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isMutating}>
              Hủy
            </Button>
            <Button type="submit" disabled={isMutating || !form.formState.isValid}>
              {isMutating ? "Đang lưu..." : "Lưu"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


