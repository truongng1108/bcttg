import { z } from "zod"

export const SongCategoryFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  slug: z.string().min(1, "Vui lòng nhập slug"),
  description: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
})

export type SongCategoryFormData = z.infer<typeof SongCategoryFormSchema>

