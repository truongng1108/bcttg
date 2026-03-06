"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { CMSContent } from "@/components/admin/cms/cms-content"
import { PublicContentList } from "@/components/public/content/public-content-list"
import { HybridRoute } from "@/components/shared/hybrid/hybrid-route"

export default function CMSTruyenThongPage() {
  return (
    <HybridRoute
      public={<PublicContentList presetType="TRUYEN_THONG" />}
      admin={
        <AdminLayout>
          <CMSContent />
        </AdminLayout>
      }
    />
  )
}


