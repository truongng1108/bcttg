"use client"

import { useState, useEffect, useMemo } from "react"
import { Music, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { PageHeader } from "@/components/admin/shared/page-header"
import { filterBySearch, filterByFieldValue, filterByStatus } from "@/lib/utils/filters"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SongCreateFormSchema, type SongCreateFormData } from "@/lib/schemas/song.schema"
import type { SelectOption, Song } from "@/lib/data/types"
import { SongsService } from "@/lib/services/songs.service"
import { SongsStats } from "./songs-stats"
import { SongsFilters } from "./songs-filters"
import { SongsTable } from "./songs-table"
import { SongsPagination } from "./songs-pagination"
import { SongsAddDialog } from "./songs-add-dialog"
import { OptionsService } from "@/lib/services/options.service"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"

export function SongsContent() {
  const [songs, setSongs] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

  useEffect(() => {
    setIsLoading(true)
    SongsService.getAll()
      .then(setSongs)
      .catch(() => toast.error("Không tải được danh sách ca khúc"))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    Promise.all([
      OptionsService.getSongCategories(),
      OptionsService.getSongStatuses(),
    ]).then(([categories, statuses]) => {
      setCategoryOptions(categories)
      setStatusOptions(statuses)
    })
  }, [])

  const addForm = useForm<SongCreateFormData>({
    resolver: zodResolver(SongCreateFormSchema),
    defaultValues: {
      title: "",
      composer: "",
      year: "",
      category: "",
      lyrics: "",
      audio: null,
    },
    mode: "onChange",
  })

  const filteredSongs = useMemo(() => {
    let result = songs
    result = filterBySearch(result, searchQuery, ["title", "composer"])
    result = filterByFieldValue(result, categoryFilter, "category.value")
    result = filterByStatus(result, statusFilter, "status")
    return result
  }, [songs, searchQuery, categoryFilter, statusFilter])

  const paginatedSongs = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    const end = start + pageSize
    return filteredSongs.slice(start, end)
  }, [filteredSongs, currentPage, pageSize])

  const totalPages = Math.ceil(filteredSongs.length / pageSize)

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id)
  }

  const handleDelete = (song: Song) => {
    setSelectedSong(song)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedSong) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const ok = await SongsService.delete(selectedSong.id)
      if (ok) {
        const next = await SongsService.getAll()
        setSongs(next)
        toast.success("Đã xóa ca khúc")
      } else {
        toast.error("Không tìm thấy ca khúc để xóa")
      }
    } catch {
      toast.error("Xóa ca khúc thất bại")
    } finally {
      setIsMutating(false)
      setDeleteDialogOpen(false)
      setSelectedSong(null)
    }
  }

  useEffect(() => {
    if (!addDialogOpen) {
      addForm.reset({
        title: "",
        composer: "",
        year: "",
        category: "",
        lyrics: "",
        audio: null,
      })
    }
  }, [addDialogOpen, addForm])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [currentPage, totalPages])

  const handleAddSubmit = async (values: SongCreateFormData) => {
    if (isMutating) return
    setIsMutating(true)
    const parsed = SongCreateFormSchema.parse(values)
    const yearNumber = parsed.year ? Number(parsed.year) : new Date().getFullYear()
    const normalizedYear = Number.isFinite(yearNumber) ? yearNumber : new Date().getFullYear()
    const hasAudio = parsed.audio instanceof File
    const hasLyrics = Boolean(parsed.lyrics?.trim())
    const selectedCategory =
      categoryOptions.find((c) => c.value === parsed.category) ??
      (parsed.category
        ? { value: parsed.category, label: parsed.category }
        : { value: "", label: "Chưa phân loại" })
    try {
      await SongsService.create({
        title: parsed.title,
        composer: parsed.composer,
        year: normalizedYear,
        duration: "00:00",
        category: selectedCategory,
        status: "active",
        plays: 0,
        hasAudio,
        hasLyrics,
      })
      const next = await SongsService.getAll()
      setSongs(next)
      toast.success("Đã thêm ca khúc")
      setAddDialogOpen(false)
    } catch {
      toast.error("Thêm ca khúc thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const totalSongs = songs.length
  const activeSongs = songs.filter(s => s.status === "active").length
  const totalPlays = songs.reduce((sum, s) => sum + s.plays, 0)

  const handleFilterChange = (key: string, value: string) => {
    if (key === "category") setCategoryFilter(value)
    if (key === "status") setStatusFilter(value)
    setCurrentPage(1)
  }

  return (
    <AdminSection
      header={
        <PageHeader
          icon={Music}
          title="Quản Lý Ca Khúc Truyền Thống"
          description="Quản lý danh sách ca khúc truyền thống của Binh chủng Tăng Thiết Giáp"
          actions={
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm ca khúc
            </Button>
          }
        />
      }
    >
      {isLoading && <AdminLoadingState />}

      <SongsStats
        totalSongs={totalSongs}
        activeSongs={activeSongs}
        totalPlays={totalPlays}
      />

      <SongsFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categoryFilter={categoryFilter}
        statusFilter={statusFilter}
        categoryOptions={categoryOptions}
        statusOptions={statusOptions}
        onFilterChange={handleFilterChange}
      />

      <SongsTable
        songs={paginatedSongs}
        startIndex={(currentPage - 1) * pageSize}
        playingId={playingId}
        onTogglePlay={togglePlay}
        onDelete={handleDelete}
      />

      <SongsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={songs.length}
        filteredItems={filteredSongs.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <SongsAddDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        control={addForm.control}
        categoryOptions={categoryOptions}
        onSubmit={addForm.handleSubmit(handleAddSubmit)}
        isValid={addForm.formState.isValid}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa ca khúc"
        description={`Bạn có chắc chắn muốn xóa ca khúc "${selectedSong?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </AdminSection>
  )
}
