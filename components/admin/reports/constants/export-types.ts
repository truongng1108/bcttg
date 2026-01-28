export const EXPORT_TYPES = {
  TONG_HOP: "tong-hop",
  NGUOI_DUNG: "nguoi-dung",
  NOI_DUNG: "noi-dung",
  NOI_DUNG_CHI_TIET: "noi-dung-chi-tiet",
  NHAT_KY: "nhat-ky",
  LUOT_XEM: "luot-xem",
  HOAT_DONG: "hoat-dong",
  DANG_NHAP: "dang-nhap",
} as const

export type ExportType = (typeof EXPORT_TYPES)[keyof typeof EXPORT_TYPES]
