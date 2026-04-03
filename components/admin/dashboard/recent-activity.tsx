"use client"

import { cn } from "@/lib/utils"
import { CheckCircle2, XCircle } from "lucide-react"

import type { ActivityItem } from "@/lib/data/types"

interface RecentActivityProps {
  readonly activities: ActivityItem[]
}

const statusColors: Record<ActivityItem["status"], string> = {
  SUCCESS: "bg-[#2E7D32]/10 text-[#2E7D32]",
  FAILED: "bg-destructive/10 text-destructive",
}

export function RecentActivity({ activities }: Readonly<RecentActivityProps>) {

  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          Hoạt động gần đây
        </h3>
      </div>
      <div className="divide-y divide-border">
        {activities.map((activity, index) => {
          const Icon = activity.status === "SUCCESS" ? CheckCircle2 : XCircle
          const activityKey = `${activity.createdAt}-${activity.title}-${index}`
          return (
            <div
              key={activityKey}
              className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/30"
            >
              <div
                className={cn(
                  "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded",
                  statusColors[activity.status] || "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.title}</span>
                  <span className="text-muted-foreground"> - {activity.detail}</span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {activity.actor} &bull; {activity.createdAt}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <div className="border-t border-border px-4 py-2">
        <button className="text-sm font-medium text-primary hover:underline">
          Xem tất cả hoạt động
        </button>
      </div>
    </div>
  )
}
