"use client"

import type React from "react"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Home,
  Users,
  LayoutGrid,
  FileText,
  FolderOpen,
  Music,
  StickyNote,
  ClipboardList,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  Star,
  UserCircle,
  Medal,
  Award,
  BarChart3
} from "lucide-react"
import { usePathname } from "next/navigation"
import { NavItemComponent } from "./admin-sidebar/components/nav-item"

interface AdminSidebarProps {
  readonly collapsed: boolean
  readonly onToggle: () => void
}

interface NavItem {
  id: string
  title: string
  href?: string
  icon: React.ElementType
  children?: NavItem[]
}

const brandConfig = {
  logoSrc: "https://tailieuvanphong.com/wp-content/uploads/2024/08/logo-qdnd-vietnam-9.jpg",
  logoAlt: "Logo QĐND Việt Nam",
  line1: "BINH CHỦNG",
  line2: "Tăng Thiết Giáp",
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    id: "trang-chu",
    title: "Trang chủ",
    href: "/trang-chu",
    icon: Home,
  },
  {
    id: "accounts",
    title: "Quản lý tài khoản",
    href: "/tai-khoan",
    icon: Users,
  },
  {
    id: "home-modules",
    title: "Module trang chủ",
    href: "/module-trang-chu",
    icon: LayoutGrid,
  },
  {
    id: "content",
    title: "Quản lý nội dung",
    icon: FileText,
    children: [
      { id: "cms", title: "CMS Nội dung", href: "/cms", icon: FileText },
      { id: "cms-truyen-thong", title: "Truyền thống", href: "/cms/truyen-thong", icon: Shield },
      { id: "cms-net-tieu-bieu", title: "Nét tiêu biểu", href: "/cms/net-tieu-bieu", icon: Star },
    ],
  },
  {
    id: "profiles",
    title: "Hồ sơ dữ liệu",
    href: "/ho-so",
    icon: FolderOpen,
    children: [
      { id: "ho-so-thu-truong", title: "Thủ trưởng", href: "/ho-so/thu-truong", icon: UserCircle },
      { id: "ho-so-chien-si", title: "Chiến sĩ", href: "/ho-so/chien-si", icon: Medal },
      { id: "ho-so-anh-hung", title: "Anh hùng", href: "/ho-so/anh-hung", icon: Award },
    ],
  },
  {
    id: "songs",
    title: "Ca khúc truyền thống",
    href: "/ca-khuc",
    icon: Music,
  },
  {
    id: "notes",
    title: "Ghi chú cá nhân",
    href: "/ghi-chu",
    icon: StickyNote,
  },
  {
    id: "logs",
    title: "Nhật ký hệ thống",
    href: "/nhat-ky",
    icon: ClipboardList,
  },
  {
    id: "reports",
    title: "Báo cáo",
    href: "/bao-cao",
    icon: BarChart3,
  },
  {
    id: "settings",
    title: "Cấu hình hệ thống",
    href: "/cau-hinh",
    icon: Settings,
  },
]

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo & Tên hệ thống */}
      <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-sidebar-primary">
              <img 
                src={brandConfig.logoSrc} 
                alt={brandConfig.logoAlt} 
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wide text-sidebar-primary">
                {brandConfig.line1}
              </span>
              <span className="text-xs font-medium text-sidebar-foreground">
                {brandConfig.line2}
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 min-h-10 min-w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-sidebar-primary">
            <img 
              src={brandConfig.logoSrc} 
              alt={brandConfig.logoAlt} 
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.id}
              item={{
                id: item.id,
                href: item.href,
                label: item.title,
                icon: item.icon,
                children: item.children?.map((child) => ({
                  id: child.id,
                  href: child.href,
                  label: child.title,
                  icon: child.icon,
                })),
              }}
              collapsed={collapsed}
              pathname={pathname}
            />
          ))}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="border-t border-sidebar-border p-2">
        <button
          onClick={onToggle}
          className="flex w-full items-center justify-center rounded p-2 text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
          title={collapsed ? "Mở rộng" : "Thu gọn"}
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  )
}
