"use client"

import type React from "react"
import { useState } from "react"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar cố định bên trái */}
      <AdminSidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />
      
      {/* Khu vực nội dung chính */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        {/* Header cố định trên cùng */}
        <AdminHeader 
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Nội dung cuộn độc lập */}
        <main className="relative z-10 flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
