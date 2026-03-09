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

export const SongAudioPayloadSchema = z
  .object({
    audioMediaId: z.number().int().nullable(),
    audioUrl: z.string().nullable(),
  })
  .refine(
    (data) => {
      const hasMedia = data.audioMediaId != null && data.audioMediaId > 0
      const hasUrl = data.audioUrl != null && data.audioUrl.trim() !== ""
      return (hasMedia && !hasUrl) || (!hasMedia && hasUrl)
    },
    { message: "Chỉ được cung cấp đúng một trong hai: audioMediaId hoặc audioUrl" }
  )

export type SongEntity = z.infer<typeof SongEntitySchema>
export type SongCreateFormData = z.infer<typeof SongCreateFormSchema>
export type SongAudioPayload = z.infer<typeof SongAudioPayloadSchema>

