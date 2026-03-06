import type { MediaAsset } from "@/lib/types/api"

export function getMediaUrl(media: MediaAsset | null): string | null {
  if (!media) return null
  if (media.url) return media.url
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech"
  return `${baseUrl}/files/${media.storageKey}`
}

