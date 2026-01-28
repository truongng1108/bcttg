import { StatusPage } from "@/components/shared/status-page"

export default function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Không có quyền truy cập"
      description="Bạn không có đủ quyền để truy cập trang này. Vui lòng liên hệ quản trị hệ thống nếu cần."
      primaryAction={{ label: "Về Dashboard", href: "/" }}
      secondaryAction={{ label: "Về CMS", href: "/cms" }}
    />
  )
}

