import { z } from "zod"
import { CONTENT_TYPES } from "@/lib/constants/content-types"

export const ContentCategoryFormInputSchema = z.object({
  type: z.enum(
    [
      CONTENT_TYPES.TRUYEN_THONG,
      CONTENT_TYPES.NET_TIEU_BIEU,
      CONTENT_TYPES.SO_DO_LICH_SU,
    ],
    "Vui lòng chọn loại danh mục"
  ),
  parentId: z.string(),
  name: z.string().min(1, "Vui lòng nhập tên danh mục"),
  slug: z.string().min(1, "Vui lòng nhập slug"),
  description: z.string().optional().nullable(),
  isVisible: z.boolean().default(true),
  sortOrder: z.number().min(0).default(0),
})

export const ContentCategoryFormSchema = ContentCategoryFormInputSchema.transform((data) => ({
  ...data,
  parentId: data.parentId === "" || data.parentId === "none" ? null : Number(data.parentId),
}))

export type ContentCategoryFormInput = z.infer<typeof ContentCategoryFormInputSchema>
export type ContentCategoryFormData = z.infer<typeof ContentCategoryFormSchema>

