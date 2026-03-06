"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Lock, Trash2, Download, Edit, KeyRound, UserCog, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { StatusBadge, type StatusType } from "@/components/admin/shared/status-badge"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import type { SelectOption } from "@/lib/data/types"
import type { UserAccount, PaginationMeta } from "@/lib/types/api"
import { AccountsService } from "@/lib/services/accounts.service"
import { PageHeader } from "@/components/admin/shared/page-header"
import { filterByFieldValue, filterBySearch } from "@/lib/utils/filters"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { RoleBadge } from "@/components/admin/shared/role-badge"
import { AccountForm } from "@/components/admin/accounts/account-form"
import { ChangeRoleDialog } from "@/components/admin/accounts/dialogs/change-role-dialog"
import { ResetPasswordDialog } from "@/components/admin/accounts/dialogs/reset-password-dialog"
import { ROLE_FILTER_OPTIONS } from "@/lib/constants/filter-options"
import { VISIBILITY_OPTIONS } from "@/lib/constants/status-options"
import type { AccountDisplay } from "@/lib/types/display"

export function AccountsContent() {
  const router = useRouter()
  const [accounts, setAccounts] = useState<AccountDisplay[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  const [mode, setMode] = useState<"list" | "create" | "edit">("list")
  const [accountForEdit, setAccountForEdit] = useState<UserAccount | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lockDialogOpen, setLockDialogOpen] = useState(false)
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false)
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<AccountDisplay | null>(null)
  // Options imported from constants

  const loadAccounts = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string | number | boolean | null | undefined> = {
        page: currentPage,
        page_size: pageSize,
      }
      if (searchQuery) {
        params.q = searchQuery
      }
      if (filterValues.role && filterValues.role !== "all") {
        params.role = filterValues.role as "ADMIN" | "MANAGER" | "USER"
      }
      if (filterValues.status && filterValues.status !== "all") {
        params.is_active = filterValues.status === "active"
      }
      const response = await AccountsService.getAll(params)
      const mapped: AccountDisplay[] = response.data.map((acc) => ({
        id: String(acc.id),
        rank: acc.profile?.rankName || "",
        fullName: acc.profile?.fullName || "",
        username: acc.phone,
        unit: acc.profile?.unitName || "",
        role: acc.role,
        status: acc.isActive ? "active" : "locked",
        lastLogin: "",
        createdAt: acc.createdAt,
      }))
      setAccounts(mapped)
      if (response.meta) {
        setTotalPages(response.meta.total_pages)
        setTotalElements(response.meta.total_elements)
      }
    } catch {
      toast.error("Không tải được danh sách tài khoản")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [currentPage, searchQuery, filterValues])

  const columns: Column<AccountDisplay>[] = [
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
            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
            title="Xem chi tiết"
            onClick={() => {
              router.push(`/tai-khoan/${row.id}/detail`)
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Sửa"
            onClick={async () => {
              if (isMutating) return
              setIsMutating(true)
              try {
                const full = await AccountsService.getById(Number(row.id))
                setAccountForEdit(full)
                setMode("edit")
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Không tải được thông tin tài khoản")
              } finally {
                setIsMutating(false)
              }
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Đổi quyền"
            onClick={() => {
              setSelectedAccount(row)
              setChangeRoleDialogOpen(true)
            }}
          >
            <UserCog className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Cấp lại mật khẩu"
            onClick={() => {
              setSelectedAccount(row)
              setResetPasswordDialogOpen(true)
            }}
          >
            <KeyRound className="h-4 w-4" />
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
      options: ROLE_FILTER_OPTIONS,
    },
    {
      key: "status",
      label: "Trạng thái",
      options: VISIBILITY_OPTIONS,
    },
    {
      key: "unit",
      label: "Đơn vị",
      options: [],
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
      await AccountsService.delete(Number(selectedAccount.id))
      await loadAccounts()
      toast.success("Đã xóa tài khoản")
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
      const newValue = selectedAccount.status === "locked"
      await AccountsService.toggleActive(Number(selectedAccount.id), newValue)
      await loadAccounts()
      toast.success(newValue ? "Đã mở khóa tài khoản" : "Đã khóa tài khoản")
    } catch {
      toast.error("Cập nhật trạng thái tài khoản thất bại")
    } finally {
      setIsMutating(false)
      setLockDialogOpen(false)
      setSelectedAccount(null)
    }
  }

  if (mode !== "list") {
    return (
      <AccountForm
        mode={mode === "create" ? "create" : "edit"}
        initialData={mode === "edit" ? accountForEdit || undefined : undefined}
        onBack={() => {
          setMode("list")
          setAccountForEdit(null)
        }}
        onSave={async () => {
          await loadAccounts()
          setMode("list")
          setAccountForEdit(null)
        }}
      />
    )
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
              <Button
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => {
                  setMode("create")
                  setAccountForEdit(null)
                }}
              >
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
        totalItems={totalElements}
        currentPage={currentPage}
        pageSize={pageSize}
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


      <ChangeRoleDialog
        open={changeRoleDialogOpen}
        onOpenChange={setChangeRoleDialogOpen}
        currentRole={selectedAccount?.role || "USER"}
        isMutating={isMutating}
        onConfirm={async (role) => {
          if (!selectedAccount) return
          if (isMutating) return
          setIsMutating(true)
          try {
            await AccountsService.changeRole(Number(selectedAccount.id), role)
            toast.success("Đã đổi vai trò")
            await loadAccounts()
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Đổi vai trò thất bại")
          } finally {
            setIsMutating(false)
            setSelectedAccount(null)
          }
        }}
      />

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
        isMutating={isMutating}
        onConfirm={async (newPassword) => {
          if (!selectedAccount) return
          if (isMutating) return
          setIsMutating(true)
          try {
            await AccountsService.resetPassword(Number(selectedAccount.id), newPassword)
            toast.success("Đã cấp lại mật khẩu")
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Cấp lại mật khẩu thất bại")
          } finally {
            setIsMutating(false)
            setSelectedAccount(null)
          }
        }}
      />
    </AdminSection>
  )
}
