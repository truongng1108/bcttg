"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Music } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SongsService } from "@/lib/services/songs.service"
import { SongCategoriesService } from "@/lib/services/song-categories.service"
import type { Song, SongCategory } from "@/lib/types/api"
import { toast } from "sonner"
import { StatusPage } from "@/components/shared/status-page"
import { PublicListShell } from "@/components/public/shared/public-list-shell"

export function PublicSongsList() {
  const router = useRouter()
  const [songs, setSongs] = useState<Song[]>([])
  const [categories, setCategories] = useState<SongCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    SongCategoriesService.getAllPublic({ page_size: 200 })
      .then((res) => {
        setCategories(res.data)
      })
      .catch(() => {
        setCategories([])
      })
  }, [])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params: Record<string, string | number | boolean | null | undefined> = {
          page: currentPage,
          page_size: 20,
          sort: "createdAt",
          order: "desc",
        }
        if (searchQuery) params.q = searchQuery
        if (categoryId !== "all") params.category_id = Number(categoryId)
        const res = await SongsService.getAllPublic(params)
        setSongs(res.data)
        if (res.meta) {
          setTotalPages(res.meta.total_pages)
        } else {
          setTotalPages(1)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không tải được danh sách bài hát"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [categoryId, currentPage, searchQuery])

  const categoryOptions = useMemo(() => {
    const options = [{ value: "all", label: "Tất cả danh mục" }]
    const mapped = categories.map((c) => ({ value: String(c.id), label: c.name }))
    return [...options, ...mapped]
  }, [categories])

  if (error && !isLoading) {
    return (
      <StatusPage
        code="500"
        title="Đã xảy ra lỗi"
        description={error}
        primaryAction={{ label: "Về trang chủ", href: "/" }}
        secondaryAction={{ label: "Thử lại", href: "/ca-khuc" }}
      />
    )
  }

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return ""
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  return (
    <PublicListShell
      title="Ca khúc truyền thống"
      description="Danh sách bài hát công khai"
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
      onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      controls={
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài hát..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[260px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {songs.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Không có bài hát phù hợp</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {songs.map((song) => (
            <Card
              key={song.id}
              className="cursor-pointer border-border bg-card transition-shadow hover:shadow-md"
              onClick={() => router.push(`/ca-khuc/${song.id}`)}
            >
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Music className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-foreground">{song.title}</div>
                  {song.lyric && (
                    <div className="truncate text-sm text-muted-foreground">{song.lyric}</div>
                  )}
                </div>
                <div className="shrink-0 text-xs text-muted-foreground">
                  {formatDuration(song.durationSec)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </PublicListShell>
  )
}


