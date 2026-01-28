"use client"

import { useEffect, useMemo, useState } from "react"
import { Star } from "lucide-react"
import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { HomeModule } from "@/lib/data/types"
import { HomeModulesService } from "@/lib/services/home-modules.service"
import { FormFieldRHF } from "../shared/form-field-rhf"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { HomeModuleEditFormSchema, type HomeModuleEditFormData } from "@/lib/schemas/home-module.schema"
import { HomeModuleSortableCard } from "@/components/admin/home-modules/home-module-sortable-card"
import { toast } from "sonner"

export function HomeModulesContent() {
  const [modules, setModules] = useState<HomeModule[]>([])
  const [baselineModules, setBaselineModules] = useState<HomeModule[]>([])
  const [editingModule, setEditingModule] = useState<HomeModule | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const editForm = useForm<HomeModuleEditFormData>({
    resolver: zodResolver(HomeModuleEditFormSchema),
    defaultValues: { name: "", description: "", order: "" },
    mode: "onChange",
  })

  useEffect(() => {
    HomeModulesService.getAll().then((data) => {
      setModules(data)
      setBaselineModules(data)
    })
  }, [])

  const toggleModule = (id: string) => {
    setModules(prev => 
      prev.map(m => m.id === id ? { ...m, enabled: !m.enabled } : m)
    )
  }

  const openEditDialog = (module: HomeModule) => {
    setEditingModule(module)
    setEditDialogOpen(true)
  }

  useEffect(() => {
    if (!editDialogOpen) {
      editForm.reset({ name: "", description: "", order: "" })
      setEditingModule(null)
      return
    }

    if (editingModule) {
      editForm.reset({
        name: editingModule.name,
        description: editingModule.description,
        order: String(editingModule.order),
      })
    }
  }, [editDialogOpen, editForm, editingModule])

  const handleEditSubmit = (values: HomeModuleEditFormData) => {
    if (!editingModule) return
    const parsed = HomeModuleEditFormSchema.parse(values)
    const orderNumber = parsed.order ? Number(parsed.order) : editingModule.order
    const normalizedOrder = Number.isFinite(orderNumber) ? orderNumber : editingModule.order

    setModules(prev =>
      prev.map(m =>
        m.id === editingModule.id
          ? { ...m, name: parsed.name, description: parsed.description || "", order: normalizedOrder }
          : m
      )
    )

    setEditDialogOpen(false)
  }

  const enabledCount = modules.filter(m => m.enabled).length
  const disabledCount = modules.filter(m => !m.enabled).length
  const sortedModules = [...modules].sort((a, b) => a.order - b.order)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) {
      return
    }
    if (active.id === over.id) {
      return
    }
    setModules(prev => {
      const oldIndex = prev.findIndex(module => module.id === active.id)
      const newIndex = prev.findIndex(module => module.id === over.id)
      if (oldIndex === -1 || newIndex === -1) {
        return prev
      }
      const reordered = arrayMove(prev, oldIndex, newIndex).map((module, index) => ({
        ...module,
        order: index + 1,
      }))
      return reordered
    })
  }

  const resetChanges = () => {
    setModules(baselineModules)
  }

  const areModuleListsEqual = (next: HomeModule[], baseline: HomeModule[]) => {
    if (next.length !== baseline.length) {
      return false
    }
    return next.every((module, index) => {
      const base = baseline[index]
      if (!base) {
        return false
      }
      if (module.id !== base.id) {
        return false
      }
      if (module.order !== base.order) {
        return false
      }
      if (module.enabled !== base.enabled) {
        return false
      }
      if (module.name !== base.name) {
        return false
      }
      if (module.description !== base.description) {
        return false
      }
      return true
    })
  }

  const isDirty = useMemo(
    () => !areModuleListsEqual(modules, baselineModules),
    [modules, baselineModules],
  )

  const handleSaveConfiguration = async () => {
    if (!isDirty) {
      return
    }
    const ordered = [...modules].sort((a, b) => a.order - b.order)
    const saved = await HomeModulesService.saveAll(ordered)
    setModules(saved)
    setBaselineModules(saved)
    toast.success("Đã lưu cấu hình module trang chủ")
  }

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

      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
        <SortableContext
          items={sortedModules.map(module => module.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {sortedModules.map((module, index) => (
              <HomeModuleSortableCard
                key={module.id}
                module={module}
                index={index}
                onToggle={toggleModule}
                onOpenEdit={openEditDialog}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex justify-end gap-3 border-t border-border pt-4">
        <Button
          variant="outline"
          className="border-border bg-transparent"
          onClick={resetChanges}
          disabled={!isDirty}
        >
          Hủy thay đổi
        </Button>
        <Button
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={handleSaveConfiguration}
          disabled={!isDirty}
        >
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
              <FormFieldRHF
                label="Tên module"
                name="name"
                required
                placeholder="Nhập tên module"
                control={editForm.control}
              />
              <FormFieldRHF
                label="Mô tả"
                name="description"
                type="textarea"
                placeholder="Nhập mô tả"
                rows={3}
                control={editForm.control}
              />
              <FormFieldRHF
                label="Thứ tự hiển thị"
                name="order"
                type="number"
                placeholder="VD: 1"
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
    </div>
  )
}
