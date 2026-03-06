"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { SongsContent } from "@/components/admin/songs/songs-content"
import { PublicSongsList } from "@/components/public/songs/public-songs-list"
import { HybridRoute } from "@/components/shared/hybrid/hybrid-route"

export default function CaKhucPage() {
  return (
    <HybridRoute
      public={<PublicSongsList />}
      admin={
        <AdminLayout>
          <SongsContent />
        </AdminLayout>
      }
    />
  )
}
