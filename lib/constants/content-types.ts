import type { SelectOption } from "@/lib/data/types"

export const CONTENT_TYPES = {
  TRUYEN_THONG: "TRUYEN_THONG",
  NET_TIEU_BIEU: "NET_TIEU_BIEU",
  SO_DO_LICH_SU: "SO_DO_LICH_SU",
} as const

export type ContentType = (typeof CONTENT_TYPES)[keyof typeof CONTENT_TYPES]

export type CMSPresetType =
  | typeof CONTENT_TYPES.TRUYEN_THONG
  | typeof CONTENT_TYPES.NET_TIEU_BIEU
  | typeof CONTENT_TYPES.SO_DO_LICH_SU

export const CMS_PRESET_TYPES = {
  TRUYEN_THONG: CONTENT_TYPES.TRUYEN_THONG,
  NET_TIEU_BIEU: CONTENT_TYPES.NET_TIEU_BIEU,
  SO_DO_LICH_SU: CONTENT_TYPES.SO_DO_LICH_SU,
} as const

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  [CONTENT_TYPES.TRUYEN_THONG]: "Truyền thống",
  [CONTENT_TYPES.NET_TIEU_BIEU]: "Nét tiêu biểu",
  [CONTENT_TYPES.SO_DO_LICH_SU]: "Sơ đồ lịch sử",
}

export const CONTENT_TYPE_OPTIONS: SelectOption[] = [
  { value: CONTENT_TYPES.TRUYEN_THONG, label: CONTENT_TYPE_LABELS[CONTENT_TYPES.TRUYEN_THONG] },
  { value: CONTENT_TYPES.NET_TIEU_BIEU, label: CONTENT_TYPE_LABELS[CONTENT_TYPES.NET_TIEU_BIEU] },
  { value: CONTENT_TYPES.SO_DO_LICH_SU, label: CONTENT_TYPE_LABELS[CONTENT_TYPES.SO_DO_LICH_SU] },
]

const CONTENT_TYPE_VALUES: readonly ContentType[] = [
  CONTENT_TYPES.TRUYEN_THONG,
  CONTENT_TYPES.NET_TIEU_BIEU,
  CONTENT_TYPES.SO_DO_LICH_SU,
]

const CONTENT_TYPE_SET = new Set<string>(CONTENT_TYPE_VALUES)

export const isContentType = (value: string): value is ContentType => {
  return CONTENT_TYPE_SET.has(value)
}

