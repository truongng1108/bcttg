"use client"

import { useEffect, useState } from "react"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { DetailSection } from "@/components/admin/shared/detail-section"
import { DetailRow } from "@/components/admin/shared/detail-row"
import { NotesService } from "@/lib/services/notes.service"
import type { PersonalNote } from "@/lib/types/api"
import { toast } from "sonner"
import { formatDateDetail, formatReminderDate } from "@/lib/utils/date"
import { Badge } from "@/components/ui/badge"

interface NoteDetailContentProps {
  readonly noteId: number
}

export function NoteDetailContent({ noteId }: NoteDetailContentProps) {
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState<PersonalNote | null>(null)

  useEffect(() => {
    if (noteId) {
      loadDetail()
    }
  }, [noteId])

  const loadDetail = async () => {
    if (!noteId) return
    setLoading(true)
    try {
      const noteData = await NotesService.getById(noteId)
      setNote(noteData)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Không tải được thông tin ghi chú")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <AdminLoadingState />
  }

  if (!note) {
    return <div className="py-8 text-center text-muted-foreground">Không tìm thấy ghi chú</div>
  }

  return (
    <div className="space-y-6">
      {/* Thông tin cơ bản */}
      <DetailSection title="Thông tin cơ bản">
        <DetailRow label="Tiêu đề" value={note.title} />
        <DetailRow
          label="Trạng thái"
          renderValue={() => (
            <div className="flex gap-2">
              {note.isPinned && (
                <Badge variant="default" className="bg-yellow-500">
                  Đã ghim
                </Badge>
              )}
              {note.isArchived && (
                <Badge variant="secondary">Đã lưu trữ</Badge>
              )}
              {!note.isPinned && !note.isArchived && (
                <Badge variant="outline">Bình thường</Badge>
              )}
            </div>
          )}
        />
        {note.colorCode && (
          <DetailRow
            label="Màu sắc"
            renderValue={() => (
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: note.colorCode }}
                />
                <span className="text-sm">{note.colorCode}</span>
              </div>
            )}
          />
        )}
      </DetailSection>

      {/* Nội dung */}
      <DetailSection title="Nội dung">
        <div className="py-3">
          <pre className="whitespace-pre-wrap text-sm font-sans">{note.content}</pre>
        </div>
      </DetailSection>

      {/* Nhắc nhở */}
      {note.reminderAt && (
        <DetailSection title="Nhắc nhở">
          <DetailRow label="Thời gian nhắc nhở" value={formatReminderDate(note.reminderAt)} />
        </DetailSection>
      )}

      {/* Thông tin thời gian */}
      <DetailSection title="Thông tin thời gian">
        <DetailRow label="Ngày tạo" value={formatDateDetail(note.createdAt)} />
        <DetailRow label="Ngày cập nhật" value={formatDateDetail(note.updatedAt)} />
      </DetailSection>

      {/* Thông tin kỹ thuật */}
      <DetailSection title="Thông tin kỹ thuật">
        <DetailRow label="ID" value={note.id} copyable />
        <DetailRow label="User ID" value={note.userId} copyable />
      </DetailSection>
    </div>
  )
}

