"use client"

import { Play, Pause, Trash2, FileAudio, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TableCell, TableRow } from "@/components/ui/table"
import { formatNumber } from "@/lib/utils/formatters"
import type { Song } from "@/lib/data/types"

export interface SongTableRowProps {
  readonly song: Song
  readonly index: number
  readonly playingId: number | null
  readonly onTogglePlay: (id: number) => void
  readonly onDelete: (song: Song) => void
}

export function SongTableRow({
  song,
  index,
  playingId,
  onTogglePlay,
  onDelete,
}: SongTableRowProps) {
  return (
    <TableRow className="hover:bg-muted/30">
      <TableCell className="text-center font-medium text-muted-foreground">
        {index + 1}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onTogglePlay(song.id)}
          disabled={!song.hasAudio}
          className={song.hasAudio ? "text-primary hover:bg-primary/10" : "text-muted-foreground"}
        >
          {playingId === song.id ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium text-foreground">{song.title}</p>
          <div className="flex gap-1 mt-1">
            {song.hasAudio && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                <FileAudio className="h-3 w-3 mr-1" />
                Audio
              </Badge>
            )}
            {song.hasLyrics && (
              <Badge variant="outline" className="text-xs px-1.5 py-0">
                Lời bài hát
              </Badge>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{song.composer}</TableCell>
      <TableCell className="text-center">{song.year}</TableCell>
      <TableCell className="text-center">
        <span className="flex items-center justify-center gap-1 text-muted-foreground">
          <Clock className="h-3 w-3" />
          {song.duration}
        </span>
      </TableCell>
      <TableCell className="text-center">
        <Badge variant="secondary" className="bg-accent/10 text-accent">
          {song.category.label}
        </Badge>
      </TableCell>
      <TableCell className="text-center">
        <Badge
          variant={song.status === "active" ? "default" : "secondary"}
          className={song.status === "active"
            ? "bg-[#2E7D32] text-white"
            : "bg-muted text-muted-foreground"
          }
        >
          {song.status === "active" ? "Hiển thị" : "Đang ẩn"}
        </Badge>
      </TableCell>
      <TableCell className="text-center font-medium">
        {formatNumber(song.plays)}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(song)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}
