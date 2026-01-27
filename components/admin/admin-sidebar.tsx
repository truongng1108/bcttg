"use client"

import React from "react"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
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
  Award
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AdminSidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  children?: NavItem[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Quản lý tài khoản",
    href: "/admin/tai-khoan",
    icon: Users,
  },
  {
    title: "Module trang chủ",
    href: "/admin/module-trang-chu",
    icon: LayoutGrid,
  },
  {
    title: "CMS Nội dung",
    href: "/admin/cms",
    icon: FileText,
    children: [
      { title: "Truyền thống", href: "/admin/cms/truyen-thong", icon: Shield },
      { title: "Nét tiêu biểu", href: "/admin/cms/net-tieu-bieu", icon: Star },
    ],
  },
  {
    title: "Hồ sơ dữ liệu",
    href: "/admin/ho-so",
    icon: FolderOpen,
    children: [
      { title: "Thủ trưởng", href: "/admin/ho-so/thu-truong", icon: UserCircle },
      { title: "Chiến sĩ", href: "/admin/ho-so/chien-si", icon: Medal },
      { title: "Anh hùng", href: "/admin/ho-so/anh-hung", icon: Award },
    ],
  },
  {
    title: "Ca khúc truyền thống",
    href: "/admin/ca-khuc",
    icon: Music,
  },
  {
    title: "Ghi chú cá nhân",
    href: "/admin/ghi-chu",
    icon: StickyNote,
  },
  {
    title: "Nhật ký hệ thống",
    href: "/admin/nhat-ky",
    icon: ClipboardList,
  },
  {
    title: "Cấu hình hệ thống",
    href: "/admin/cau-hinh",
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
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-sidebar-primary bg-sidebar-accent">
              <Star className="h-5 w-5 text-sidebar-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wide text-sidebar-primary">
                BINH CHỦNG
              </span>
              <span className="text-xs font-medium text-sidebar-foreground">
                Tăng Thiết Giáp
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border-2 border-sidebar-primary bg-sidebar-accent">
            <Star className="h-5 w-5 text-sidebar-primary" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavItemComponent
              key={item.href}
              item={item}
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

function NavItemComponent({
  item,
  collapsed,
  pathname,
  level = 0,
}: {
  item: NavItem
  collapsed: boolean
  pathname: string
  level?: number
}) {
  const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon

  if (hasChildren && !collapsed) {
    return (
      <li>
        <div
          className={cn(
            "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium text-sidebar-foreground/70",
            level > 0 && "pl-9"
          )}
        >
          <Icon className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{item.title}</span>
        </div>
        <ul className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent
              key={child.href}
              item={child}
              collapsed={collapsed}
              pathname={pathname}
              level={level + 1}
            />
          ))}
        </ul>
      </li>
    )
  }

  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
          collapsed && "justify-center px-2",
          level > 0 && !collapsed && "pl-9",
          isActive
            ? "border-l-2 border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-foreground shadow-sm"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        )}
        title={collapsed ? item.title : undefined}
      >
        <Icon className={cn(
          "h-4 w-4 flex-shrink-0",
          isActive ? "text-sidebar-primary" : ""
        )} />
        {!collapsed && <span className="truncate">{item.title}</span>}
      </Link>
    </li>
  )
}
