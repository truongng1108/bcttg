"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, GripVertical, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { PageHeader } from "@/components/admin/shared/page-header"
import { ProfileForm } from "@/components/admin/profiles/profile-form"
import { DataProfilesService } from "@/lib/services/data-profiles.service"
import type { DataProfile } from "@/lib/types/api"
import { toast } from "sonner"
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
import { type ProfileType, PROFILE_TYPE_LABELS } from "@/lib/constants/profile-types"

export function ProfilesContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ProfileType>("THU_TRUONG")
  const [profiles, setProfiles] = useState<DataProfile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)

  const [mode, setMode] = useState<"list" | "create" | "edit">("list")
  const [selectedProfile, setSelectedProfile] = useState<DataProfile | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [reorderOpen, setReorderOpen] = useState(false)
  const [reorderDraft, setReorderDraft] = useState<DataProfile[]>([])

  const loadProfiles = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string | number | boolean | null | undefined> = {
        page: currentPage,
        page_size: pageSize,
        profileType: activeTab,
      }
      if (searchQuery) params.q = searchQuery
      if (statusFilter !== "all") params.is_visible = statusFilter === "active"
      const res = await DataProfilesService.getAllAdmin(params)
      setProfiles(res.data)
      if (res.meta) {
        setTotalPages(res.meta.total_pages)
        setTotalElements(res.meta.total_elements)
      } else {
        setTotalPages(1)
        setTotalElements(res.data.length)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không tải được danh sách hồ sơ"
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [activeTab, currentPage, pageSize, searchQuery, statusFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab, searchQuery, statusFilter])

  const handleToggleVisibility = async (profile: DataProfile) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await DataProfilesService.toggleVisibility(profile.id, !profile.isVisible)
      toast.success(profile.isVisible ? "Đã ẩn hồ sơ" : "Đã hiện hồ sơ")
      await loadProfiles()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Cập nhật trạng thái thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedProfile) return
    if (isMutating) return
    setIsMutating(true)
    try {
      await DataProfilesService.delete(selectedProfile.id)
      toast.success("Đã xóa hồ sơ")
      setDeleteDialogOpen(false)
      setSelectedProfile(null)
      await loadProfiles()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xóa hồ sơ thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const openReorder = () => {
    const next = [...profiles].sort((a, b) => a.sortOrder - b.sortOrder)
    setReorderDraft(next)
    setReorderOpen(true)
  }

  const saveReorder = async () => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await DataProfilesService.reorder({
        profileType: activeTab,
        orders: reorderDraft.map((p, index) => ({ id: p.id, sortOrder: index + 1 })),
      })
      toast.success("Đã lưu thứ tự hồ sơ")
      setReorderOpen(false)
      await loadProfiles()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lưu thứ tự thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const columns: Column<DataProfile>[] = [
    {
      key: "fullName",
      title: "Họ và tên",
      sortable: true,
      render: (_, row) => (
        <div className="min-w-0">
          <div className="truncate font-medium">{row.fullName}</div>
          {row.unitName && <div className="truncate text-xs text-muted-foreground">{row.unitName}</div>}
        </div>
      ),
    },
    {
      key: "position",
      title: "Chức vụ",
      render: (_, row) => <span className="text-sm text-muted-foreground">{row.position || ""}</span>,
    },
    {
      key: "rankName",
      title: "Cấp bậc",
      render: (_, row) => <span className="text-sm text-muted-foreground">{row.rankName || ""}</span>,
    },
    {
      key: "isVisible",
      title: "Hiển thị",
      render: (_, row) => (
        <Switch checked={row.isVisible} onCheckedChange={() => handleToggleVisibility(row)} disabled={isMutating} />
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
              router.push(`/ho-so/${row.id}/detail`)
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
              setSelectedProfile(row)
              setMode("edit")
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
              setSelectedProfile(row)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const headerActions = (
    <div className="flex items-center gap-2">
      {mode === "list" && (
        <Button variant="outline" className="gap-2 bg-transparent" onClick={openReorder}>
          <GripVertical className="h-4 w-4" />
          Sắp xếp
        </Button>
      )}
      <Button
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        onClick={() => {
          setSelectedProfile(null)
          setMode("create")
        }}
      >
        <Plus className="h-4 w-4" />
        Thêm hồ sơ
      </Button>
    </div>
  )

  if (mode !== "list") {
    return (
      <ProfileForm
        mode={mode === "create" ? "create" : "edit"}
        profileType={activeTab}
        initialData={mode === "edit" ? selectedProfile || undefined : undefined}
        onBack={() => {
          setMode("list")
          setSelectedProfile(null)
        }}
        onSave={async () => {
          setMode("list")
          setSelectedProfile(null)
          await loadProfiles()
        }}
      />
    )
  }

  return (
    <AdminSection
      header={
        <PageHeader
          title="Hồ sơ dữ liệu"
          description="Quản lý hồ sơ dữ liệu"
          actions={headerActions}
        />
      }
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ProfileType)}>
        <TabsList>
          <TabsTrigger value="THU_TRUONG">{PROFILE_TYPE_LABELS.THU_TRUONG}</TabsTrigger>
          <TabsTrigger value="CHIEN_SI">{PROFILE_TYPE_LABELS.CHIEN_SI}</TabsTrigger>
          <TabsTrigger value="ANH_HUNG">{PROFILE_TYPE_LABELS.ANH_HUNG}</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading && <AdminLoadingState />}
          <DataTable
            columns={columns}
            data={profiles}
            searchPlaceholder="Tìm theo tên, đơn vị..."
            onSearch={(value) => {
              setSearchQuery(value)
              setCurrentPage(1)
            }}
            filters={[
              {
                key: "status",
                label: "Trạng thái",
                options: [
                  { value: "all", label: "Tất cả" },
                  { value: "active", label: "Đang hiển thị" },
                  { value: "hidden", label: "Đã ẩn" },
                ],
              },
            ]}
            filterValues={{ status: statusFilter }}
            onFilterChange={(_, value) => {
              setStatusFilter(value)
              setCurrentPage(1)
            }}
            onClearFilters={() => {
              setStatusFilter("all")
              setCurrentPage(1)
            }}
            totalItems={totalElements}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={reorderOpen} onOpenChange={setReorderOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sắp xếp hồ sơ</DialogTitle>
            <DialogDescription>Kéo thả để thay đổi thứ tự hiển thị</DialogDescription>
          </DialogHeader>
          <SortableList
            items={reorderDraft}
            getId={(item) => item.id}
            onReorder={(next) => setReorderDraft([...next])}
          >
            {(item, index) => (
              <SortableCard
                id={item.id}
                index={index}
                title={item.fullName}
                subtitle={item.unitName || ""}
              />
            )}
          </SortableList>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReorderOpen(false)} disabled={isMutating}>
              Hủy
            </Button>
            <Button onClick={saveReorder} disabled={isMutating}>
              {isMutating ? "Đang lưu..." : "Lưu thứ tự"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa hồ sơ"
        description={`Bạn có chắc chắn muốn xóa hồ sơ "${selectedProfile?.fullName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
        onConfirm={confirmDelete}
      />
    </AdminSection>
  )
}


