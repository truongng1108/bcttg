import { z } from "zod"

export const ProfilePublicationStatusSchema = z.enum([
  "draft",
  "pending",
  "published",
  "hidden",
])

export const ProfileFormSchema = z.object({
  rank: z.string().min(1, "Vui lòng chọn cấp bậc"),
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  birthDate: z.string().min(1, "Vui lòng nhập ngày sinh"),
  birthPlace: z.string().optional().or(z.literal("")),
  joinDate: z.string().optional().or(z.literal("")),
  position: z.string().optional().or(z.literal("")),
  unit: z.string().min(1, "Vui lòng chọn đơn vị"),
  achievements: z.string().optional().or(z.literal("")),
  biography: z.string().optional().or(z.literal("")),
  avatar: z.instanceof(File).optional().nullable(),
  publicationStatus: ProfilePublicationStatusSchema.default("draft"),
})

export type ProfileFormData = z.infer<typeof ProfileFormSchema>

