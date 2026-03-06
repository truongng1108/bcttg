"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Eye, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContentItemsService } from "@/lib/services/content-items.service"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import { MediaService } from "@/lib/services/media.service"
import type { ContentItem, ContentCategory } from "@/lib/types/api"
import { toast } from "sonner"
import { StatusPage } from "@/components/shared/status-page"

export default function ContentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState<ContentItem | null>(null)
  const [category, setCategory] = useState<ContentCategory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const contentId = params?.id ? Number(params.id) : null

  useEffect(() => {
    if (!contentId || isNaN(contentId)) {
      setError("ID bài viết không hợp lệ")
      setIsLoading(false)
      return
    }

    const loadContent = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const contentData = await ContentItemsService.getByIdPublic(contentId)
        setContent(contentData)

        if (contentData.categoryId) {
          try {
            const categoryData = await ContentCategoriesService.getByIdPublic(
              contentData.categoryId
            )
            setCategory(categoryData)
          } catch {
          }
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không tải được bài viết"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }

    loadContent()
  }, [contentId])

  if (isLoading) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </main>
    )
  }

  if (error || !content) {
    return (
      <StatusPage
        code="404"
        title="Không tìm thấy bài viết"
        description={error || "Bài viết không tồn tại hoặc đã bị xóa."}
        primaryAction={{ label: "Về trang chủ", href: "/" }}
        secondaryAction={{ label: "Danh sách bài viết", href: "/cms" }}
      />
    )
  }

  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null)
  const [formattedDate, setFormattedDate] = useState<string>("")
  const [formattedViewCount, setFormattedViewCount] = useState<string>("")

  useEffect(() => {
    if (content?.coverMediaId) {
      MediaService.getById(content.coverMediaId)
        .then((media) => {
          if (media?.url) {
            setCoverImageUrl(media.url)
          } else if (media?.storageKey) {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.hotrocode.tech"
            setCoverImageUrl(`${baseUrl}/files/${media.storageKey}`)
          }
        })
        .catch(() => {
          setCoverImageUrl(null)
        })
    } else {
      setCoverImageUrl(null)
    }
  }, [content?.coverMediaId])

  useEffect(() => {
    if (content?.publishedAt) {
      setFormattedDate(
        new Date(content.publishedAt).toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      )
    } else {
      setFormattedDate("")
    }
    if (content?.viewCount !== undefined) {
      setFormattedViewCount(content.viewCount.toLocaleString())
    } else {
      setFormattedViewCount("0")
    }
  }, [content?.publishedAt, content?.viewCount])

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
            {category && (
              <div className="mb-4">
                <span className="inline-block rounded bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {category.name}
                </span>
              </div>
            )}

            <h1 className="mb-4 text-3xl font-bold text-foreground">
              {content.title}
            </h1>

            {content.summary && (
              <p className="mb-6 text-lg text-muted-foreground">
                {content.summary}
              </p>
            )}

            <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {formattedDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>{formattedViewCount} lượt xem</span>
              </div>
            </div>

            {coverImageUrl && (
              <div className="mb-6">
                <img
                  src={coverImageUrl}
                  alt={content.title}
                  className="w-full rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = "none"
                  }}
                />
              </div>
            )}

            {content.bodyHtml && (
              <div
                className="prose prose-sm max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content.bodyHtml }}
              />
            )}

            {!content.bodyHtml && (
              <p className="text-muted-foreground">Nội dung đang được cập nhật...</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

