"use client"

import { useState, useEffect } from "react"
import { Plus, Lock, Trash2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { StatusBadge, type StatusType } from "@/components/admin/shared/status-badge"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import type { Account, SelectOption } from "@/lib/data/types"
import { AccountsService } from "@/lib/services/accounts.service"
import { PageHeader } from "@/components/admin/shared/page-header"
import { OptionsService } from "@/lib/services/options.service"
import { filterByFieldValue, filterBySearch } from "@/lib/utils/filters"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { RoleBadge } from "@/components/admin/shared/role-badge"

export function AccountsContent() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [roleOptions, setRoleOptions] = useState<SelectOption[]>([])
  const [unitOptions, setUnitOptions] = useState<SelectOption[]>([])
  const [statusOptions, setStatusOptions] = useState<SelectOption[]>([])

  useEffect(() => {
    setIsLoading(true)
    AccountsService.getAll()
      .then(setAccounts)
      .catch(() => toast.error("Không tải được danh sách tài khoản"))
      .finally(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    Promise.all([
      OptionsService.getRoles(),
      OptionsService.getUnits(),
      OptionsService.getAccountStatuses(),
    ]).then(([roles, units, statuses]) => {
      setRoleOptions(roles)
      setUnitOptions(units)
      setStatusOptions(statuses)
    })
  }, [])

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
      render: (_, row) => <span className="font-mono text-xs">{row.username}</span>,
    },
    {
      key: "unit",
      title: "Đơn vị",
      sortable: true,
    },
    {
      key: "role",
      title: "Vai trò",
      render: (_, row) => (
        <RoleBadge role={row.role} />
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
      options: roleOptions,
    },
    {
      key: "status",
      label: "Trạng thái",
      options: statusOptions,
    },
    {
      key: "unit",
      label: "Đơn vị",
      options: unitOptions,
    },
  ]

  const filteredAccounts = (() => {
    let result = accounts
    result = filterBySearch(result, searchQuery, ["fullName", "username"])
    result = filterByFieldValue(result, filterValues.role ?? "all", "role")
    result = filterByFieldValue(result, filterValues.unit ?? "all", "unit")
    result = filterByFieldValue(result, filterValues.status ?? "all", "status")
    return result
  })()

  const confirmDelete = async () => {
    if (!selectedAccount) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const ok = await AccountsService.delete(selectedAccount.id)
      if (ok) {
        const next = await AccountsService.getAll()
        setAccounts(next)
        toast.success("Đã xóa tài khoản")
      } else {
        toast.error("Không tìm thấy tài khoản để xóa")
      }
    } catch {
      toast.error("Xóa tài khoản thất bại")
    } finally {
      setIsMutating(false)
      setDeleteDialogOpen(false)
      setSelectedAccount(null)
    }
  }

  const confirmToggleLock = async () => {
    if (!selectedAccount) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const nextStatus: StatusType =
        selectedAccount.status === "locked" ? "active" : "locked"
      await AccountsService.update(selectedAccount.id, { status: nextStatus })
      const next = await AccountsService.getAll()
      setAccounts(next)
      toast.success(nextStatus === "locked" ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản")
    } catch {
      toast.error("Cập nhật trạng thái tài khoản thất bại")
    } finally {
      setIsMutating(false)
      setLockDialogOpen(false)
      setSelectedAccount(null)
    }
  }

  return (
    <AdminSection
      header={
        <PageHeader
          title="Quản lý Tài khoản"
          description="Quản lý tài khoản người dùng hệ thống"
          actions={
            <>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Xuất Excel
              </Button>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Thêm tài khoản
              </Button>
            </>
          }
        />
      }
    >
      {isLoading && <AdminLoadingState />}

      <DataTable
        columns={columns}
        data={filteredAccounts}
        searchPlaceholder="Tìm theo tên, tên đăng nhập..."
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
        totalItems={filteredAccounts.length}
        currentPage={currentPage}
        pageSize={10}
        onPageChange={setCurrentPage}
      />

      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Xác nhận xóa tài khoản"
        description={`Bạn có chắc chắn muốn xóa tài khoản của "${selectedAccount?.rank} ${selectedAccount?.fullName}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa tài khoản"
        variant="danger"
        icon="delete"
        onConfirm={confirmDelete}
      />

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
        onConfirm={confirmToggleLock}
      />
    </AdminSection>
  )
}
