"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { CMSContent } from "@/components/admin/cms/cms-content"
import { PublicContentList } from "@/components/public/content/public-content-list"
import { HybridRoute } from "@/components/shared/hybrid/hybrid-route"
import { CMS_PRESET_TYPES } from "@/lib/constants/content-types"

export default function CMSSoDoLichSuPage() {
  return (
    <HybridRoute
      public={<PublicContentList presetType={CMS_PRESET_TYPES.SO_DO_LICH_SU} />}
      admin={
        <AdminLayout>
          <CMSContent presetType={CMS_PRESET_TYPES.SO_DO_LICH_SU} />
        </AdminLayout>
      }
    />
  )
}

