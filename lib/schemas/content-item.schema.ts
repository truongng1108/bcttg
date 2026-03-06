import { z } from "zod"

export const ContentItemFormSchema = z.object({
  categoryId: z.coerce.number().int().min(1, "Vui lòng chọn danh mục"),
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  summary: z.string().optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  coverMediaId: z.number().nullable().optional(),
  isVisible: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).default(0),
  publishedAt: z.string().optional().nullable(),
})

export type ContentItemFormData = z.infer<typeof ContentItemFormSchema>

