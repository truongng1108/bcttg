"use client"

import { useState, useEffect } from "react"
import { Plus, Eye, EyeOff, Trash2, Download, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { StatusBadge, type StatusType } from "@/components/admin/shared/status-badge"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { Switch } from "@/components/ui/switch"
import type { CMSItem, SelectOption } from "@/lib/data/types"
import { CMSService } from "@/lib/services/cms.service"
import { PageHeader } from "@/components/admin/shared/page-header"
import { OptionsService } from "@/lib/services/options.service"
import { filterByFieldValue, filterBySearch } from "@/lib/utils/filters"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { AdminStatsGrid } from "@/components/admin/shared/admin-stats-grid"

export function CMSContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [hideDialogOpen, setHideDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CMSItem | null>(null)
  const [contentData, setContentData] = useState<CMSItem[]>([])
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    setIsLoading(true)
    CMSService.getAll()
      .then(setContentData)
      .catch(() => toast.error("Không tải được dữ liệu CMS"))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    Promise.all([
      OptionsService.getCmsCategories(),
      OptionsService.getCmsStatuses(),
    ]).then(([categories, statuses]) => {
      setCategoryOptions(categories)
      setStatusOptions(statuses)
    })
  }, [])

  const refreshData = async () => {
    const next = await CMSService.getAll()
    setContentData(next)
  }

  const handleToggleVisibility = async (item: CMSItem) => {
    if (isMutating) return
    setIsMutating(true)
    const nextStatus: StatusType = item.status === "active" ? "hidden" : "active"
    try {
      await CMSService.update(item.id, { status: nextStatus })
      await refreshData()
      toast.success(nextStatus === "hidden" ? "Đã ẩn bài viết" : "Đã hiện bài viết")
    } catch {
      toast.error("Cập nhật trạng thái bài viết thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const columns: Column<CMSItem>[] = [
    {
      key: "order",
      title: "",
      width: "w-10",
      render: () => (
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
      ),
    },
    {
      key: "title",
      title: "Tiêu đề",
      sortable: true,
      render: (_, row) => (
        <div className="max-w-md">
          <span className="line-clamp-2 font-medium">{row.title}</span>
        </div>
      ),
    },
    {
      key: "category",
      title: "Danh mục",
      sortable: true,
      render: (_, row) => (
        <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
          {row.category}
        </span>
      ),
    },
    {
      key: "author",
      title: "Tác giả",
      sortable: true,
    },
    {
      key: "views",
      title: "Lượt xem",
      sortable: true,
      render: (value) => (
        <span className="text-muted-foreground">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => <StatusBadge status={value as StatusType} />,
    },
    {
      key: "visibility",
      title: "Hiển thị",
      render: (_, row) => (
        <Switch
          checked={row.status === "active"}
          onCheckedChange={() => handleToggleVisibility(row)}
          disabled={row.status === "pending"}
        />
      ),
    },
    {
      key: "updatedAt",
      title: "Cập nhật",
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
            className="h-8 w-8 text-muted-foreground hover:text-[#F57C00]"
            title={row.status === "hidden" ? "Hiện" : "Ẩn"}
            onClick={() => {
              setSelectedItem(row)
              setHideDialogOpen(true)
            }}
          >
            {row.status === "hidden" ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Xóa"
            onClick={() => {
              setSelectedItem(row)
              setDeleteDialogOpen(true)
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filters = [
    {
      key: "category",
      label: "Danh mục",
      options: categoryOptions,
    },
    {
      key: "status",
      label: "Trạng thái",
      options: statusOptions,
    },
  ]

  const totalCount = contentData.length
  const activeCount = contentData.filter((c) => c.status === "active").length
  const hiddenCount = contentData.filter((c) => c.status === "hidden").length
  const pendingCount = contentData.filter((c) => c.status === "pending").length

  const statsItems = [
    { id: "total", value: totalCount, label: "Tổng bài viết", icon: Plus, variant: "default" as const },
    { id: "active", value: activeCount, label: "Đang hiển thị", icon: Eye, variant: "success" as const },
    { id: "hidden", value: hiddenCount, label: "Đã ẩn", icon: EyeOff, variant: "default" as const },
    { id: "pending", value: pendingCount, label: "Chờ duyệt", icon: Download, variant: "warning" as const },
  ]

  const filteredContentData = (() => {
    let result = contentData
    result = filterBySearch(result, searchQuery, ["title", "author"])
    result = filterByFieldValue(result, filterValues.category ?? "all", "category")
    result = filterByFieldValue(result, filterValues.status ?? "all", "status")
    return result
  })()

  const confirmDelete = async () => {
    if (!selectedItem) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const ok = await CMSService.delete(selectedItem.id)
      if (ok) {
        await refreshData()
        toast.success("Đã xóa bài viết")
      } else {
        toast.error("Không tìm thấy bài viết để xóa")
      }
    } catch {
      toast.error("Xóa bài viết thất bại")
    } finally {
      setIsMutating(false)
      setDeleteDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const confirmToggleHidden = async () => {
    if (!selectedItem) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const nextStatus: StatusType = selectedItem.status === "hidden" ? "active" : "hidden"
      await CMSService.update(selectedItem.id, { status: nextStatus })
      await refreshData()
      toast.success(nextStatus === "hidden" ? "Đã ẩn bài viết" : "Đã hiện bài viết")
    } catch {
      toast.error("Cập nhật trạng thái bài viết thất bại")
    } finally {
      setIsMutating(false)
      setHideDialogOpen(false)
      setSelectedItem(null)
    }
  }

  return (
    <AdminSection
      header={
        <PageHeader
          title="Quản lý Nội dung CMS"
          description="Quản lý nội dung bài viết, tài liệu truyền thống"
          actions={
            <>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Xuất Excel
              </Button>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Thêm bài viết
              </Button>
            </>
          }
        />
      }
    >
      {isLoading && <AdminLoadingState />}

      <AdminStatsGrid items={statsItems} columns={4} />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={filteredContentData}
        searchPlaceholder="Tìm theo tiêu đề, tác giả..."
        onSearch={(value) => {
          setSearchQuery(value)
          setCurrentPage(1)
        }}
        filters={filters}
        filterValues={filterValues}
        onFilterChange={(key, value) => {
          setFilterValues((prev) => ({ ...prev, [key]: value }))
          setCurrentPage(1)
        }}
        onClearFilters={() => {
          setFilterValues({})
          setCurrentPage(1)
        }}
        totalItems={filteredContentData.length}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa bài viết"
        description={`Bạn có chắc chắn muốn xóa bài viết "${selectedItem?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa bài viết"
        variant="danger"
        icon="delete"
        onConfirm={confirmDelete}
      />

      {/* Hide Confirmation Dialog */}
      <ConfirmDialog
        open={hideDialogOpen}
        onOpenChange={setHideDialogOpen}
        title={
          selectedItem?.status === "hidden"
            ? "Xác nhận hiện bài viết"
            : "Xác nhận ẩn bài viết"
        }
        description={
          selectedItem?.status === "hidden"
            ? `Bạn có chắc chắn muốn hiện lại bài viết "${selectedItem?.title}"?`
            : `Bạn có chắc chắn muốn ẩn bài viết "${selectedItem?.title}"? Bài viết sẽ không hiển thị trên ứng dụng.`
        }
        confirmText={selectedItem?.status === "hidden" ? "Hiện bài viết" : "Ẩn bài viết"}
        variant="warning"
        icon="hide"
        onConfirm={confirmToggleHidden}
      />
    </AdminSection>
  )
}
