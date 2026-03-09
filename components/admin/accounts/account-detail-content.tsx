"use client"

import { useEffect, useState } from "react"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { AccountsService } from "@/lib/services/accounts.service"
import type { UserAccount } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail } from "@/lib/utils/date"
import { RoleBadge } from "@/components/admin/shared/role-badge"

interface AccountDetailContentProps {
  readonly accountId: number
}

export function AccountDetailContent({ accountId }: AccountDetailContentProps) {
  const [loading, setLoading] = useState(false)
  const [account, setAccount] = useState<UserAccount | null>(null)

  useEffect(() => {
    if (accountId) {
      loadDetail()
    }
  }, [accountId])

  const loadDetail = async () => {
    if (!accountId) return
    setLoading(true)
    try {
      const accountData = await AccountsService.getById(accountId)
      setAccount(accountData)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin tài khoản")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (!account) {
    return <div className="py-8 text-center text-muted-foreground">Không tìm thấy tài khoản</div>
  }

  return (
    <div className="space-y-6">
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

      <DetailSection title="Thông tin thời gian">
        <DetailRow label="Ngày tạo" value={formatDateDetail(account.createdAt)} />
        <DetailRow label="Ngày cập nhật" value={formatDateDetail(account.updatedAt)} />
      </DetailSection>

      <DetailSection title="Thông tin kỹ thuật">
        <DetailRow label="ID" value={account.id} copyable />
      </DetailSection>
    </div>
  )
}

