"use client"

import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatusPage } from "@/components/shared/status-page"

export default function ErrorPage({
  reset,
}: Readonly<{
  reset: () => void
}>) {
  return (
    <StatusPage
      code="500"
      title="Đã xảy ra lỗi"
      description="Hệ thống gặp sự cố trong quá trình xử lý. Vui lòng thử lại hoặc quay về Dashboard."
      primaryAction={{ label: "Về Dashboard", href: "/" }}
      secondaryAction={{ label: "Về CMS", href: "/cms" }}
      extraAction={
        <Button variant="outline" className="bg-transparent" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Thử lại
        </Button>
      }
    />
  )
}

