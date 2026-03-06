"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ContentItemsService } from "@/lib/services/content-items.service"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import type { ContentCategory, ContentItem } from "@/lib/types/api"
import { toast } from "sonner"
import { StatusPage } from "@/components/shared/status-page"
import { PublicListShell } from "@/components/public/shared/public-list-shell"

type ContentPresetType = "TRUYEN_THONG" | "NET_TIEU_BIEU" | null

interface PublicContentListProps {
  readonly presetType: ContentPresetType
}

export function PublicContentList({ presetType }: PublicContentListProps) {
  const router = useRouter()
  const [items, setItems] = useState<ContentItem[]>([])
  const [categories, setCategories] = useState<ContentCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryId, setCategoryId] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    ContentCategoriesService.getAllPublic({ page_size: 200, type: presetType || undefined })
      .then((res) => {
        setCategories(res.data)
      })
      .catch(() => {
        setCategories([])
      })
  }, [presetType])

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params: Record<string, string | number | boolean | null | undefined> = {
          page: currentPage,
          page_size: 12,
          sort: "publishedAt",
          order: "desc",
        }
        if (searchQuery) params.q = searchQuery
        if (presetType) params.type = presetType
        if (categoryId !== "all") params.category_id = Number(categoryId)
        const res = await ContentItemsService.getAllPublic(params)
        setItems(res.data)
        if (res.meta) {
          setTotalPages(res.meta.total_pages)
        } else {
          setTotalPages(1)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Không tải được danh sách bài viết"
        setError(message)
        toast.error(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [categoryId, currentPage, presetType, searchQuery])

  const categoryOptions = useMemo(() => {
    const options = [{ value: "all", label: "Tất cả danh mục" }]
    const mapped = categories.map((c) => ({ value: String(c.id), label: c.name }))
    return [...options, ...mapped]
  }, [categories])

  if (error && !isLoading) {
    return (
      <StatusPage
        code="500"
        title="Đã xảy ra lỗi"
        description={error}
        primaryAction={{ label: "Về trang chủ", href: "/" }}
        secondaryAction={{ label: "Thử lại", href: "/cms" }}
      />
    )
  }

  return (
    <PublicListShell
      title="CMS Nội dung"
      description="Danh sách bài viết công khai"
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPrevPage={() => setCurrentPage((p) => Math.max(1, p - 1))}
      onNextPage={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
      controls={
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm bài viết..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10"
            />
          </div>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-full sm:w-[260px]">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    >
      {items.length === 0 ? (
        <Card className="border-border bg-card">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Không có bài viết phù hợp</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const dateValue = item.publishedAt || item.createdAt
            const dateText = dateValue ? dateValue.split("T")[0] : ""
            return (
              <Card
                key={item.id}
                className="cursor-pointer border-border bg-card transition-shadow hover:shadow-md"
                onClick={() => router.push(`/cms/${item.id}`)}
              >
                <CardContent className="p-6">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-foreground">{item.title}</h3>
                  {item.summary && (
                    <p className="mb-3 line-clamp-3 text-sm text-muted-foreground">{item.summary}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{dateText}</span>
                    <span>{item.viewCount}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </PublicListShell>
  )
}


