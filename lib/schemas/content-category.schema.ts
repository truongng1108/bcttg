import { z } from "zod"

export const ContentCategoryFormInputSchema = z.object({
  type: z.string().min(1, "Vui lòng chọn loại danh mục"),
  parentId: z.string(),
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  slug: z.string().min(1, "Vui lòng nhập slug"),
  description: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
})

export const ContentCategoryFormSchema = ContentCategoryFormInputSchema.transform((data) => ({
  ...data,
  parentId: data.parentId === "" ? null : Number(data.parentId),
}))

export type ContentCategoryFormInput = z.infer<typeof ContentCategoryFormInputSchema>
export type ContentCategoryFormData = z.infer<typeof ContentCategoryFormSchema>

