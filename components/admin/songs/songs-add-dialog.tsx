"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormFieldRHF } from "@/components/admin/shared/form-field-rhf"
import type { Control } from "react-hook-form"
import type { SongCreateFormData } from "@/lib/schemas/song.schema"
import type { SelectOption } from "@/lib/data/types"

export interface SongsAddDialogProps {
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
  readonly control: Control<SongCreateFormData>
  readonly categoryOptions: readonly SelectOption[]
  readonly onSubmit: () => void
  readonly isValid: boolean
}

export function SongsAddDialog({
  open,
  onOpenChange,
  control,
  categoryOptions,
  onSubmit,
  isValid,
}: SongsAddDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-primary">Thêm Ca Khúc Mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin ca khúc truyền thống mới
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FormFieldRHF
            label="Tên ca khúc"
            name="title"
            required
            placeholder="Nhập tên ca khúc"
            control={control}
          />
          <FormFieldRHF
            label="Tác giả"
            name="composer"
            required
            placeholder="Nhập tên tác giả"
            control={control}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormFieldRHF
              label="Năm sáng tác"
              name="year"
              type="number"
              placeholder="VD: 1972"
              control={control}
            />
            <FormFieldRHF
              label="Thể loại"
              name="category"
              type="select"
              placeholder="Chọn thể loại"
              control={control}
              options={categoryOptions}
            />
          </div>
          <FormFieldRHF
            label="Lời bài hát"
            name="lyrics"
            type="textarea"
            placeholder="Nhập lời bài hát..."
            rows={4}
            control={control}
          />
          <FormFieldRHF
            label="File âm thanh"
            name="audio"
            type="file"
            accept="audio/*"
            helpText="Hỗ trợ: MP3, WAV (tối đa 20MB)"
            control={control}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            className="bg-primary text-primary-foreground"
            onClick={onSubmit}
            disabled={!isValid}
          >
            Thêm ca khúc
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
