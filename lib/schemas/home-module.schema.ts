import { z } from "zod"

export const HomeModuleEditFormSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên module"),
  description: z.string().optional().or(z.literal("")),
  order: z.string().optional().or(z.literal("")),
})

export type HomeModuleEditFormData = z.infer<typeof HomeModuleEditFormSchema>

