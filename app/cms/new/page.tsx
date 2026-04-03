"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { ContentItemEditor } from "@/components/admin/cms/content-item-editor"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { ContentItemsService } from "@/lib/services/content-items.service"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import type { ContentCategory, ContentItem } from "@/lib/types/api"
import type { SelectOption } from "@/lib/data/types"
import type { ContentItemFormData } from "@/lib/schemas/content-item.schema"
import { isContentType } from "@/lib/constants/content-types"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

function CMSNewInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const categoryIdParam = searchParams.get("categoryId")
  const typeParam = searchParams.get("type")

  const parsedCategoryId = categoryIdParam ? Number(categoryIdParam) : Number.NaN
  const typeFilter = typeParam && isContentType(typeParam) ? typeParam : null

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<ContentCategory[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const response = await ContentCategoriesService.getAllAdmin({
          page_size: 500,
          type: typeFilter || undefined,
        })
        setCategories(response.data)
      } catch {
        toast.error("Không tải được danh mục")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [typeFilter])

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      categories
        .filter((cat) => !!cat.parentId)
        .map((cat) => ({
          value: String(cat.id),
          label: cat.name,
        })),
    [categories]
  )

  const initialData: ContentItem | undefined = useMemo(() => {
    if (!Number.isFinite(parsedCategoryId) || parsedCategoryId < 1) {
      return undefined
    }
    const cat = categories.find((c) => c.id === parsedCategoryId)
    if (cat?.parentId == null) {
      return undefined
    }
    return {
      id: 0,
      categoryId: parsedCategoryId,
      type: typeFilter ?? cat.type,
      title: "",
      summary: null,
      bodyHtml: null,
      coverMediaId: null,
      isVisible: true,
      sortOrder: 0,
      viewCount: 0,
      publishedAt: null,
      createdAt: "",
      updatedAt: "",
    }
  }, [parsedCategoryId, categories, typeFilter])

  const handleSubmit = async (data: ContentItemFormData) => {
    setSaving(true)
    try {
      const created = await ContentItemsService.create(data)
      toast.success("Đã thêm bài viết")
      router.replace(`/cms/${created.id}/detail`)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Thêm bài viết thất bại")
      throw err
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <AdminLoadingState />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Thêm bài viết</h1>
      <ContentItemEditor
        active
        mode="create"
        initialData={initialData}
        categoryOptions={categoryOptions}
        onSubmit={handleSubmit}
        isMutating={saving}
        onCancel={() => router.back()}
        variant="page"
      />
    </div>
  )
}

function CMSNewPageShell() {
  const router = useRouter()
  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <Suspense fallback={<AdminLoadingState />}>
          <CMSNewInner />
        </Suspense>
      </div>
    </AdminLayout>
  )
}

export default function CMSNewPage() {
  return <CMSNewPageShell />
}
