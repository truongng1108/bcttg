"use client"

import { useRouter } from "next/navigation"
import { Menu, LogOut, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/contexts/auth-context"

interface AdminHeaderProps {
  readonly onToggleSidebar: () => void
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/dang-nhap")
  }
  return (
    <header className="relative flex h-16 items-center justify-between border-b border-border bg-card px-4 shadow-sm">
      {/* Đường viền accent trên cùng */}
      <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-primary via-accent to-primary" />
      
      {/* Left section */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="text-primary hover:bg-primary/10"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Thu/mở menu</span>
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h1 className="text-base font-bold uppercase leading-tight tracking-wide text-primary">
              SỔ TAY ĐIỆN TỬ GIÁO DỤC TRUYỀN THỐNG
            </h1>
            <p className="text-xs font-medium text-muted-foreground">
              Hệ thống Quản trị Nội bộ - Binh chủng Tăng Thiết Giáp
            </p>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:bg-primary/10 hover:text-primary"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          <span className="sr-only">Thông báo</span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-3 text-foreground hover:bg-primary/10"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden flex-col items-start md:flex">
                <span className="text-sm font-semibold text-foreground">Nguyễn Huy Hoàng</span>
                <span className="text-xs text-muted-foreground">
                  Quản trị viên
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-semibold text-foreground">Nguyễn Huy Hoàng</p>
              <p className="text-xs text-muted-foreground">
                Phòng Chính trị - Binh chủng TTG
              </p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              Thông tin cá nhân
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
