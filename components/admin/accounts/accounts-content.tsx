"use client"

import { useState } from "react"
import { Plus, Eye, Pencil, Lock, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "../shared/data-table"
import { StatusBadge, type StatusType } from "../shared/status-badge"
import { ConfirmDialog } from "../shared/confirm-dialog"

interface Account {
  id: string
  rank: string
  fullName: string
  username: string
  unit: string
  role: string
  status: StatusType
  lastLogin: string
  createdAt: string
}

const mockAccounts: Account[] = [
  {
    id: "1",
    rank: "Đại úy",
    fullName: "Nguyễn Văn A",
    username: "nguyenvana",
    unit: "Phòng Chính trị",
    role: "Quản trị viên",
    status: "active",
    lastLogin: "27/01/2026 14:30",
    createdAt: "15/03/2024",
  },
  {
    id: "2",
    rank: "Thượng úy",
    fullName: "Lê Văn B",
    username: "levanb",
    unit: "Tiểu đoàn 1",
    role: "Biên tập viên",
    status: "active",
    lastLogin: "27/01/2026 10:15",
    createdAt: "20/05/2024",
  },
  {
    id: "3",
    rank: "Trung úy",
    fullName: "Trần Văn C",
    username: "tranvanc",
    unit: "Tiểu đoàn 2",
    role: "Biên tập viên",
    status: "inactive",
    lastLogin: "15/01/2026 08:45",
    createdAt: "10/08/2024",
  },
  {
    id: "4",
    rank: "Thiếu tá",
    fullName: "Phạm Văn D",
    username: "phamvand",
    unit: "Ban Chỉ huy",
    role: "Chỉ huy",
    status: "active",
    lastLogin: "26/01/2026 16:20",
    createdAt: "01/02/2024",
  },
  {
    id: "5",
    rank: "Đại úy",
    fullName: "Hoàng Văn E",
    username: "hoangvane",
    unit: "Phòng Kỹ thuật",
    role: "Biên tập viên",
    status: "locked",
    lastLogin: "01/12/2025 09:00",
    createdAt: "25/06/2024",
  },
  {
    id: "6",
    rank: "Thượng úy",
    fullName: "Vũ Văn F",
    username: "vuvanf",
    unit: "Tiểu đoàn 3",
    role: "Người dùng",
    status: "active",
    lastLogin: "27/01/2026 11:45",
    createdAt: "12/09/2024",
  },
  {
    id: "7",
    rank: "Trung úy",
    fullName: "Đinh Văn G",
    username: "dinhvang",
    unit: "Phòng Chính trị",
    role: "Biên tập viên",
    status: "active",
    lastLogin: "26/01/2026 14:00",
    createdAt: "05/11/2024",
  },
  {
    id: "8",
    rank: "Đại úy",
    fullName: "Bùi Văn H",
    username: "buivanh",
    unit: "Tiểu đoàn 1",
    role: "Chỉ huy",
    status: "pending",
    lastLogin: "-",
    createdAt: "20/01/2026",
  },
]

export function AccountsContent() {
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)

  const columns: Column<Account>[] = [
    {
      key: "rank",
      title: "Cấp bậc",
      sortable: true,
      width: "w-24",
    },
    {
      key: "fullName",
      title: "Họ và tên",
      sortable: true,
      render: (_, row) => (
        <span className="font-medium">{row.fullName}</span>
      ),
    },
    {
      key: "username",
      title: "Tên đăng nhập",
      render: (value) => (
        <span className="font-mono text-xs">{String(value)}</span>
      ),
    },
    {
      key: "unit",
      title: "Đơn vị",
      sortable: true,
    },
    {
      key: "role",
      title: "Vai trò",
      render: (value) => (
        <span className="rounded bg-secondary/10 px-2 py-0.5 text-xs font-medium text-secondary">
          {String(value)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => <StatusBadge status={value as StatusType} />,
    },
    {
      key: "lastLogin",
      title: "Đăng nhập cuối",
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
            title="Xem chi tiết"
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
            title={row.status === "locked" ? "Mở khóa" : "Khóa tài khoản"}
            onClick={() => {
              setSelectedAccount(row)
              setLockDialogOpen(true)
            }}
          >
            <Lock className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Xóa"
            onClick={() => {
              setSelectedAccount(row)
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
      key: "role",
      label: "Vai trò",
      options: [
        { value: "admin", label: "Quản trị viên" },
        { value: "editor", label: "Biên tập viên" },
        { value: "commander", label: "Chỉ huy" },
        { value: "user", label: "Người dùng" },
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { value: "active", label: "Hoạt động" },
        { value: "inactive", label: "Không hoạt động" },
        { value: "locked", label: "Đã khóa" },
        { value: "pending", label: "Chờ duyệt" },
      ],
    },
    {
      key: "unit",
      label: "Đơn vị",
      options: [
        { value: "politics", label: "Phòng Chính trị" },
        { value: "battalion1", label: "Tiểu đoàn 1" },
        { value: "battalion2", label: "Tiểu đoàn 2" },
        { value: "battalion3", label: "Tiểu đoàn 3" },
        { value: "command", label: "Ban Chỉ huy" },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Quản lý Tài khoản
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Quản lý tài khoản người dùng hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Thêm tài khoản
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={mockAccounts}
        searchPlaceholder="Tìm theo tên, tên đăng nhập..."
        filters={filters}
        totalItems={mockAccounts.length}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa tài khoản"
        description={`Bạn có chắc chắn muốn xóa tài khoản của "${selectedAccount?.rank} ${selectedAccount?.fullName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tài khoản"
        variant="danger"
        icon="delete"
        onConfirm={() => {
          // Handle delete
          setDeleteDialogOpen(false)
        }}
      />

      {/* Lock Confirmation Dialog */}
      <ConfirmDialog
        open={lockDialogOpen}
        onOpenChange={setLockDialogOpen}
        title={
          selectedAccount?.status === "locked"
            ? "Xác nhận mở khóa tài khoản"
            : "Xác nhận khóa tài khoản"
        }
        description={
          selectedAccount?.status === "locked"
            ? `Bạn có chắc chắn muốn mở khóa tài khoản của "${selectedAccount?.rank} ${selectedAccount?.fullName}"?`
            : `Bạn có chắc chắn muốn khóa tài khoản của "${selectedAccount?.rank} ${selectedAccount?.fullName}"? Người dùng sẽ không thể đăng nhập vào hệ thống.`
        }
        confirmText={
          selectedAccount?.status === "locked" ? "Mở khóa" : "Khóa tài khoản"
        }
        variant="warning"
        icon="lock"
        onConfirm={() => {
          // Handle lock/unlock
          setLockDialogOpen(false)
        }}
      />
    </div>
  )
}
