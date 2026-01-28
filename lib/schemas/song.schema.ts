import { z } from "zod"

export const SongStatusSchema = z.enum(["active", "hidden"])

export const SongEntitySchema = z.object({
  id: z.number().int(),
  title: z.string().min(1),
  composer: z.string().min(1),
  year: z.number().int(),
  duration: z.string(),
  category: z.object({
    value: z.string(),
    label: z.string(),
  }),
  status: SongStatusSchema,
  plays: z.number().int(),
  hasAudio: z.boolean(),
  hasLyrics: z.boolean(),
})

export const SongCreateFormSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tên ca khúc"),
  composer: z.string().min(1, "Vui lòng nhập tác giả"),
  year: z.string().optional().or(z.literal("")),
  category: z.string().optional().or(z.literal("")),
  lyrics: z.string().optional().or(z.literal("")),
  audio: z.instanceof(File).optional().nullable(),
})

export type SongEntity = z.infer<typeof SongEntitySchema>
export type SongCreateFormData = z.infer<typeof SongCreateFormSchema>

