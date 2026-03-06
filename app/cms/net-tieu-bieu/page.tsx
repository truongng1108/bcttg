"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { CMSContent } from "@/components/admin/cms/cms-content"
import { PublicContentList } from "@/components/public/content/public-content-list"
import { HybridRoute } from "@/components/shared/hybrid/hybrid-route"

export default function CMSNetTieuBieuPage() {
  return (
    <HybridRoute
      public={<PublicContentList presetType="NET_TIEU_BIEU" />}
      admin={
        <AdminLayout>
          <CMSContent />
        </AdminLayout>
      }
    />
  )
}


