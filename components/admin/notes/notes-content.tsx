"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  StickyNote, 
  Plus, 
  Star,
  StarOff,
  Edit,
  Trash2,
  Clock,
  Archive,
  Inbox,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { PageHeader } from "@/components/admin/shared/page-header"
import { FilterBar } from "@/components/admin/shared/filter-bar"
import { filterBySearch, filterByCategory, filterByStarred } from "@/lib/utils/filters"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { NoteCreateFormSchema, type NoteCreateFormData, type NoteUpdateFormData } from "@/lib/schemas/note.schema"

import type { SelectOption } from "@/lib/data/types"
import { NotesService } from "@/lib/services/notes.service"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { PINNED_FILTER_OPTIONS, ARCHIVE_FILTER_OPTIONS } from "@/lib/constants/filter-options"
import type { NoteDisplay } from "@/lib/types/display"

export function NotesContent() {
  const router = useRouter()
  const [notes, setNotes] = useState<NoteDisplay[]>([])
  const [currentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [categoryOptions] = useState<SelectOption[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [starredFilter, setStarredFilter] = useState("all")
  const [archiveFilter, setArchiveFilter] = useState("not-archived")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<NoteDisplay | null>(null)

  const loadNotes = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string | number | boolean | null | undefined> = {
        page: currentPage,
        page_size: pageSize,
      }
      if (searchQuery) {
        params.q = searchQuery
      }
      if (archiveFilter !== "all") {
        params.is_archived = archiveFilter === "archived"
      }
      const response = await NotesService.getAll(params)
      const mapped: NoteDisplay[] = response.data.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
        category: "",
        starred: note.isPinned,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        isPinned: note.isPinned,
        isArchived: note.isArchived,
      }))
      setNotes(mapped)
      if (response.meta) {
        setTotalPages(response.meta.total_pages)
      }
    } catch {
      toast.error("Không tải được danh sách ghi chú")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadNotes()
  }, [currentPage, searchQuery, starredFilter, archiveFilter])

  const emptyFormValues: NoteCreateFormData = {
    title: "",
    category: "Công việc",
    content: "",
  }

  const normalizeCategory = (value: string): NoteCreateFormData["category"] => {
    if (value === "Công việc") return "Công việc"
    if (value === "Duyệt nội dung") return "Duyệt nội dung"
    if (value === "Hệ thống") return "Hệ thống"
    if (value === "Liên hệ") return "Liên hệ"
    return "Phản hồi"
  }

  const addForm = useForm<NoteCreateFormData>({
    resolver: zodResolver(NoteCreateFormSchema),
    defaultValues: emptyFormValues,
    mode: "onChange",
  })

  const editForm = useForm<NoteUpdateFormData>({
    resolver: zodResolver(NoteCreateFormSchema),
    defaultValues: emptyFormValues,
    mode: "onChange",
  })

  const filteredNotes = useMemo(() => {
    let result = notes
    result = filterBySearch(result, searchQuery, ["title", "content"])
    result = filterByCategory(result, categoryFilter, "category")
    result = filterByStarred(result, starredFilter)
    if (archiveFilter === "archived") {
      result = result.filter((n) => n.isArchived)
    } else if (archiveFilter === "not-archived") {
      result = result.filter((n) => !n.isArchived)
    }
    return result
  }, [notes, searchQuery, categoryFilter, starredFilter, archiveFilter])

  const refreshNotes = async () => {
    await loadNotes()
  }

  const toggleStar = async (id: number) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      const existing = await NotesService.getById(id)
      await NotesService.pin(id, !existing.isPinned)
      await refreshNotes()
    } catch {
      toast.error("Cập nhật ghim thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const toggleArchive = async (note: NoteDisplay) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await NotesService.archive(note.id, !note.isArchived)
      await refreshNotes()
      toast.success(note.isArchived ? "Đã bỏ lưu trữ" : "Đã lưu trữ ghi chú")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Cập nhật lưu trữ thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleEdit = (note: NoteDisplay) => {
    setSelectedNote(note)
    setEditDialogOpen(true)
  }

  const handleDelete = (note: NoteDisplay) => {
    setSelectedNote(note)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedNote) return
    if (isMutating) return
    setIsMutating(true)
    try {
      await NotesService.delete(selectedNote.id)
      await refreshNotes()
      toast.success("Đã xóa ghi chú")
    } catch {
      toast.error("Xóa ghi chú thất bại")
    } finally {
      setIsMutating(false)
      setDeleteDialogOpen(false)
      setSelectedNote(null)
    }
  }

  useEffect(() => {
    if (!addDialogOpen) {
      addForm.reset(emptyFormValues)
    }
  }, [addDialogOpen, addForm])

  useEffect(() => {
    if (!editDialogOpen) {
      editForm.reset(emptyFormValues)
      setSelectedNote(null)
      return
    }
    if (selectedNote) {
      editForm.reset({
        title: selectedNote.title,
        category: normalizeCategory(selectedNote.category),
        content: selectedNote.content,
      })
    }
  }, [editDialogOpen, editForm, selectedNote])

  const handleAddSubmit = async (values: NoteCreateFormData) => {
    if (isMutating) return
    setIsMutating(true)
    const parsed = NoteCreateFormSchema.parse(values)
    try {
      await NotesService.create({
        title: parsed.title,
        content: parsed.content,
        colorCode: null,
        reminderAt: null,
        isPinned: false,
      })
      await refreshNotes()
      toast.success("Đã thêm ghi chú")
      setAddDialogOpen(false)
    } catch {
      toast.error("Thêm ghi chú thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleEditSubmit = async (values: NoteUpdateFormData) => {
    if (!selectedNote) return
    if (isMutating) return
    setIsMutating(true)
    const parsed = NoteCreateFormSchema.parse(values)
    try {
      await NotesService.update(selectedNote.id, {
        title: parsed.title,
        content: parsed.content,
      })
      await refreshNotes()
      toast.success("Đã lưu ghi chú")
      setEditDialogOpen(false)
    } catch {
      toast.error("Lưu ghi chú thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const starredCount = notes.filter(n => n.starred).length

  const filterConfigs = [
    {
      key: "category",
      label: "Danh mục",
      options: [{ value: "all", label: "Tất cả danh mục" }, ...categoryOptions],
    },
    {
      key: "starred",
      label: "Lọc",
      options: PINNED_FILTER_OPTIONS,
    },
    {
      key: "archive",
      label: "Lưu trữ",
      options: ARCHIVE_FILTER_OPTIONS,
    },
  ]

  const handleFilterChange = (key: string, value: string) => {
    if (key === "category") setCategoryFilter(value)
    if (key === "starred") setStarredFilter(value)
    if (key === "archive") setArchiveFilter(value)
  }

  return (
    <AdminSection
      header={
        <PageHeader
          icon={StickyNote}
          title="Ghi Chú Cá Nhân"
          description="Quản lý ghi chú công việc cá nhân của cán bộ quản trị"
          actions={
            <>
              <div className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4 text-accent" fill="currentColor" />
                <span className="font-medium">{starredCount} ghi chú quan trọng</span>
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setAddDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm ghi chú
              </Button>
            </>
          }
        />
      }
    >
      {isLoading && <AdminLoadingState />}

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filterConfigs}
        filterValues={{ category: categoryFilter, starred: starredFilter, archive: archiveFilter }}
        onFilterChange={handleFilterChange}
        searchPlaceholder="Tìm kiếm ghi chú..."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredNotes.map(note => (
          <Card
            key={note.id}
            className={`transition-all hover:shadow-md ${
              note.starred ? "border-accent/50 bg-accent/5" : "border-border"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Badge
                    variant="outline"
                    className="mb-2 text-xs"
                  >
                    {note.category}
                  </Badge>
                  <CardTitle className="text-base font-semibold text-foreground line-clamp-2">
                    {note.title}
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleStar(note.id)}
                  className="h-8 w-8 shrink-0"
                >
                  {note.starred ? (
                    <Star className="h-4 w-4 text-accent" fill="currentColor" />
                  ) : (
                    <StarOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground line-clamp-3 whitespace-pre-line">
                {note.content}
              </p>
              <div className="flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {note.updatedAt}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-blue-600/10 hover:text-blue-600"
                    onClick={() => {
                      router.push(`/ghi-chu/${note.id}/detail`)
                    }}
                    title="Xem chi tiết"
                  >
                    <FileText className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                    onClick={() => toggleArchive(note)}
                    title={note.isArchived ? "Bỏ lưu trữ" : "Lưu trữ"}
                  >
                    {note.isArchived ? (
                      <Inbox className="h-3.5 w-3.5" />
                    ) : (
                      <Archive className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-accent/10 hover:text-accent"
                    onClick={() => handleEdit(note)}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(note)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Không tìm thấy ghi chú nào
            </p>
            <p className="text-sm text-muted-foreground">
              Thử thay đổi bộ lọc hoặc tạo ghi chú mới
            </p>
            <Button
              className="mt-4 bg-primary text-primary-foreground"
              onClick={() => setAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tạo ghi chú mới
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">Thêm Ghi Chú Mới</DialogTitle>
            <DialogDescription>
              Tạo ghi chú công việc cá nhân
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <FormFieldRHF
              label="Tiêu đề"
              name="title"
              required
              placeholder="Nhập tiêu đề ghi chú"
              control={addForm.control}
            />
            <FormFieldRHF
              label="Danh mục"
              name="category"
              type="select"
              placeholder="Chọn danh mục"
              control={addForm.control}
              options={categoryOptions}
            />
            <FormFieldRHF
              label="Nội dung"
              name="content"
              type="textarea"
              required
              placeholder="Nhập nội dung ghi chú..."
              rows={6}
              control={addForm.control}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={addForm.handleSubmit(handleAddSubmit)}
              disabled={!addForm.formState.isValid}
            >
              Thêm ghi chú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">Chỉnh Sửa Ghi Chú</DialogTitle>
            <DialogDescription>
              Cập nhật nội dung ghi chú
            </DialogDescription>
          </DialogHeader>
          {selectedNote && (
            <div className="space-y-4">
              <FormFieldRHF
                label="Tiêu đề"
                name="title"
                placeholder="Nhập tiêu đề ghi chú"
                control={editForm.control}
              />
              <FormFieldRHF
                label="Danh mục"
                name="category"
                type="select"
                placeholder="Chọn danh mục"
                control={editForm.control}
                options={categoryOptions}
              />
              <FormFieldRHF
                label="Nội dung"
                name="content"
                type="textarea"
                placeholder="Nhập nội dung ghi chú..."
                rows={6}
                control={editForm.control}
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              className="bg-primary text-primary-foreground"
              onClick={editForm.handleSubmit(handleEditSubmit)}
              disabled={!editForm.formState.isValid}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa ghi chú"
        description={`Bạn có chắc chắn muốn xóa ghi chú "${selectedNote?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </AdminSection>
  )
}
