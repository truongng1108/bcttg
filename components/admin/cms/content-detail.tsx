"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ContentDetailContent } from "./content-detail-content"

interface ContentDetailProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly contentId: number | null
}

export function ContentDetail({ open, onOpenChange, contentId }: ContentDetailProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết bài viết</DialogTitle>
          <DialogDescription>Thông tin đầy đủ về bài viết</DialogDescription>
        </DialogHeader>
        {contentId ? <ContentDetailContent contentId={contentId} /> : null}
      </DialogContent>
    </Dialog>
  )
}

