"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, GripVertical, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { PageHeader } from "@/components/admin/shared/page-header"
import { ProfileForm } from "@/components/admin/profiles/profile-form"
import { DataProfileUnitTree } from "@/components/admin/profiles/data-profile-unit-tree"
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
import { type ProfileType, PROFILE_TYPES, PROFILE_TYPE_LABELS } from "@/lib/constants/profile-types"
import { loadUnitNamesForProfileType } from "@/lib/utils/data-profile-units"

interface ProfilesContentProps {
  readonly presetType?: ProfileType | null
}

export function ProfilesContent({ presetType = null }: Readonly<ProfilesContentProps>) {
  const router = useRouter()
  const [profiles, setProfiles] = useState<DataProfile[]>([])
  const [selectedProfileType, setSelectedProfileType] = useState<ProfileType | null>(null)
  const [selectedUnitName, setSelectedUnitName] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isUnitNamesLoading, setIsUnitNamesLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false)

  const [mode, setMode] = useState<"list" | "create" | "edit">("list")
  const [selectedProfile, setSelectedProfile] = useState<DataProfile | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [reorderOpen, setReorderOpen] = useState(false)
  const [reorderDraft, setReorderDraft] = useState<DataProfile[]>([])
  const [unitNamesByType, setUnitNamesByType] = useState<Record<ProfileType, string[]>>({
    [PROFILE_TYPES.THU_TRUONG]: [],
    [PROFILE_TYPES.CHIEN_SI]: [],
    [PROFILE_TYPES.ANH_HUNG]: [],
  })
  const currentProfileType = presetType ?? selectedProfileType

  const loadProfiles = async () => {
    setIsLoading(!hasLoadedOnce)
    try {
      const params: Record<string, string | number | boolean | null | undefined> = {
        page: currentPage,
        page_size: pageSize,
      }
      if (currentProfileType) params.profileType = currentProfileType
      if (searchQuery) params.q = searchQuery
      if (statusFilter !== "all") params.is_visible = statusFilter === "active"
      const res = await DataProfilesService.getAllAdmin(params)
      setProfiles(res.data)
      if (res.meta) {
        setTotalElements(res.meta.total_elements)
      } else {
        setTotalElements(res.data.length)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không tải được danh sách hồ sơ"
      toast.error(message)
    } finally {
      setIsLoading(false)
      setHasLoadedOnce(true)
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [currentProfileType, currentPage, pageSize, searchQuery, statusFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [currentProfileType, searchQuery, statusFilter])

  useEffect(() => {
    setSelectedProfileType(null)
    setSelectedUnitName(null)
    setSearchQuery("")
    setCurrentPage(1)
  }, [presetType])

  const loadUnitNames = async () => {
    setIsUnitNamesLoading(true)
    try {
      if (presetType) {
        const units = await loadUnitNamesForProfileType(presetType)
        setUnitNamesByType({
          [PROFILE_TYPES.THU_TRUONG]: presetType === PROFILE_TYPES.THU_TRUONG ? units : [],
          [PROFILE_TYPES.CHIEN_SI]: presetType === PROFILE_TYPES.CHIEN_SI ? units : [],
          [PROFILE_TYPES.ANH_HUNG]: presetType === PROFILE_TYPES.ANH_HUNG ? units : [],
        })
        return
      }

      const [thuTruong, chienSi, anhHung] = await Promise.all([
        loadUnitNamesForProfileType(PROFILE_TYPES.THU_TRUONG),
        loadUnitNamesForProfileType(PROFILE_TYPES.CHIEN_SI),
        loadUnitNamesForProfileType(PROFILE_TYPES.ANH_HUNG),
      ])

      setUnitNamesByType({
        [PROFILE_TYPES.THU_TRUONG]: thuTruong,
        [PROFILE_TYPES.CHIEN_SI]: chienSi,
        [PROFILE_TYPES.ANH_HUNG]: anhHung,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không tải được danh sách đơn vị"
      toast.error(message)
    } finally {
      setIsUnitNamesLoading(false)
    }
  }

  useEffect(() => {
    loadUnitNames()
  }, [presetType])

  useLayoutEffect(() => {
    if (mode === "list") return
    const profileFormType = mode === "edit" ? selectedProfile?.profileType : currentProfileType
    if (!profileFormType) {
      toast.error("Không xác định được loại hồ sơ")
      setMode("list")
      setSelectedProfile(null)
    }
  }, [mode, selectedProfile, currentProfileType])

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
      await loadUnitNames()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xóa hồ sơ thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const openReorder = () => {
    if (!currentProfileType) {
      toast.error("Vui lòng chọn nhóm hồ sơ để sắp xếp")
      return
    }
    const next = [...profiles].sort((a, b) => a.sortOrder - b.sortOrder)
    setReorderDraft(next)
    setReorderOpen(true)
  }

  const saveReorder = async () => {
    if (isMutating) return
    if (!currentProfileType) {
      toast.error("Vui lòng chọn nhóm hồ sơ để sắp xếp")
      return
    }
    setIsMutating(true)
    try {
      await DataProfilesService.reorder({
        profileType: currentProfileType,
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
      {mode === "list" && currentProfileType && (
        <Button variant="outline" className="gap-2 bg-transparent" onClick={openReorder}>
          <GripVertical className="h-4 w-4" />
          Sắp xếp
        </Button>
      )}
      {mode === "list" && currentProfileType && (
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
      )}
    </div>
  )

  if (mode !== "list") {
    const profileFormType = mode === "edit" ? selectedProfile?.profileType : currentProfileType
    if (!profileFormType) {
      return <AdminLoadingState />
    }
    return (
      <ProfileForm
        mode={mode === "create" ? "create" : "edit"}
        profileType={profileFormType}
        initialData={mode === "edit" ? selectedProfile || undefined : undefined}
        onBack={() => {
          setMode("list")
          setSelectedProfile(null)
        }}
        onSave={async () => {
          setMode("list")
          setSelectedProfile(null)
          await loadProfiles()
          await loadUnitNames()
        }}
      />
    )
  }

  return (
    <AdminSection
      header={
        <PageHeader
          title={
            presetType
              ? `Hồ sơ dữ liệu - ${PROFILE_TYPE_LABELS[presetType]}`
              : "Hồ sơ dữ liệu"
          }
          description={
            presetType
              ? `Quản lý hồ sơ nhóm ${PROFILE_TYPE_LABELS[presetType]}`
              : "Quản lý hồ sơ dữ liệu"
          }
          actions={headerActions}
        />
      }
    >
      <div className="flex gap-6">
        <div className="w-72 flex-shrink-0 overflow-auto pr-2">
          {isUnitNamesLoading ? (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">Đang tải cây thư mục...</div>
          ) : (
            <DataProfileUnitTree
              presetType={presetType}
              unitNamesByType={unitNamesByType}
              selectedProfileType={selectedProfileType}
              selectedUnitName={selectedUnitName}
              onSelectAll={() => {
                setSelectedProfileType(null)
                setSelectedUnitName(null)
                setSearchQuery("")
                setCurrentPage(1)
              }}
              onSelectProfileType={(type) => {
                setSelectedProfileType(type)
                setSelectedUnitName(null)
                setSearchQuery("")
                setCurrentPage(1)
              }}
              onSelectUnit={(type, unitName) => {
                if (!presetType) setSelectedProfileType(type)
                setSelectedUnitName(unitName)
                setSearchQuery(unitName)
                setCurrentPage(1)
              }}
            />
          )}
        </div>

        <div className="flex-1 space-y-4">
          {isLoading && profiles.length === 0 && <AdminLoadingState />}
          <DataTable
            columns={columns}
            data={profiles}
            searchPlaceholder="Tìm theo tên, đơn vị..."
            onSearch={(value) => {
              setSearchQuery(value)
              setSelectedUnitName(null)
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
            serverPagination
          />
        </div>
      </div>

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


