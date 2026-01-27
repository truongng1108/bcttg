"use client"

import { useState } from "react"
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Settings, 
  Star,
  ImageIcon,
  FileText,
  Music,
  Users,
  Award,
  BookOpen
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock data cho các module trang chủ
const initialModules = [
  {
    id: "banner",
    name: "Banner Chính",
    description: "Hình ảnh banner xoay vòng trên đầu trang chủ",
    icon: ImageIcon,
    enabled: true,
    order: 1,
    itemCount: 5,
  },
  {
    id: "truyen-thong",
    name: "Truyền Thống Binh Chủng",
    description: "Hiển thị các bài viết về truyền thống binh chủng",
    icon: BookOpen,
    enabled: true,
    order: 2,
    itemCount: 12,
  },
  {
    id: "net-tieu-bieu",
    name: "Nét Tiêu Biểu",
    description: "Các nét tiêu biểu nổi bật của đơn vị",
    icon: Star,
    enabled: true,
    order: 3,
    itemCount: 8,
  },
  {
    id: "thu-truong",
    name: "Hồ Sơ Thủ Trưởng",
    description: "Thông tin các thủ trưởng qua các thời kỳ",
    icon: Users,
    enabled: true,
    order: 4,
    itemCount: 24,
  },
  {
    id: "anh-hung",
    name: "Anh Hùng & Gương Tiêu Biểu",
    description: "Vinh danh các anh hùng và gương tiêu biểu",
    icon: Award,
    enabled: true,
    order: 5,
    itemCount: 45,
  },
  {
    id: "ca-khuc",
    name: "Ca Khúc Truyền Thống",
    description: "Danh sách ca khúc truyền thống binh chủng",
    icon: Music,
    enabled: false,
    order: 6,
    itemCount: 18,
  },
  {
    id: "tin-tuc",
    name: "Tin Tức & Sự Kiện",
    description: "Các tin tức và sự kiện mới nhất",
    icon: FileText,
    enabled: false,
    order: 7,
    itemCount: 0,
  },
]

export function HomeModulesContent() {
  const [modules, setModules] = useState(initialModules)
  const [editingModule, setEditingModule] = useState<typeof initialModules[0] | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const toggleModule = (id: string) => {
    setModules(prev => 
      prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    )
  }

  const openEditDialog = (module: typeof initialModules[0]) => {
    setEditingModule(module)
    setEditDialogOpen(true)
  }

  const enabledCount = modules.filter(m => m.enabled).length
  const disabledCount = modules.filter(m => !m.enabled).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <Star className="h-5 w-5 text-accent" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Quản Lý Module Trang Chủ
            </h1>
            <p className="text-sm text-muted-foreground">
              Cấu hình và sắp xếp các module hiển thị trên trang chủ ứng dụng
            </p>
          </div>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{enabledCount}</p>
            <p className="text-xs text-muted-foreground">Đang hiển thị</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-muted-foreground">{disabledCount}</p>
            <p className="text-xs text-muted-foreground">Đang ẩn</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-4">
          <p className="text-sm text-foreground">
            <strong>Hướng dẫn:</strong> Bật/tắt công tắc để hiển thị hoặc ẩn module trên trang chủ. 
            Nhấn nút cài đặt để chỉnh sửa thông tin chi tiết của từng module.
          </p>
        </CardContent>
      </Card>

      {/* Module List */}
      <div className="space-y-3">
        {modules.sort((a, b) => a.order - b.order).map((module, index) => {
          const Icon = module.icon
          return (
            <Card 
              key={module.id} 
              className={`transition-all ${
                module.enabled 
                  ? "border-primary/20 bg-card" 
                  : "border-border bg-muted/30 opacity-70"
              }`}
            >
              <CardContent className="flex items-center gap-4 p-4">
                {/* Drag Handle */}
                <div className="cursor-move text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-5 w-5" />
                </div>

                {/* Order Number */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${
                  module.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-semibold ${module.enabled ? "text-foreground" : "text-muted-foreground"}`}>
                      {module.name}
                    </h3>
                    <Badge variant={module.enabled ? "default" : "secondary"} className="text-xs">
                      {module.itemCount} mục
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2 text-sm">
                  {module.enabled ? (
                    <span className="flex items-center gap-1 text-primary">
                      <Eye className="h-4 w-4" />
                      Hiển thị
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <EyeOff className="h-4 w-4" />
                      Đang ẩn
                    </span>
                  )}
                </div>

                {/* Toggle */}
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => toggleModule(module.id)}
                />

                {/* Settings Button */}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEditDialog(module)}
                  className="border-border hover:border-primary/50 hover:bg-primary/10"
                >
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Cài đặt module</span>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button variant="outline" className="border-border bg-transparent">
          Hủy thay đổi
        </Button>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Lưu cấu hình
        </Button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-primary">Cài đặt Module</DialogTitle>
            <DialogDescription>
              Chỉnh sửa thông tin hiển thị của module
            </DialogDescription>
          </DialogHeader>
          {editingModule && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="module-name">Tên module</Label>
                <Input 
                  id="module-name" 
                  defaultValue={editingModule.name}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-desc">Mô tả</Label>
                <Textarea 
                  id="module-desc" 
                  defaultValue={editingModule.description}
                  className="border-border"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-order">Thứ tự hiển thị</Label>
                <Input 
                  id="module-order" 
                  type="number"
                  defaultValue={editingModule.order}
                  className="border-border w-24"
                />
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
    </div>
  )
}
