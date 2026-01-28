"use client"

import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SongTableRow } from "./songs-table-row"
import type { Song } from "@/lib/data/types"

export interface SongsTableProps {
  songs: Song[]
  startIndex: number
  playingId: number | null
  onTogglePlay: (id: number) => void
  onDelete: (song: Song) => void
}

export function SongsTable({
  songs,
  startIndex,
  playingId,
  onTogglePlay,
  onDelete,
}: SongsTableProps) {
  return (
    <Card className="border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead className="w-12"></TableHead>
            <TableHead>Tên ca khúc</TableHead>
            <TableHead>Tác giả</TableHead>
            <TableHead className="text-center">Năm</TableHead>
            <TableHead className="text-center">Thời lượng</TableHead>
            <TableHead className="text-center">Thể loại</TableHead>
            <TableHead className="text-center">Trạng thái</TableHead>
            <TableHead className="text-center">Lượt nghe</TableHead>
            <TableHead className="text-center">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {songs.map((song, index) => (
            <SongTableRow
              key={song.id}
              song={song}
              index={startIndex + index}
              playingId={playingId}
              onTogglePlay={onTogglePlay}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
