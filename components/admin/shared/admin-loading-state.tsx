"use client"

import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export interface AdminLoadingStateProps {
  readonly message?: string
  readonly variant?: "inline" | "card"
}

export function AdminLoadingState({
  message = "Đang tải dữ liệu...",
  variant = "inline",
}: AdminLoadingStateProps) {
  const content = (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{message}</span>
    </div>
  )

  if (variant === "card") {
    return (
      <Card className="border-border">
        <CardContent className="p-4">{content}</CardContent>
      </Card>
    )
  }

  return content
}
