import { StatusPage } from "@/components/shared/status-page"

export default function MaintenancePage() {
  return (
    <StatusPage
      code="503"
      title="Hệ thống đang bảo trì"
      description="Chúng tôi đang nâng cấp để hệ thống hoạt động ổn định hơn. Vui lòng quay lại sau."
      primaryAction={{ label: "Về Dashboard", href: "/" }}
      secondaryAction={{ label: "Về CMS", href: "/cms" }}
    />
  )
}

