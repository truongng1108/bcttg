"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DataProfilesService } from "@/lib/services/data-profiles.service"
import type { DataProfile } from "@/lib/types/api"
import { toast } from "sonner"
import { StatusPage } from "@/components/shared/status-page"

type ProfileType = "THU_TRUONG" | "CHIEN_SI" | "ANH_HUNG"

interface PublicProfilesListProps {
  readonly presetType: ProfileType | null
}

const profileTypeOptions = [
  { value: "all", label: "Tất cả" },
  { value: "THU_TRUONG", label: "Thủ trưởng" },
  { value: "CHIEN_SI", label: "Chiến sĩ" },
  { value: "ANH_HUNG", label: "Anh hùng" },
]

export function PublicProfilesList({ presetType }: PublicProfilesListProps) {
  const router = useRouter()
  const [profiles, setProfiles] = useState<DataProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [profileTypeFilter, setProfileTypeFilter] = useState<string>(presetType || "all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setProfileTypeFilter(presetType || "all")
    setCurrentPage(1)
  }, [presetType])

  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params: Record<string, string | number | boolean | null | undefined> = {
          page: currentPage,
          page_size: 20,
        }
        if (searchQuery) {
          params.q = searchQuery
        }
        if (profileTypeFilter !== "all") {
          params.profileType = profileTypeFilter as ProfileType
        }
        const response = await DataProfilesService.getAllPublic(params)
        setProfiles(response.data)
        if (response.meta) {
          setTotalPages(response.meta.total_pages)
        } else {
          setTotalPages(1)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không tải được danh sách hồ sơ"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfiles()
  }, [currentPage, searchQuery, profileTypeFilter])

  if (error && !isLoading) {
    return (
      <StatusPage
        code="500"
        title="Đã xảy ra lỗi"
        description={error}
        primaryAction={{ label: "Về trang chủ", href: "/" }}
        secondaryAction={{ label: "Thử lại", href: "/ho-so" }}
      />
    )
  }

  const getAvatarUrl = (profile: DataProfile): string | null => {
    if (profile.avatarMediaId) {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech"
      return `${baseUrl}/files/${profile.avatarMediaId}`
    }
    return null
  }

  const listNode = (() => {
    if (isLoading) {
      return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
    }
    if (profiles.length === 0) {
      return (
      <Card className="border-border bg-card">
        <CardContent className="p-12 text-center">
          <User className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Không tìm thấy hồ sơ nào</p>
        </CardContent>
      </Card>
    )
    }
    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => {
            const avatarUrl = getAvatarUrl(profile)
            return (
              <Card
                key={profile.id}
                className="cursor-pointer border-border bg-card transition-shadow hover:shadow-md"
                onClick={() => router.push(`/ho-so/${profile.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={profile.fullName}
                        className="h-16 w-16 flex-shrink-0 rounded-full object-cover border-2 border-primary"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                        }}
                      />
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-8 w-8 text-primary" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate font-semibold text-foreground">
                        {profile.fullName}
                      </h3>
                      {profile.position && (
                        <p className="mb-1 truncate text-sm text-muted-foreground">
                          {profile.position}
                        </p>
                      )}
                      {profile.unitName && (
                        <p className="truncate text-xs text-muted-foreground">{profile.unitName}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Sau
            </Button>
          </div>
        )}
      </>
    )
  })()

  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Danh sách hồ sơ</h1>
          <p className="text-muted-foreground">
            Danh sách hồ sơ công khai của Binh chủng Tăng Thiết Giáp
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, đơn vị..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={profileTypeFilter}
            onValueChange={(value) => {
              setProfileTypeFilter(value)
              setCurrentPage(1)
            }}
            disabled={presetType !== null}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Loại hồ sơ" />
            </SelectTrigger>
            <SelectContent>
              {profileTypeOptions.map((option, index) => (
                <SelectItem key={`${option.value}-${index}`} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {listNode}
      </div>
    </main>
  )
}


