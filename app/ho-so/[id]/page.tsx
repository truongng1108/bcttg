"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Loader2, User, MapPin, Phone, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DataProfilesService } from "@/lib/services/data-profiles.service"
import { MediaService } from "@/lib/services/media.service"
import type { DataProfile } from "@/lib/types/api"
import { toast } from "sonner"
import { StatusPage } from "@/components/shared/status-page"

const profileTypeLabels = {
  THU_TRUONG: "Thủ trưởng",
  CHIEN_SI: "Chiến sĩ",
  ANH_HUNG: "Anh hùng",
}

export default function ProfileDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<DataProfile | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formattedBirthDate, setFormattedBirthDate] = useState<string>("")

  const profileId = params?.id ? Number(params.id) : null

  useEffect(() => {
    if (!profileId || isNaN(profileId)) {
      setError("ID hồ sơ không hợp lệ")
      setIsLoading(false)
      return
    }

    const loadProfile = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const profileData = await DataProfilesService.getByIdPublic(profileId)
        setProfile(profileData)

        if (profileData.avatarMediaId) {
          try {
            const media = await MediaService.getById(profileData.avatarMediaId)
            if (media?.url) {
              setAvatarUrl(media.url)
            } else if (media?.storageKey) {
              const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech"
              setAvatarUrl(`${baseUrl}/files/${media.storageKey}`)
            }
          } catch {
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không tải được hồ sơ"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [profileId])

  useEffect(() => {
    if (profile?.birthDate) {
      setFormattedBirthDate(
        new Date(profile.birthDate).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      )
    } else {
      setFormattedBirthDate("")
    }
  }, [profile?.birthDate])

  if (isLoading) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (error || !profile) {
    return (
      <StatusPage
        code="404"
        title="Không tìm thấy hồ sơ"
        description={error || "Hồ sơ không tồn tại hoặc đã bị xóa."}
        primaryAction={{ label: "Về trang chủ", href: "/" }}
        secondaryAction={{ label: "Danh sách hồ sơ", href: "/ho-so" }}
      />
    )
  }

  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>

        <Card className="border-border bg-card shadow-sm">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              {avatarUrl && (
                <div className="flex-shrink-0">
                  <img
                    src={avatarUrl}
                    alt={profile.fullName}
                    className="h-32 w-32 rounded-full object-cover border-2 border-primary"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = "none"
                    }}
                  />
                </div>
              )}
              <div className="flex-1">
                <div className="mb-2">
                  <span className="inline-block rounded bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    {profileTypeLabels[profile.profileType]}
                  </span>
                </div>
                <h1 className="mb-2 text-3xl font-bold text-foreground">
                  {profile.fullName}
                </h1>
                {profile.position && (
                  <p className="mb-2 text-lg text-muted-foreground">
                    {profile.position}
                  </p>
                )}
                {profile.unitName && (
                  <p className="text-muted-foreground">
                    {profile.unitName}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {profile.rankName && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Award className="h-4 w-4" />
                  <span>{profile.rankName}</span>
                </div>
              )}
              {formattedBirthDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedBirthDate}</span>
                </div>
              )}
              {profile.hometown && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{profile.hometown}</span>
                </div>
              )}
              {profile.contactPhone && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{profile.contactPhone}</span>
                </div>
              )}
            </div>

            {profile.heroTitle && (
              <div className="mb-6 rounded-lg bg-accent/10 p-4">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Danh hiệu
                </h2>
                <p className="text-muted-foreground">{profile.heroTitle}</p>
              </div>
            )}

            {profile.summary && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Tóm tắt
                </h2>
                <p className="text-muted-foreground">{profile.summary}</p>
              </div>
            )}

            {profile.biography && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Tiểu sử
                </h2>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: profile.biography }}
                />
              </div>
            )}

            {profile.achievements && (
              <div className="mb-6">
                <h2 className="mb-2 text-xl font-semibold text-foreground">
                  Thành tích
                </h2>
                <div
                  className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: profile.achievements }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

