"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { AccountsService } from "@/lib/services/accounts.service"
import type { UserAccount } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"
import { RoleBadge } from "@/components/admin/shared/role-badge"
import { USER_ROLE_LABELS } from "@/lib/constants/roles"

interface AccountDetailProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  accountId: number | null
}

export function AccountDetail({ open, onOpenChange, accountId }: AccountDetailProps) {
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState<UserAccount | null>(null)

  useEffect(() => {
    if (open && accountId) {
      loadDetail()
    } else {
      setAccount(null)
    }
  }, [open, accountId])

  const loadDetail = async () => {
    if (!accountId) return
    setLoading(true)
    try {
      const accountData = await AccountsService.getById(accountId)
      setAccount(accountData)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin tài khoản")
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết tài khoản</DialogTitle>
          <DialogDescription>Thông tin đầy đủ về tài khoản</DialogDescription>
        </DialogHeader>

        {loading && <AdminLoadingState />}

        {!loading && account && (
          <div className="space-y-6">
            {/* Thông tin tài khoản */}
            <DetailSection title="Thông tin tài khoản">
              <DetailRow label="Số điện thoại" value={account.phone} copyable />
              <DetailRow
                label="Vai trò"
                renderValue={() => <RoleBadge role={account.role} />}
              />
              <DetailRow
                label="Trạng thái"
                value={account.isActive ? "Hoạt động" : "Đã khóa"}
              />
            </DetailSection>

            {/* Thông tin hồ sơ */}
            {account.profile && (
              <DetailSection title="Thông tin hồ sơ">
                <DetailRow label="Họ và tên" value={account.profile.fullName || "—"} />
                <DetailRow label="Chức vụ" value={account.profile.position || "—"} />
                <DetailRow label="Đơn vị" value={account.profile.unitName || "—"} />
                <DetailRow label="Cấp bậc" value={account.profile.rankName || "—"} />
                <DetailRow label="Email" value={account.profile.email || "—"} copyable />
                <DetailRow label="Địa chỉ" value={account.profile.address || "—"} />
                <DetailRow label="Ngày sinh" value={formatDateDetail(account.profile.birthDate)} />
              </DetailSection>
            )}

            {/* Thông tin thời gian */}
            <DetailSection title="Thông tin thời gian">
              <DetailRow label="Ngày tạo" value={formatDateDetail(account.createdAt)} />
              <DetailRow label="Ngày cập nhật" value={formatDateDetail(account.updatedAt)} />
            </DetailSection>

            {/* Thông tin kỹ thuật */}
            <DetailSection title="Thông tin kỹ thuật">
              <DetailRow label="ID" value={account.id} copyable />
            </DetailSection>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

