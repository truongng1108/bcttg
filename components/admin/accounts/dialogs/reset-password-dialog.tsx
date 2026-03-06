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
import { isValidPasswordPolicy } from "@/lib/utils/password-policy"

const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(1, "Vui lòng nhập mật khẩu mới"),
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .superRefine((val, ctx) => {
    if (!isValidPasswordPolicy(val.newPassword)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu phải >= 8 ký tự, có chữ hoa, chữ thường và số",
        path: ["newPassword"],
      })
    }
    if (val.newPassword !== val.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Mật khẩu nhập lại không khớp",
        path: ["confirmPassword"],
      })
    }
  })

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>

interface ResetPasswordDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly isMutating: boolean
  readonly onConfirm: (newPassword: string) => Promise<void>
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  isMutating,
  onConfirm,
}: ResetPasswordDialogProps) {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onChange",
  })

  useEffect(() => {
    if (open) {
      form.reset({ newPassword: "", confirmPassword: "" })
    }
  }, [form, open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cấp lại mật khẩu</DialogTitle>
          <DialogDescription>Thiết lập mật khẩu mới cho tài khoản</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(async (values) => {
            await onConfirm(values.newPassword)
            onOpenChange(false)
          })}
          className="space-y-4"
        >
          <FormFieldRHF
            control={form.control}
            name="newPassword"
            label="Mật khẩu mới"
            type="password"
            required
          />
          <FormFieldRHF
            control={form.control}
            name="confirmPassword"
            label="Nhập lại mật khẩu"
            type="password"
            required
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


