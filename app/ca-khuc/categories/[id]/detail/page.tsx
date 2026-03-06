"use client"

import { useParams, useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { SongCategoryDetailContent } from "@/components/admin/songs/category-detail-content"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SongCategoryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params?.id ? Number(params.id) : null

  if (!categoryId || isNaN(categoryId)) {
    return (
      <AdminLayout>
        <div className="container mx-auto py-6">
          <div className="py-8 text-center text-destructive">ID không hợp lệ</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        <SongCategoryDetailContent categoryId={categoryId} />
      </div>
    </AdminLayout>
  )
}

