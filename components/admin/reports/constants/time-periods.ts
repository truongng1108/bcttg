export const TIME_PERIODS = [
  { value: "week", label: "Tuần này" },
  { value: "month", label: "Tháng này" },
  { value: "quarter", label: "Quý này" },
  { value: "year", label: "Năm 2026" },
] as const

export type TimePeriod = (typeof TIME_PERIODS)[number]["value"]
