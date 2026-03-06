"use client"

import { useEffect, useState } from "react"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { DataProfilesService } from "@/lib/services/data-profiles.service"
import { MediaService } from "@/lib/services/media.service"
import type { DataProfile, MediaAsset } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail, formatDateOnly } from "@/lib/utils/date"
import { getMediaUrl } from "@/lib/utils/media"
import { PROFILE_TYPE_LABELS } from "@/lib/constants/profile-types"

interface ProfileDetailContentProps {
  readonly profileId: number
}

export function ProfileDetailContent({ profileId }: ProfileDetailContentProps) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState<DataProfile | null>(null)
  const [avatarMedia, setAvatarMedia] = useState<MediaAsset | null>(null)

  useEffect(() => {
    if (profileId) {
      loadDetail()
    }
  }, [profileId])

  const loadDetail = async () => {
    if (!profileId) return
    setLoading(true)
    try {
      const profileData = await DataProfilesService.getByIdAdmin(profileId)
      setProfile(profileData)

      // Use avatarMedia from response if available, otherwise load separately
      if (profileData.avatarMedia) {
        setAvatarMedia(profileData.avatarMedia)
      } else if (profileData.avatarMediaId) {
        try {
          const media = await MediaService.getById(profileData.avatarMediaId)
          setAvatarMedia(media)
        } catch {
          // Media might not exist
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin hồ sơ")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (!profile) {
    return <div className="py-8 text-center text-muted-foreground">Không tìm thấy hồ sơ</div>
  }

  return (
    <div className="space-y-6">
      {/* Ảnh đại diện */}
      {avatarMedia && (
        <DetailSection title="Ảnh đại diện">
          <div className="py-3 space-y-3">
            <div className="flex justify-center">
              <img
                src={getMediaUrl(avatarMedia) || ""}
                alt="Ảnh đại diện"
                className="max-w-md w-full h-auto rounded-lg border shadow-sm object-contain"
              />
            </div>
            <div className="space-y-2 text-sm">
              <DetailRow label="Tên file" value={avatarMedia.fileName || "—"} />
              <DetailRow label="MIME Type" value={avatarMedia.mimeType || "—"} />
              <DetailRow
                label="Kích thước"
                value={
                  avatarMedia.sizeBytes
                    ? `${(avatarMedia.sizeBytes / 1024).toFixed(2)} KB`
                    : "—"
                }
              />
            </div>
          </div>
        </DetailSection>
      )}

      {/* Thông tin cơ bản */}
      <DetailSection title="Thông tin cơ bản">
        <DetailRow label="Họ và tên" value={profile.fullName} />
        <DetailRow
          label="Loại hồ sơ"
          value={PROFILE_TYPE_LABELS[profile.profileType as keyof typeof PROFILE_TYPE_LABELS] || profile.profileType}
        />
        <DetailRow label="Chức vụ" value={profile.position || "—"} />
        <DetailRow label="Đơn vị" value={profile.unitName || "—"} />
        <DetailRow label="Cấp bậc" value={profile.rankName || "—"} />
        <DetailRow label="Danh hiệu" value={profile.heroTitle || "—"} />
        <DetailRow label="Trạng thái" value={profile.isVisible ? "Đang hiển thị" : "Đã ẩn"} />
        <DetailRow label="Thứ tự sắp xếp" value={profile.sortOrder} />
      </DetailSection>

      {/* Thông tin liên hệ */}
      <DetailSection title="Thông tin liên hệ">
        <DetailRow label="Số điện thoại" value={profile.contactPhone || "—"} copyable />
        <DetailRow label="Ngày sinh" value={formatDateOnly(profile.birthDate)} />
        <DetailRow label="Quê quán" value={profile.hometown || "—"} />
      </DetailSection>

      {/* Tóm tắt */}
      {profile.summary && (
        <DetailSection title="Tóm tắt">
          <div className="py-3">
            <p className="text-sm whitespace-pre-wrap">{profile.summary}</p>
          </div>
        </DetailSection>
      )}

      {/* Tiểu sử */}
      {profile.biography && (
        <DetailSection title="Tiểu sử">
          <div className="py-3">
            <p className="text-sm whitespace-pre-wrap">{profile.biography}</p>
          </div>
        </DetailSection>
      )}

      {/* Thành tích */}
      {profile.achievements && (
        <DetailSection title="Thành tích">
          <div className="py-3">
            <p className="text-sm whitespace-pre-wrap">{profile.achievements}</p>
          </div>
        </DetailSection>
      )}

      {/* Thông tin thời gian */}
      <DetailSection title="Thông tin thời gian">
        <DetailRow label="Ngày tạo" value={formatDateDetail(profile.createdAt)} />
        <DetailRow label="Ngày cập nhật" value={formatDateDetail(profile.updatedAt)} />
      </DetailSection>

      {/* Thông tin kỹ thuật */}
      <DetailSection title="Thông tin kỹ thuật">
        <DetailRow label="ID" value={profile.id} copyable />
        {profile.avatarMediaId && (
          <DetailRow label="Avatar Media ID" value={profile.avatarMediaId} copyable />
        )}
      </DetailSection>
    </div>
  )
}

