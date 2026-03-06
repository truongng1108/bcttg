"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { SongsService } from "@/lib/services/songs.service"
import { SongCategoriesService } from "@/lib/services/song-categories.service"
import { MediaService } from "@/lib/services/media.service"
import type { Song, SongCategory, MediaAsset } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"
import { getMediaUrl } from "@/lib/utils/media"
import { formatDuration } from "@/lib/utils/formatters"

interface SongDetailProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly songId: number | null
}

export function SongDetail({ open, onOpenChange, songId }: SongDetailProps) {
  const [loading, setLoading] = useState(false)
  const [song, setSong] = useState<Song | null>(null)
  const [category, setCategory] = useState<SongCategory | null>(null)
  const [audioMedia, setAudioMedia] = useState<MediaAsset | null>(null)

  useEffect(() => {
    if (open && songId) {
      loadDetail()
    } else {
      setSong(null)
      setCategory(null)
      setAudioMedia(null)
    }
  }, [open, songId])

  const loadDetail = async () => {
    if (!songId) return
    setLoading(true)
    try {
      const songData = await SongsService.getByIdAdmin(songId)
      setSong(songData)

      // Use audioMedia from response if available, otherwise load separately
      if (songData.audioMedia) {
        setAudioMedia(songData.audioMedia)
      } else if (songData.audioMediaId) {
        try {
          const media = await MediaService.getById(songData.audioMediaId)
          setAudioMedia(media)
        } catch {
          // Media might not exist
        }
      }

      // Load category
      try {
        const cat = await SongCategoriesService.getByIdAdmin(songData.categoryId)
        setCategory(cat)
      } catch {
        // Category might not exist
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin ca khúc")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết ca khúc</DialogTitle>
          <DialogDescription>Thông tin đầy đủ về ca khúc</DialogDescription>
        </DialogHeader>

        {loading && <AdminLoadingState />}

        {!loading && song && (
          <div className="space-y-6">
            {/* Thông tin cơ bản */}
            <DetailSection title="Thông tin cơ bản">
              <DetailRow label="Tiêu đề" value={song.title} />
              <DetailRow label="Danh mục" value={category?.name || "—"} />
              <DetailRow label="Trạng thái" value={song.isVisible ? "Đang hiển thị" : "Đã ẩn"} />
              <DetailRow label="Thứ tự sắp xếp" value={song.sortOrder} />
              <DetailRow label="Thời lượng" value={formatDuration(song.durationSec)} />
            </DetailSection>

            {/* File audio */}
            {audioMedia && (
              <DetailSection title="File audio">
                <div className="py-3 space-y-2">
                  <DetailRow label="Tên file" value={audioMedia.fileName || "—"} />
                  <DetailRow label="URL" value={getMediaUrl(audioMedia) || "—"} copyable />
                  <DetailRow label="MIME Type" value={audioMedia.mimeType || "—"} />
                  <DetailRow
                    label="Kích thước"
                    value={
                      audioMedia.sizeBytes
                        ? `${(audioMedia.sizeBytes / 1024 / 1024).toFixed(2)} MB`
                        : "—"
                    }
                  />
                  {(song.audioUrl || getMediaUrl(audioMedia)) && (
                    <div className="pt-2">
                      <audio controls className="w-full">
                        <source
                          src={song.audioUrl || getMediaUrl(audioMedia) || ""}
                          type={audioMedia.mimeType || "audio/mpeg"}
                        />
                        <track kind="captions" />
                        Trình duyệt của bạn không hỗ trợ phát audio.
                      </audio>
                    </div>
                  )}
                </div>
              </DetailSection>
            )}

            {/* Lời bài hát */}
            {song.lyric && (
              <DetailSection title="Lời bài hát">
                <div className="py-3">
                  <pre className="whitespace-pre-wrap text-sm font-mono bg-background p-4 rounded border">
                    {song.lyric}
                  </pre>
                </div>
              </DetailSection>
            )}

            {/* Thông tin thời gian */}
            <DetailSection title="Thông tin thời gian">
              <DetailRow label="Ngày tạo" value={formatDateDetail(song.createdAt)} />
              <DetailRow label="Ngày cập nhật" value={formatDateDetail(song.updatedAt)} />
            </DetailSection>

            {/* Thông tin kỹ thuật */}
            <DetailSection title="Thông tin kỹ thuật">
              <DetailRow label="ID" value={song.id} copyable />
              <DetailRow label="Category ID" value={song.categoryId} copyable />
              {song.audioMediaId && (
                <DetailRow label="Audio Media ID" value={song.audioMediaId} copyable />
              )}
            </DetailSection>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

