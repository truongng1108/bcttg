"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { ProfilesContent } from "@/components/admin/profiles/profiles-content"
import { PublicProfilesList } from "@/components/public/profiles/public-profiles-list"
import { HybridRoute } from "@/components/shared/hybrid/hybrid-route"

export default function HoSoThuTruongPage() {
  return (
    <HybridRoute
      public={<PublicProfilesList presetType="THU_TRUONG" />}
      admin={
        <AdminLayout>
          <ProfilesContent />
        </AdminLayout>
      }
    />
  )
}


