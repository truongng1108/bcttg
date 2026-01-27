"use client"

import { useState } from "react"
import { 
  Music, 
  Plus, 
  Search, 
  Play, 
  Pause, 
  Upload,
  Download,
  Eye,
  Edit,
  Trash2,
  Star,
  FileAudio,
  Clock
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { Textarea } from "@/components/ui/textarea"
import { ConfirmDialog } from "../shared/confirm-dialog"

// Mock data
const songsData = [
  {
    id: 1,
    title: "Hành khúc Tăng Thiết Giáp",
    composer: "Nhạc sĩ Nguyễn Văn A",
    year: 1972,
    duration: "4:32",
    category: "Hành khúc",
    status: "active",
    plays: 1250,
    hasAudio: true,
    hasLyrics: true,
  },
  {
    id: 2,
    title: "Chiến sĩ xe tăng",
    composer: "Nhạc sĩ Trần Văn B",
    year: 1968,
    duration: "3:45",
    category: "Ca ngợi",
    status: "active",
    plays: 980,
    hasAudio: true,
    hasLyrics: true,
  },
  {
    id: 3,
    title: "Những đoàn xe tăng Việt Nam",
    composer: "Nhạc sĩ Lê Văn C",
    year: 1975,
    duration: "5:10",
    category: "Hành khúc",
    status: "active",
    plays: 2100,
    hasAudio: true,
    hasLyrics: true,
  },
  {
    id: 4,
    title: "Bài ca người lính xe tăng",
    composer: "Nhạc sĩ Phạm Văn D",
    year: 1980,
    duration: "4:15",
    category: "Trữ tình",
    status: "hidden",
    plays: 456,
    hasAudio: false,
    hasLyrics: true,
  },
  {
    id: 5,
    title: "Xuân chiến khu",
    composer: "Nhạc sĩ Hoàng Văn E",
    year: 1969,
    duration: "3:58",
    category: "Trữ tình",
    status: "active",
    plays: 780,
    hasAudio: true,
    hasLyrics: false,
  },
]

export function SongsContent() {
  const [songs, setSongs] = useState(songsData)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSong, setSelectedSong] = useState<typeof songsData[0] | null>(null)

  // Filter songs
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.composer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || song.category === categoryFilter
    const matchesStatus = statusFilter === "all" || song.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const togglePlay = (id: number) => {
    setPlayingId(playingId === id ? null : id)
  }

  const handleDelete = (song: typeof songsData[0]) => {
    setSelectedSong(song)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedSong) {
      setSongs(prev => prev.filter(s => s.id !== selectedSong.id))
    }
    setDeleteDialogOpen(false)
    setSelectedSong(null)
  }

  const totalSongs = songs.length
  const activeSongs = songs.filter(s => s.status === "active").length
  const totalPlays = songs.reduce((sum, s) => sum + s.plays, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <Music className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Quản Lý Ca Khúc Truyền Thống
            </h1>
            <p className="text-sm text-muted-foreground">
              Quản lý danh sách ca khúc truyền thống của Binh chủng Tăng Thiết Giáp
            </p>
          </div>
        </div>
        <Button 
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setAddDialogOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm ca khúc
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FileAudio className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{totalSongs}</p>
              <p className="text-xs text-muted-foreground">Tổng số ca khúc</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <Eye className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{activeSongs}</p>
              <p className="text-xs text-muted-foreground">Đang hiển thị</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Play className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPlays.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Lượt nghe</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên ca khúc, tác giả..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Thể loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thể loại</SelectItem>
              <SelectItem value="Hành khúc">Hành khúc</SelectItem>
              <SelectItem value="Ca ngợi">Ca ngợi</SelectItem>
              <SelectItem value="Trữ tình">Trữ tình</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Đang hiển thị</SelectItem>
              <SelectItem value="hidden">Đang ẩn</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>Tên ca khúc</TableHead>
              <TableHead>Tác giả</TableHead>
              <TableHead className="text-center">Năm</TableHead>
              <TableHead className="text-center">Thời lượng</TableHead>
              <TableHead className="text-center">Thể loại</TableHead>
              <TableHead className="text-center">Trạng thái</TableHead>
              <TableHead className="text-center">Lượt nghe</TableHead>
              <TableHead className="text-center">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSongs.map((song, index) => (
              <TableRow key={song.id} className="hover:bg-muted/30">
                <TableCell className="text-center font-medium text-muted-foreground">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => togglePlay(song.id)}
                    disabled={!song.hasAudio}
                    className={song.hasAudio ? "text-primary hover:bg-primary/10" : "text-muted-foreground"}
                  >
                    {playingId === song.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">{song.title}</p>
                    <div className="flex gap-1 mt-1">
                      {song.hasAudio && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          <FileAudio className="h-3 w-3 mr-1" />
                          Audio
                        </Badge>
                      )}
                      {song.hasLyrics && (
                        <Badge variant="outline" className="text-xs px-1.5 py-0">
                          Lời bài hát
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{song.composer}</TableCell>
                <TableCell className="text-center">{song.year}</TableCell>
                <TableCell className="text-center">
                  <span className="flex items-center justify-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {song.duration}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    {song.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={song.status === "active" ? "default" : "secondary"}
                    className={song.status === "active" 
                      ? "bg-[#2E7D32] text-white" 
                      : "bg-muted text-muted-foreground"
                    }
                  >
                    {song.status === "active" ? "Hiển thị" : "Đang ẩn"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-medium">
                  {song.plays.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent/10 hover:text-accent">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => handleDelete(song)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredSongs.length} / {songs.length} ca khúc
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Trang trước
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            Trang sau
          </Button>
        </div>
      </div>

      {/* Add Song Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-primary">Thêm Ca Khúc Mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin ca khúc truyền thống mới
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="song-title">Tên ca khúc <span className="text-destructive">*</span></Label>
              <Input id="song-title" placeholder="Nhập tên ca khúc" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="song-composer">Tác giả <span className="text-destructive">*</span></Label>
              <Input id="song-composer" placeholder="Nhập tên tác giả" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="song-year">Năm sáng tác</Label>
                <Input id="song-year" type="number" placeholder="VD: 1972" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="song-category">Thể loại</Label>
                <Select>
                  <SelectTrigger id="song-category">
                    <SelectValue placeholder="Chọn thể loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hanh-khuc">Hành khúc</SelectItem>
                    <SelectItem value="ca-ngoi">Ca ngợi</SelectItem>
                    <SelectItem value="tru-tinh">Trữ tình</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="song-lyrics">Lời bài hát</Label>
              <Textarea id="song-lyrics" placeholder="Nhập lời bài hát..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>File âm thanh</Label>
              <div className="flex items-center gap-4 rounded-md border border-dashed border-border p-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Kéo thả file hoặc nhấn để chọn</p>
                  <p className="text-xs text-muted-foreground">Hỗ trợ: MP3, WAV (tối đa 20MB)</p>
                </div>
                <Button variant="outline" size="sm">
                  Chọn file
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-primary text-primary-foreground">
              Thêm ca khúc
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa ca khúc"
        description={`Bạn có chắc chắn muốn xóa ca khúc "${selectedSong?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  )
}
