"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { DashboardContent } from "@/components/admin/dashboard/dashboard-content"
import { AccountsContent } from "@/components/admin/accounts/accounts-content"
import { AccountForm } from "@/components/admin/accounts/account-form"
import { ProfileForm } from "@/components/admin/profiles/profile-form"
import { CMSContent } from "@/components/admin/cms/cms-content"
import { ReportsContent } from "@/components/admin/reports/reports-content"
import { HomeModulesContent } from "@/components/admin/home-modules/home-modules-content"
import { SongsContent } from "@/components/admin/songs/songs-content"
import { NotesContent } from "@/components/admin/notes/notes-content"
import { SystemLogsContent } from "@/components/admin/logs/system-logs-content"
import { SettingsContent } from "@/components/admin/settings/settings-content"

type ViewType =
  | "dashboard"
  | "accounts"
  | "account-create"
  | "account-edit"
  | "cms"
  | "profile-create"
  | "reports"
  | "home-modules"
  | "songs"
  | "notes"
  | "logs"
  | "settings"

export default function AdminPage() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardContent />

      case "accounts":
        return <AccountsContent />

      case "account-create":
        return (
          <AccountForm
            mode="create"
            onBack={() => setCurrentView("accounts")}
            onSave={(data) => {
              console.log("Saving account:", data)
              setCurrentView("accounts")
            }}
          />
        )

      case "account-edit":
        return (
          <AccountForm
            mode="edit"
            initialData={{
              rank: "dai-uy",
              fullName: "Nguyễn Văn A",
              username: "nguyenvana",
              email: "nguyenvana@qtdl.vn",
              phone: "0912345678",
              unit: "phong-chinh-tri",
              role: "admin",
              status: "active",
            }}
            onBack={() => setCurrentView("accounts")}
            onSave={(data) => {
              console.log("Updating account:", data)
              setCurrentView("accounts")
            }}
          />
        )

      case "cms":
        return <CMSContent />

      case "profile-create":
        return (
          <ProfileForm
            mode="create"
            profileType="thu-truong"
            onBack={() => setCurrentView("dashboard")}
            onSave={(data) => {
              console.log("Saving profile:", data)
              setCurrentView("dashboard")
            }}
          />
        )

      case "reports":
        return <ReportsContent />

      case "home-modules":
        return <HomeModulesContent />

      case "songs":
        return <SongsContent />

      case "notes":
        return <NotesContent />

      case "logs":
        return <SystemLogsContent />

      case "settings":
        return <SettingsContent />

      default:
        return <DashboardContent />
    }
  }

  return (
    <AdminLayout>
      {/* Quick Navigation for Demo */}
      <div className="mb-6 rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <p className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
          Điều hướng nhanh (Demo)
        </p>
        <div className="flex flex-wrap gap-2">
          <NavButton
            label="Dashboard"
            active={currentView === "dashboard"}
            onClick={() => setCurrentView("dashboard")}
          />
          <NavButton
            label="Quản lý Tài khoản"
            active={currentView === "accounts"}
            onClick={() => setCurrentView("accounts")}
          />
          <NavButton
            label="Form Tạo TK"
            active={currentView === "account-create"}
            onClick={() => setCurrentView("account-create")}
          />
          <NavButton
            label="Form Sửa TK"
            active={currentView === "account-edit"}
            onClick={() => setCurrentView("account-edit")}
          />
          <NavButton
            label="Module Trang chủ"
            active={currentView === "home-modules"}
            onClick={() => setCurrentView("home-modules")}
          />
          <NavButton
            label="Quản lý CMS"
            active={currentView === "cms"}
            onClick={() => setCurrentView("cms")}
          />
          <NavButton
            label="Form Hồ sơ"
            active={currentView === "profile-create"}
            onClick={() => setCurrentView("profile-create")}
          />
          <NavButton
            label="Ca khúc"
            active={currentView === "songs"}
            onClick={() => setCurrentView("songs")}
          />
          <NavButton
            label="Ghi chú"
            active={currentView === "notes"}
            onClick={() => setCurrentView("notes")}
          />
          <NavButton
            label="Nhật ký"
            active={currentView === "logs"}
            onClick={() => setCurrentView("logs")}
          />
          <NavButton
            label="Cấu hình"
            active={currentView === "settings"}
            onClick={() => setCurrentView("settings")}
          />
          <NavButton
            label="Báo cáo"
            active={currentView === "reports"}
            onClick={() => setCurrentView("reports")}
          />
        </div>
      </div>

      {renderContent()}
    </AdminLayout>
  )
}

function NavButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-secondary text-secondary-foreground hover:border-primary/50 hover:bg-primary/10"
      }`}
    >
      {label}
    </button>
  )
}
