"use client"

import { useState } from "react"
import { 
  StickyNote, 
  Plus, 
  Search,
  Star,
  StarOff,
  Edit,
  Trash2,
  Calendar,
  Clock,
  Filter,
  Tag
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ConfirmDialog } from "../shared/confirm-dialog"

// Mock data
const notesData = [
  {
    id: 1,
    title: "Họp giao ban tuần - Phòng Chính trị",
    content: "Nội dung cần chuẩn bị: báo cáo tiến độ cập nhật hồ sơ chiến sĩ, thống kê số lượng truy cập ứng dụng trong tuần...",
    category: "Công việc",
    starred: true,
    createdAt: "27/01/2026 09:30",
    updatedAt: "27/01/2026 14:15",
  },
  {
    id: 2,
    title: "Danh sách cần duyệt nội dung CMS",
    content: "- Bài viết về lịch sử hình thành Binh chủng\n- Hồ sơ Anh hùng Nguyễn Văn B\n- Ca khúc truyền thống mới cập nhật",
    category: "Duyệt nội dung",
    starred: true,
    createdAt: "26/01/2026 16:00",
    updatedAt: "26/01/2026 16:00",
  },
  {
    id: 3,
    title: "Ghi nhớ - Cập nhật hệ thống",
    content: "Thời gian bảo trì định kỳ: 22:00 - 02:00 ngày 01/02/2026. Thông báo trước cho các đơn vị sử dụng.",
    category: "Hệ thống",
    starred: false,
    createdAt: "25/01/2026 11:20",
    updatedAt: "25/01/2026 11:20",
  },
  {
    id: 4,
    title: "Liên hệ kỹ thuật",
    content: "Đ/c Trần Văn C - Phòng CNTT\nĐT: 0123.456.789\nEmail: c.tranvan@ttg.vn",
    category: "Liên hệ",
    starred: false,
    createdAt: "24/01/2026 08:45",
    updatedAt: "24/01/2026 08:45",
  },
  {
    id: 5,
    title: "Yêu cầu bổ sung tính năng",
    content: "Người dùng phản hồi cần bổ sung:\n- Chức năng tìm kiếm nâng cao\n- Xuất báo cáo theo đơn vị\n- Thông báo push",
    category: "Phản hồi",
    starred: false,
    createdAt: "23/01/2026 15:30",
    updatedAt: "23/01/2026 15:30",
  },
]

const categoryColors: Record<string, string> = {
  "Công việc": "bg-primary/10 text-primary border-primary/20",
  "Duyệt nội dung": "bg-accent/10 text-accent border-accent/20",
  "Hệ thống": "bg-[#1565C0]/10 text-[#1565C0] border-[#1565C0]/20",
  "Liên hệ": "bg-[#2E7D32]/10 text-[#2E7D32] border-[#2E7D32]/20",
  "Phản hồi": "bg-[#F57C00]/10 text-[#F57C00] border-[#F57C00]/20",
}

export function NotesContent() {
  const [notes, setNotes] = useState(notesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [starredFilter, setStarredFilter] = useState("all")
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<typeof notesData[0] | null>(null)
  const [newNote, setNewNote] = useState({ title: "", content: "", category: "Công việc" })

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter
    const matchesStarred = starredFilter === "all" || 
      (starredFilter === "starred" && note.starred) ||
      (starredFilter === "unstarred" && !note.starred)
    return matchesSearch && matchesCategory && matchesStarred
  })

  const toggleStar = (id: number) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, starred: !n.starred } : n))
  }

  const handleEdit = (note: typeof notesData[0]) => {
    setSelectedNote(note)
    setEditDialogOpen(true)
  }

  const handleDelete = (note: typeof notesData[0]) => {
    setSelectedNote(note)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedNote) {
      setNotes(prev => prev.filter(n => n.id !== selectedNote.id))
    }
    setDeleteDialogOpen(false)
    setSelectedNote(null)
  }

  const handleAddNote = () => {
    const newId = Math.max(...notes.map(n => n.id)) + 1
    const now = new Date().toLocaleString("vi-VN")
    setNotes(prev => [{
      id: newId,
      ...newNote,
      starred: false,
      createdAt: now,
      updatedAt: now,
    }, ...prev])
    setNewNote({ title: "", content: "", category: "Công việc" })
    setAddDialogOpen(false)
  }

  const starredCount = notes.filter(n => n.starred).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <StickyNote className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Ghi Chú Cá Nhân
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý ghi chú công việc cá nhân của cán bộ quản trị
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-44">
              <Tag className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              <SelectItem value="Công việc">Công việc</SelectItem>
              <SelectItem value="Duyệt nội dung">Duyệt nội dung</SelectItem>
              <SelectItem value="Hệ thống">Hệ thống</SelectItem>
              <SelectItem value="Liên hệ">Liên hệ</SelectItem>
              <SelectItem value="Phản hồi">Phản hồi</SelectItem>
            </SelectContent>
          </Select>
          <Select value={starredFilter} onValueChange={setStarredFilter}>
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Lọc" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="starred">Quan trọng</SelectItem>
              <SelectItem value="unstarred">Thông thường</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Notes Grid */}
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
                    className={`mb-2 text-xs ${categoryColors[note.category] || ""}`}
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

      {/* Empty State */}
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

      {/* Add Note Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">Thêm Ghi Chú Mới</DialogTitle>
            <DialogDescription>
              Tạo ghi chú công việc cá nhân
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Tiêu đề <span className="text-destructive">*</span></Label>
              <Input 
                id="note-title" 
                placeholder="Nhập tiêu đề ghi chú"
                value={newNote.title}
                onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-category">Danh mục</Label>
              <Select 
                value={newNote.category} 
                onValueChange={(value) => setNewNote(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger id="note-category">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Công việc">Công việc</SelectItem>
                  <SelectItem value="Duyệt nội dung">Duyệt nội dung</SelectItem>
                  <SelectItem value="Hệ thống">Hệ thống</SelectItem>
                  <SelectItem value="Liên hệ">Liên hệ</SelectItem>
                  <SelectItem value="Phản hồi">Phản hồi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-content">Nội dung <span className="text-destructive">*</span></Label>
              <Textarea 
                id="note-content" 
                placeholder="Nhập nội dung ghi chú..."
                rows={6}
                value={newNote.content}
                onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              className="bg-primary text-primary-foreground"
              onClick={handleAddNote}
              disabled={!newNote.title || !newNote.content}
            >
              Thêm ghi chú
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
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
              <div className="space-y-2">
                <Label htmlFor="edit-note-title">Tiêu đề</Label>
                <Input id="edit-note-title" defaultValue={selectedNote.title} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-category">Danh mục</Label>
                <Select defaultValue={selectedNote.category}>
                  <SelectTrigger id="edit-note-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Công việc">Công việc</SelectItem>
                    <SelectItem value="Duyệt nội dung">Duyệt nội dung</SelectItem>
                    <SelectItem value="Hệ thống">Hệ thống</SelectItem>
                    <SelectItem value="Liên hệ">Liên hệ</SelectItem>
                    <SelectItem value="Phản hồi">Phản hồi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-content">Nội dung</Label>
                <Textarea id="edit-note-content" defaultValue={selectedNote.content} rows={6} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              className="bg-primary text-primary-foreground"
              onClick={() => setEditDialogOpen(false)}
            >
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa ghi chú"
        description={`Bạn có chắc chắn muốn xóa ghi chú "${selectedNote?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
