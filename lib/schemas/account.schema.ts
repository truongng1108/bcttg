import { z } from "zod"

export const AccountStatusSchema = z.enum([
  "active",
  "inactive",
  "locked",
  "pending",
  "hidden",
])

export const AccountEntitySchema = z.object({
  id: z.string().min(1),
  rank: z.string().min(1),
  fullName: z.string().min(1),
  username: z.string().min(1),
  unit: z.string().min(1),
  role: z.string().min(1),
  status: AccountStatusSchema,
  lastLogin: z.string(),
  createdAt: z.string(),
})

export const AccountBaseFormSchema = z.object({
  rank: z.string().min(1, "Vui lòng chọn cấp bậc"),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  email: z
    .string()
    .email("Email không hợp lệ")
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
  role: z.string().min(1, "Vui lòng chọn vai trò"),
  status: AccountStatusSchema.default("active"),
})

export const AccountFormSchema = AccountBaseFormSchema.extend({
  password: z.string().optional().or(z.literal("")),
  confirmPassword: z.string().optional().or(z.literal("")),
})

export const AccountCreateFormSchema = AccountBaseFormSchema.extend({
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  confirmPassword: z.string().min(1, "Vui lòng nhập mật khẩu xác nhận"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
})

export const AccountUpdateFormSchema = AccountFormSchema

export type AccountEntity = z.infer<typeof AccountEntitySchema>
export type AccountCreateFormData = z.infer<typeof AccountCreateFormSchema>
export type AccountUpdateFormData = z.infer<typeof AccountUpdateFormSchema>
export type AccountFormData = z.infer<typeof AccountFormSchema>

