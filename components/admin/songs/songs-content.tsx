"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Music, Plus, Edit, Trash2, GripVertical, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { PageHeader } from "@/components/admin/shared/page-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { SongCreateFormSchema, type SongCreateFormData } from "@/lib/schemas/song.schema"
import type { SelectOption } from "@/lib/data/types"
import type { Song, SongCategory } from "@/lib/types/api"
import { SongsService } from "@/lib/services/songs.service"
import { SongCategoriesService } from "@/lib/services/song-categories.service"
import { MediaService } from "@/lib/services/media.service"
import { SongsStats } from "./songs-stats"
import { SongsFilters } from "./songs-filters"
import { SongsTable } from "./songs-table"
import { SongsPagination } from "./songs-pagination"
import { SongsAddDialog } from "./songs-add-dialog"
import { SongCategoryForm } from "./category-form"
import { SongCategoryFormData } from "@/lib/schemas/song-category.schema"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SortableList } from "@/components/admin/shared/sortable/sortable-list"
import { SortableCard } from "@/components/admin/shared/sortable/sortable-card"
import { STATUS_FILTER_OPTIONS } from "@/lib/constants/status-options"

export function SongsContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"songs" | "categories">("songs")
  const [songs, setSongs] = useState<Song[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [songsReorderOpen, setSongsReorderOpen] = useState(false)
  const [categoriesReorderOpen, setCategoriesReorderOpen] = useState(false)
  const [songsReorderDraft, setSongsReorderDraft] = useState<Song[]>([])
  const [categoriesReorderDraft, setCategoriesReorderDraft] = useState<SongCategory[]>([])
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])
  const [songCategories, setSongCategories] = useState<SongCategory[]>([])
  // Status options imported from constants
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)
  const editForm = useForm<SongCreateFormData>({
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
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<SongCategory | null>(null)
  const [categoryDeleteDialogOpen, setCategoryDeleteDialogOpen] = useState(false)

  const loadSongs = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string | number | boolean | null | undefined> = {
        page: currentPage,
        page_size: pageSize,
      }
      if (searchQuery) {
        params.q = searchQuery
      }
      if (categoryFilter !== "all") {
        params.category_id = Number(categoryFilter)
      }
      if (statusFilter !== "all") {
        params.is_visible = statusFilter === "active"
      }
      const response = await SongsService.getAllAdmin(params)
      setSongs(response.data)
      if (response.meta) {
        setTotalPages(response.meta.total_pages)
        setTotalElements(response.meta.total_elements)
      }
    } catch {
      toast.error("Không tải được danh sách ca khúc")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSongs()
  }, [currentPage, searchQuery, categoryFilter, statusFilter])

  const loadCategories = async () => {
    try {
      const response = await SongCategoriesService.getAllAdmin({ page_size: 100 })
      setSongCategories(response.data)
      const options: SelectOption[] = [
        { value: "all", label: "Tất cả" },
        ...response.data.map((cat) => ({
          value: String(cat.id),
          label: cat.name,
        })),
      ]
      setCategoryOptions(options)
    } catch {
      toast.error("Không tải được danh mục ca khúc")
    }
  }

  useEffect(() => {
    loadCategories()
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

  const getCategoryName = (categoryId: number): string => {
    const category = songCategories.find((cat) => cat.id === categoryId)
    return category?.name || "Chưa phân loại"
  }

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id)
  }

  const handleEdit = (song: Song) => {
    setSelectedSong(song)
    const category = songCategories.find((c) => c.id === song.categoryId)
    editForm.reset({
      title: song.title,
      composer: "",
      year: "",
      category: category ? String(category.id) : "",
      lyrics: song.lyric || "",
      audio: null,
    })
    setEditDialogOpen(true)
  }

  const handleDelete = (song: Song) => {
    setSelectedSong(song)
    setDeleteDialogOpen(true)
  }

  const handleToggleVisibility = async (song: Song) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await SongsService.toggleVisibility(song.id, !song.isVisible)
      await loadSongs()
      toast.success(song.isVisible ? "Đã ẩn ca khúc" : "Đã hiện ca khúc")
    } catch {
      toast.error("Cập nhật trạng thái ca khúc thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleEditSubmit = async (values: SongCreateFormData) => {
    if (!selectedSong) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const parsed = SongCreateFormSchema.parse(values)
      const categoryId = parsed.category ? Number(parsed.category) : null
      if (!categoryId) {
        toast.error("Vui lòng chọn danh mục")
        setIsMutating(false)
        return
      }

      let audioMediaId: number | null = selectedSong.audioMediaId
      let audioUrl: string | null = selectedSong.audioUrl

      if (parsed.audio instanceof File) {
        const media = await MediaService.upload(parsed.audio)
        audioMediaId = media.id
        audioUrl = null
      }

      const updateData: Partial<Song> = {
        categoryId,
        title: parsed.title,
        lyric: parsed.lyrics || null,
        audioMediaId,
        audioUrl,
      }

      await SongsService.update(selectedSong.id, updateData)
      await loadSongs()
      toast.success("Đã cập nhật ca khúc")
      setEditDialogOpen(false)
      setSelectedSong(null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Cập nhật ca khúc thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedSong) return
    if (isMutating) return
    setIsMutating(true)
    try {
      await SongsService.delete(selectedSong.id)
      await loadSongs()
      toast.success("Đã xóa ca khúc")
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
    try {
      const parsed = SongCreateFormSchema.parse(values)
      const categoryId = parsed.category ? Number(parsed.category) : null
      if (!categoryId) {
        toast.error("Vui lòng chọn danh mục")
        setIsMutating(false)
        return
      }

      let audioMediaId: number | null = null
      let audioUrl: string | null = null

      if (parsed.audio instanceof File) {
        const media = await MediaService.upload(parsed.audio)
        audioMediaId = media.id
      }

      const createData: Partial<Song> = {
        categoryId,
        title: parsed.title,
        lyric: parsed.lyrics || null,
        audioMediaId,
        audioUrl,
        durationSec: null,
        isVisible: true,
        sortOrder: 0,
      }

      await SongsService.create(createData)
      await loadSongs()
      toast.success("Đã thêm ca khúc")
      setAddDialogOpen(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Thêm ca khúc thất bại")
    } finally {
      setIsMutating(false)
    }
  }


  const totalSongs = totalElements
  const activeSongs = songs.filter((s) => s.isVisible).length
  const totalPlays = 0

  const handleFilterChange = (key: string, value: string) => {
    if (key === "category") {
      setCategoryFilter(value)
      setCurrentPage(1)
    }
    if (key === "status") {
      setStatusFilter(value)
      setCurrentPage(1)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleCategorySubmit = async (data: SongCategoryFormData) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      if (selectedCategory) {
        await SongCategoriesService.update(selectedCategory.id, data)
        toast.success("Đã cập nhật danh mục")
      } else {
        await SongCategoriesService.create(data)
        toast.success("Đã thêm danh mục")
      }
      await loadCategories()
      setCategoryFormOpen(false)
      setSelectedCategory(null)
    } catch {
      toast.error(selectedCategory ? "Cập nhật danh mục thất bại" : "Thêm danh mục thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleCategoryDelete = async () => {
    if (!selectedCategory) return
    if (isMutating) return
    setIsMutating(true)
    try {
      await SongCategoriesService.delete(selectedCategory.id)
      await loadCategories()
      toast.success("Đã xóa danh mục")
      setCategoryDeleteDialogOpen(false)
      setSelectedCategory(null)
    } catch {
      toast.error("Xóa danh mục thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleCategoryToggleVisibility = async (category: SongCategory) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await SongCategoriesService.toggleVisibility(category.id, !category.isVisible)
      await loadCategories()
      toast.success(category.isVisible ? "Đã ẩn danh mục" : "Đã hiện danh mục")
    } catch {
      toast.error("Cập nhật trạng thái danh mục thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const categoryColumns: Column<SongCategory>[] = [
    {
      key: "name",
      title: "Tên danh mục",
      sortable: true,
      render: (_, row) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "slug",
      title: "Slug",
      render: (_, row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>
      ),
    },
    {
      key: "description",
      title: "Mô tả",
      render: (_, row) => (
        <span className="text-sm text-muted-foreground line-clamp-1">
          {row.description || "-"}
        </span>
      ),
    },
    {
      key: "isVisible",
      title: "Hiển thị",
      render: (_, row) => (
        <Switch
          checked={row.isVisible}
          onCheckedChange={() => handleCategoryToggleVisibility(row)}
          disabled={isMutating}
        />
      ),
    },
    {
      key: "sortOrder",
      title: "Thứ tự",
      sortable: true,
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
            title="Xem chi tiết"
            onClick={() => {
              router.push(`/ca-khuc/categories/${row.id}/detail`)
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Sửa"
            onClick={() => {
              setSelectedCategory(row)
              setCategoryFormOpen(true)
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Xóa"
            onClick={() => {
              setSelectedCategory(row)
              setCategoryDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const openSongsReorder = () => {
    if (categoryFilter === "all") {
      toast.error("Vui lòng chọn danh mục để sắp xếp ca khúc")
      return
    }
    const next = [...songs].sort((a, b) => a.sortOrder - b.sortOrder)
    setSongsReorderDraft(next)
    setSongsReorderOpen(true)
  }

  const openCategoriesReorder = () => {
    const next = [...songCategories].sort((a, b) => a.sortOrder - b.sortOrder)
    setCategoriesReorderDraft(next)
    setCategoriesReorderOpen(true)
  }

  const saveSongsReorder = async () => {
    if (categoryFilter === "all") {
      toast.error("Vui lòng chọn danh mục để sắp xếp ca khúc")
      return
    }
    if (isMutating) return
    setIsMutating(true)
    try {
      await SongsService.reorder({
        categoryId: Number(categoryFilter),
        orders: songsReorderDraft.map((song, index) => ({
          id: song.id,
          sortOrder: index + 1,
        })),
      })
      toast.success("Đã lưu thứ tự ca khúc")
      setSongsReorderOpen(false)
      await loadSongs()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lưu thứ tự ca khúc thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const saveCategoriesReorder = async () => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await SongCategoriesService.reorder({
        orders: categoriesReorderDraft.map((cat, index) => ({
          id: cat.id,
          sortOrder: index + 1,
        })),
      })
      toast.success("Đã lưu thứ tự danh mục")
      setCategoriesReorderOpen(false)
      await loadCategories()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lưu thứ tự danh mục thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <AdminSection
      header={
        <PageHeader
          icon={Music}
          title="Quản Lý Ca Khúc Truyền Thống"
          description="Quản lý danh sách ca khúc truyền thống của Binh chủng Tăng Thiết Giáp"
          actions={
            activeTab === "songs" ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={openSongsReorder}
                >
                  <GripVertical className="h-4 w-4" />
                  Sắp xếp
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm ca khúc
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={openCategoriesReorder}
                >
                  <GripVertical className="h-4 w-4" />
                  Sắp xếp
                </Button>
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setSelectedCategory(null)
                    setCategoryFormOpen(true)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm danh mục
                </Button>
              </div>
            )
          }
        />
      }
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "songs" | "categories")}>
        <TabsList>
          <TabsTrigger value="songs">Ca khúc</TabsTrigger>
          <TabsTrigger value="categories">Danh mục</TabsTrigger>
        </TabsList>

        <TabsContent value="songs" className="space-y-4">
          {isLoading && <AdminLoadingState />}

          <SongsStats
            totalSongs={totalSongs}
            activeSongs={activeSongs}
            totalPlays={totalPlays}
          />

          <SongsFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            categoryFilter={categoryFilter}
            statusFilter={statusFilter}
            categoryOptions={categoryOptions}
            statusOptions={STATUS_FILTER_OPTIONS}
            onFilterChange={handleFilterChange}
          />

          <SongsTable
            songs={songs.map((song) => ({
              id: song.id,
              title: song.title,
              composer: "",
              year: 0,
              duration: song.durationSec ? `${Math.floor(song.durationSec / 60)}:${String(song.durationSec % 60).padStart(2, "0")}` : "00:00",
              category: { value: String(song.categoryId), label: getCategoryName(song.categoryId) },
              status: song.isVisible ? "active" : "hidden",
              plays: 0,
              hasAudio: Boolean(song.audioMediaId || song.audioUrl),
              hasLyrics: Boolean(song.lyric),
            })) as import("@/lib/data/types").Song[]}
            startIndex={(currentPage - 1) * pageSize}
            playingId={playingId}
            onTogglePlay={togglePlay}
            onEdit={(song) => {
              const apiSong = songs.find((s) => s.id === song.id)
              if (apiSong) {
                handleEdit(apiSong)
              }
            }}
            onView={(song) => {
              router.push(`/ca-khuc/${song.id}/detail`)
            }}
            onToggleVisibility={(song) => {
              const apiSong = songs.find((s) => s.id === song.id)
              if (apiSong) {
                handleToggleVisibility(apiSong)
              }
            }}
            onDelete={(song) => {
              const apiSong = songs.find((s) => s.id === song.id)
              if (apiSong) {
                handleDelete(apiSong)
              }
            }}
          />

          <SongsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalElements}
            filteredItems={totalElements}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <DataTable
            columns={categoryColumns}
            data={songCategories}
            searchPlaceholder="Tìm theo tên danh mục..."
            onSearch={() => {
            }}
            totalItems={songCategories.length}
            currentPage={1}
            pageSize={100}
            onPageChange={() => {}}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={songsReorderOpen} onOpenChange={setSongsReorderOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sắp xếp ca khúc</DialogTitle>
            <DialogDescription>Kéo thả để thay đổi thứ tự hiển thị</DialogDescription>
          </DialogHeader>
          <SortableList
            items={songsReorderDraft}
            getId={(item) => item.id}
            onReorder={(next) => setSongsReorderDraft([...next])}
          >
            {(item, index) => (
              <SortableCard
                id={item.id}
                index={index}
                title={item.title}
                subtitle={getCategoryName(item.categoryId)}
              />
            )}
          </SortableList>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSongsReorderOpen(false)}
              disabled={isMutating}
            >
              Hủy
            </Button>
            <Button onClick={saveSongsReorder} disabled={isMutating}>
              {isMutating ? "Đang lưu..." : "Lưu thứ tự"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoriesReorderOpen} onOpenChange={setCategoriesReorderOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sắp xếp danh mục</DialogTitle>
            <DialogDescription>Kéo thả để thay đổi thứ tự</DialogDescription>
          </DialogHeader>
          <SortableList
            items={categoriesReorderDraft}
            getId={(item) => item.id}
            onReorder={(next) => setCategoriesReorderDraft([...next])}
          >
            {(item, index) => (
              <SortableCard id={item.id} index={index} title={item.name} subtitle={item.slug} />
            )}
          </SortableList>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoriesReorderOpen(false)}
              disabled={isMutating}
            >
              Hủy
            </Button>
            <Button onClick={saveCategoriesReorder} disabled={isMutating}>
              {isMutating ? "Đang lưu..." : "Lưu thứ tự"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <SongsAddDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        control={addForm.control}
        categoryOptions={categoryOptions}
        onSubmit={addForm.handleSubmit(handleAddSubmit)}
        isValid={addForm.formState.isValid}
      />

      <SongsAddDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setSelectedSong(null)
          }
        }}
        control={editForm.control}
        categoryOptions={categoryOptions}
        onSubmit={editForm.handleSubmit(handleEditSubmit)}
        isValid={editForm.formState.isValid}
        mode="edit"
      />

      <SongCategoryForm
        open={categoryFormOpen}
        onOpenChange={(open) => {
          setCategoryFormOpen(open)
          if (!open) {
            setSelectedCategory(null)
          }
        }}
        mode={selectedCategory ? "edit" : "create"}
        initialData={selectedCategory || undefined}
        onSubmit={handleCategorySubmit}
        isMutating={isMutating}
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

      <ConfirmDialog
        open={categoryDeleteDialogOpen}
        onOpenChange={setCategoryDeleteDialogOpen}
        title="Xác nhận xóa danh mục"
        description={`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa danh mục"
        variant="danger"
        icon="delete"
        onConfirm={handleCategoryDelete}
      />
    </AdminSection>
  )
}
