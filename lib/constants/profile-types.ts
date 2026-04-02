export const PROFILE_TYPES = {
  THU_TRUONG: "THU_TRUONG",
  CHIEN_SI: "CHIEN_SI",
  ANH_HUNG: "ANH_HUNG",
} as const

export type ProfileType = (typeof PROFILE_TYPES)[keyof typeof PROFILE_TYPES]

export const PROFILE_TYPE_LABELS: Record<ProfileType, string> = {
  [PROFILE_TYPES.THU_TRUONG]: "Thủ trưởng",
  [PROFILE_TYPES.CHIEN_SI]: "Chiến sĩ",
  [PROFILE_TYPES.ANH_HUNG]: "Anh hùng",
}

export const PROFILE_TYPE_VALUES: ProfileType[] = [
  PROFILE_TYPES.THU_TRUONG,
  PROFILE_TYPES.CHIEN_SI,
  PROFILE_TYPES.ANH_HUNG,
]

export const PROFILE_TYPE_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: PROFILE_TYPES.THU_TRUONG, label: PROFILE_TYPE_LABELS[PROFILE_TYPES.THU_TRUONG] },
  { value: PROFILE_TYPES.CHIEN_SI, label: PROFILE_TYPE_LABELS[PROFILE_TYPES.CHIEN_SI] },
  { value: PROFILE_TYPES.ANH_HUNG, label: PROFILE_TYPE_LABELS[PROFILE_TYPES.ANH_HUNG] },
] as const

const PROFILE_TYPE_SET = new Set<string>(PROFILE_TYPE_VALUES)

export const isProfileType = (value: string): value is ProfileType => {
  return PROFILE_TYPE_SET.has(value)
}

