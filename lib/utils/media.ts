import type { MediaAsset } from "@/lib/types/api"

type MediaLike = MediaAsset & Record<string, string | number | undefined>

export function getMediaUrl(media: MediaAsset | null): string | null {
  if (!media) return null
  const m = media as MediaLike
  const direct =
    (typeof m.url === "string" && m.url.length > 0 ? m.url : null) ??
    (typeof m["url"] === "string" && m["url"].length > 0 ? m["url"] : null)
  if (direct) return direct
  const key =
    (typeof m.storageKey === "string" && m.storageKey.length > 0 ? m.storageKey : null) ??
    (typeof m["storage_key"] === "string" && m["storage_key"].length > 0 ? m["storage_key"] : null)
  if (!key) return null
  const baseUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech").replace(
    /\/$/,
    ""
  )
  return `${baseUrl}/files/${key}`
}

