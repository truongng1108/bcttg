import { z } from "zod"

export const NoteCategorySchema = z.enum([
  "Công việc",
  "Duyệt nội dung",
  "Hệ thống",
  "Liên hệ",
  "Phản hồi",
])

export const NoteEntitySchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  content: z.string().min(1),
  category: NoteCategorySchema,
  starred: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const NoteCreateFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  category: NoteCategorySchema,
  content: z.string().min(1, "Vui lòng nhập nội dung"),
})

export const NoteUpdateFormSchema = NoteCreateFormSchema

export type NoteEntity = z.infer<typeof NoteEntitySchema>
export type NoteCreateFormData = z.infer<typeof NoteCreateFormSchema>
export type NoteUpdateFormData = z.infer<typeof NoteUpdateFormSchema>

