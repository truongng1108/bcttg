"use client"

import { FileAudio, Eye, Play } from "lucide-react"
import { SimpleStatsCard } from "@/components/admin/shared/simple-stats-card"
import { formatNumber } from "@/lib/utils/formatters"

export interface SongsStatsProps {
  totalSongs: number
  activeSongs: number
  totalPlays: number
}

export function SongsStats({ totalSongs, activeSongs, totalPlays }: SongsStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <SimpleStatsCard
        value={totalSongs}
        label="Tổng số ca khúc"
        icon={FileAudio}
        variant="primary"
      />
      <SimpleStatsCard
        value={activeSongs}
        label="Đang hiển thị"
        icon={Eye}
        variant="accent"
      />
      <SimpleStatsCard
        value={formatNumber(totalPlays)}
        label="Lượt nghe"
        icon={Play}
        variant="default"
      />
    </div>
  )
}
