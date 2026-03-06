"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Eye, Loader2, Music, Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { SongsService } from "@/lib/services/songs.service"
import { SongCategoriesService } from "@/lib/services/song-categories.service"
import { MediaService } from "@/lib/services/media.service"
import type { Song, SongCategory } from "@/lib/types/api"
import { toast } from "sonner"
import { StatusPage } from "@/components/shared/status-page"

export default function SongDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [song, setSong] = useState<Song | null>(null)
  const [category, setCategory] = useState<SongCategory | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)
  const [formattedDate, setFormattedDate] = useState<string>("")

  const songId = params?.id ? Number(params.id) : null

  useEffect(() => {
    if (!songId || isNaN(songId)) {
      setError("ID bài hát không hợp lệ")
      setIsLoading(false)
      return
    }

    const loadSong = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const songData = await SongsService.getByIdPublic(songId)
        setSong(songData)

        if (songData.categoryId) {
          try {
            const categoryData = await SongCategoriesService.getByIdPublic(
              songData.categoryId
            )
            setCategory(categoryData)
          } catch {
          }
        }

        if (songData.audioUrl) {
          setAudioUrl(songData.audioUrl)
        } else if (songData.audioMediaId) {
          try {
            const media = await MediaService.getById(songData.audioMediaId)
            if (media?.url) {
              setAudioUrl(media.url)
            } else if (media?.storageKey) {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech"
              setAudioUrl(`${baseUrl}/files/${media.storageKey}`)
            }
          } catch {
            toast.error("Không tải được file âm thanh")
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không tải được bài hát"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadSong()
  }, [songId])

  useEffect(() => {
    if (song?.createdAt) {
      setFormattedDate(
        new Date(song.createdAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      )
    } else {
      setFormattedDate("")
    }
  }, [song?.createdAt])

  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.addEventListener("ended", () => setIsPlaying(false))
      audio.addEventListener("error", () => {
        setIsPlaying(false)
        toast.error("Lỗi phát âm thanh")
      })
      setAudioElement(audio)
      return () => {
        audio.pause()
        audio.removeEventListener("ended", () => setIsPlaying(false))
        audio.removeEventListener("error", () => setIsPlaying(false))
      }
    }
    return () => {
      if (audioElement) {
        audioElement.pause()
      }
    }
  }, [audioUrl])

  const togglePlay = () => {
    if (!audioElement || !audioUrl) {
      toast.error("Không có file âm thanh")
      return
    }

    if (isPlaying) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      audioElement.play().catch(() => {
        toast.error("Không thể phát âm thanh")
        setIsPlaying(false)
      })
      setIsPlaying(true)
    }
  }

  if (isLoading) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (error || !song) {
    return (
      <StatusPage
        code="404"
        title="Không tìm thấy bài hát"
        description={error || "Bài hát không tồn tại hoặc đã bị xóa."}
        primaryAction={{ label: "Về trang chủ", href: "/" }}
        secondaryAction={{ label: "Danh sách bài hát", href: "/ca-khuc" }}
      />
    )
  }

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 sm:p-8">
            {category && (
              <div className="mb-4">
                <span className="inline-block rounded bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {category.name}
                </span>
              </div>
            )}

            <div className="mb-6 flex items-start gap-4">
              <div className="flex-1">
                <h1 className="mb-2 text-3xl font-bold text-foreground">
                  {song.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {formattedDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </div>
                  )}
                  {song.durationSec && (
                    <div className="flex items-center gap-2">
                      <Music className="h-4 w-4" />
                      <span>{formatDuration(song.durationSec)}</span>
                    </div>
                  )}
                </div>
              </div>
              {audioUrl && (
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Tạm dừng
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Phát nhạc
                    </>
                  )}
                </Button>
              )}
            </div>

            {song.lyric && (
              <div className="mb-6 rounded-lg bg-muted/50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Lời bài hát
                </h2>
                <div className="whitespace-pre-wrap text-muted-foreground">
                  {song.lyric}
                </div>
              </div>
            )}

            {!song.lyric && (
              <p className="text-muted-foreground">Lời bài hát đang được cập nhật...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

