export interface ApiResponse<T> {
  success: boolean
  data: T | null
  meta: PaginationMeta | null
  error: ApiError | null
}

export interface ApiError {
  code: string
  message: string
  details: string[]
}

export interface PaginationMeta {
  page: number
  page_size: number
  total_elements: number
  total_pages: number
}

export interface AuthLoginRequest {
  phone: string
  password: string
}

export interface AuthLoginResponse {
  accessToken: string
  tokenType: string
  expiresInMinutes: number
  roles: string[]
}

export interface ContentCategory {
  id: number
  type: string
  parentId: number | null
  name: string
  slug: string
  description: string | null
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface ContentItem {
  id: number
  categoryId: number
  type?: string
  title: string
  summary: string | null
  bodyHtml: string | null
  coverMediaId: number | null
  coverMedia?: MediaAsset | null
  isVisible: boolean
  sortOrder: number
  viewCount: number
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface SongCategory {
  id: number
  name: string
  slug: string
  description: string | null
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Song {
  id: number
  categoryId: number
  title: string
  lyric: string | null
  audioMediaId: number | null
  audioMedia?: MediaAsset | null
  audioUrl: string | null
  durationSec: number | null
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface DataProfile {
  id: number
  profileType: "THU_TRUONG" | "CHIEN_SI" | "ANH_HUNG"
  fullName: string
  position: string | null
  unitName: string | null
  rankName: string | null
  heroTitle: string | null
  contactPhone: string | null
  birthDate: string | null
  hometown: string | null
  summary: string | null
  biography: string | null
  achievements: string | null
  avatarMediaId: number | null
  avatarMedia?: MediaAsset | null
  isVisible: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface PersonalNote {
  id: number
  userId: number
  title: string
  content: string
  colorCode: string | null
  reminderAt: string | null
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface MediaAsset {
  id: number
  url: string
  storageKey: string
  fileName?: string
  mimeType: string
  sizeBytes: number
  createdAt: string
  createdBy?: string
}

export interface DashboardOverview {
  summary: {
    totalPosts: number
    totalProfiles: number
    totalSongs: number
    totalAccounts: number
    viewsToday: number
    editsToday: number
  }
  monthlyContent: Array<{
    label: string
    value: number
  }>
  contentDistribution: Array<{
    label: string
    value: number
  }>
  weeklyVisits: Array<{
    label: string
    value: number
  }>
  recentActivities: Array<{
    id: string
    action: string
    target: string
    user: string
    timestamp: string
    type: string
  }>
  systemStatuses: Array<{
    id: string
    label: string
    status: string
    detail: string
  }>
  pendingItems: Array<{
    id: string
    title: string
    type: string
    author: string
    date: string
    status: string
  }>
}

export type UserRole = "ADMIN" | "MANAGER" | "USER"

export interface UserAccount {
  id: number
  phone: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  profile: UserProfile | null
}

export interface UserProfile {
  fullName: string
  position: string | null
  unitName: string | null
  rankName: string | null
  email: string | null
  address: string | null
  birthDate: string | null
}

export interface ReorderItem {
  id: number
  sortOrder: number
}

export interface ReorderRequest {
  categoryId?: number
  profileType?: "THU_TRUONG" | "CHIEN_SI" | "ANH_HUNG"
  orders: ReorderItem[]
}

export interface VisibilityRequest {
  isVisible: boolean
}

export interface PinRequest {
  value: boolean
}

export interface ArchiveRequest {
  value: boolean
}

export interface ActiveRequest {
  value: boolean
}

export interface RoleRequest {
  role: UserRole
}

export interface ResetPasswordRequest {
  newPassword: string
}

export interface UserProfilePayload {
  fullName: string
  position: string | null
  unitName: string | null
  rankName: string | null
  email: string | null
  address: string | null
  birthDate: string | null
}

export interface UserCreateRequest {
  phone: string
  password: string
  role: UserRole
  isActive: boolean
  profile: UserProfilePayload
}

export interface UserUpdateRequest {
  phone?: string
  role?: UserRole
  isActive?: boolean
  profile?: UserProfilePayload
}

export interface HomeModuleApi {
  id: string
  name: string
  description: string
  enabled: boolean
  sortOrder: number
  itemCount: number
  updatedAt?: string
}

export interface HomeModulesPatchRequest {
  modules: Array<{
    id: string
    name: string
    description: string
    enabled: boolean
    sortOrder: number
  }>
}

export interface SettingsStatusItem {
  id: string
  label: string
  status: string
  detail: string
}

export interface SettingsVersionResponse {
  version?: string
  [key: string]: string | number | boolean | undefined
}

