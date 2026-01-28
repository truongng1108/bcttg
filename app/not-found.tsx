import { StatusPage } from "@/components/shared/status-page"

export default function NotFound() {
  return (
    <StatusPage
      code="404"
      title="Không tìm thấy trang"
      description="Trang bạn đang truy cập không tồn tại hoặc đã được di chuyển."
      primaryAction={{ label: "Về Dashboard", href: "/" }}
      secondaryAction={{ label: "Về CMS", href: "/cms" }}
    />
  )
}

