"use client"

import { useState } from "react"
import { Plus, Eye, EyeOff, Pencil, Trash2, Download, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "../shared/data-table"
import { StatusBadge, type StatusType } from "../shared/status-badge"
import { ConfirmDialog } from "../shared/confirm-dialog"
import { Switch } from "@/components/ui/switch"

interface CMSItem {
  id: string
  title: string
  category: string
  author: string
  status: StatusType
  views: number
  publishedAt: string
  updatedAt: string
  order: number
}

const mockContent: CMSItem[] = [
  {
    id: "1",
    title: "Lịch sử hình thành và phát triển Binh chủng Tăng Thiết Giáp",
    category: "Truyền thống",
    author: "Đại úy Nguyễn Văn A",
    status: "active",
    views: 1247,
    publishedAt: "15/03/2024",
    updatedAt: "25/01/2026",
    order: 1,
  },
  {
    id: "2",
    title: "Trận đánh Đường 9 - Nam Lào: Chiến công hiển hách",
    category: "Truyền thống",
    author: "Thượng úy Lê Văn B",
    status: "active",
    views: 892,
    publishedAt: "20/05/2024",
    updatedAt: "20/01/2026",
    order: 2,
  },
  {
    id: "3",
    title: "Chiến dịch Hồ Chí Minh - Vai trò của lực lượng xe tăng",
    category: "Truyền thống",
    author: "Trung úy Trần Văn C",
    status: "hidden",
    views: 756,
    publishedAt: "10/08/2024",
    updatedAt: "15/01/2026",
    order: 3,
  },
  {
    id: "4",
    title: "Tinh thần đoàn kết, kỷ luật của người lính xe tăng",
    category: "Nét tiêu biểu",
    author: "Thiếu tá Phạm Văn D",
    status: "active",
    views: 543,
    publishedAt: "01/02/2024",
    updatedAt: "10/01/2026",
    order: 4,
  },
  {
    id: "5",
    title: "Huấn luyện chiến đấu trong điều kiện địa hình phức tạp",
    category: "Nét tiêu biểu",
    author: "Đại úy Hoàng Văn E",
    status: "pending",
    views: 0,
    publishedAt: "-",
    updatedAt: "27/01/2026",
    order: 5,
  },
  {
    id: "6",
    title: "60 năm xây dựng và trưởng thành (1965-2025)",
    category: "Truyền thống",
    author: "Thượng úy Vũ Văn F",
    status: "active",
    views: 2156,
    publishedAt: "05/10/2024",
    updatedAt: "05/01/2026",
    order: 6,
  },
]

export function CMSContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [hideDialogOpen, setHideDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<CMSItem | null>(null)
  const [contentData, setContentData] = useState(mockContent)

  const handleToggleVisibility = (item: CMSItem) => {
    setContentData((prev) =>
      prev.map((c) =>
        c.id === item.id
          ? { ...c, status: c.status === "active" ? "hidden" : "active" as StatusType }
          : c
      )
    )
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
      render: (value) => (
        <span className="rounded bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
          {String(value)}
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
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Xem trước"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            title="Chỉnh sửa"
          >
            <Pencil className="h-4 w-4" />
          </Button>
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
      options: [
        { value: "truyen-thong", label: "Truyền thống" },
        { value: "net-tieu-bieu", label: "Nét tiêu biểu" },
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { value: "active", label: "Đang hiển thị" },
        { value: "hidden", label: "Đã ẩn" },
        { value: "pending", label: "Chờ duyệt" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Quản lý Nội dung CMS
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý nội dung bài viết, tài liệu truyền thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Thêm bài viết
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tổng bài viết</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{contentData.length}</p>
        </div>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Đang hiển thị</p>
          <p className="mt-1 text-2xl font-bold text-[#2E7D32]">
            {contentData.filter((c) => c.status === "active").length}
          </p>
        </div>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Đã ẩn</p>
          <p className="mt-1 text-2xl font-bold text-muted-foreground">
            {contentData.filter((c) => c.status === "hidden").length}
          </p>
        </div>
        <div className="rounded-md border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Chờ duyệt</p>
          <p className="mt-1 text-2xl font-bold text-[#F57C00]">
            {contentData.filter((c) => c.status === "pending").length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={contentData}
        searchPlaceholder="Tìm theo tiêu đề, tác giả..."
        filters={filters}
        totalItems={contentData.length}
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
        onConfirm={() => {
          setContentData((prev) => prev.filter((c) => c.id !== selectedItem?.id))
          setDeleteDialogOpen(false)
        }}
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
        onConfirm={() => {
          if (selectedItem) {
            handleToggleVisibility(selectedItem)
          }
          setHideDialogOpen(false)
        }}
      />
    </div>
  )
}
