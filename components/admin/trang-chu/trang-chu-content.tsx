"use client"

import { useEffect, useState } from "react"
import { Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { HomeModulesService } from "@/lib/services/home-modules.service"
import type { HomeModule } from "@/lib/data/types"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { toast } from "sonner"

export function TrangChuContent() {
  const [modules, setModules] = useState<HomeModule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    HomeModulesService.getPublicModules()
      .then((data) => setModules(data))
      .catch((err) => {
        toast.error(err instanceof Error ? err.message : "Không tải được module trang chủ")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <AdminLoadingState />
  }

  const sortedModules = [...modules].sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <Home className="h-5 w-5 text-accent" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              Trang chủ
            </h1>
            <p className="text-sm text-muted-foreground">
              Các module đang hiển thị trên trang chủ
            </p>
          </div>
        </div>
      </div>

      {sortedModules.length === 0 ? (
        <div className="rounded-md border border-border bg-card p-8 text-center text-muted-foreground">
          Chưa có module nào được bật
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sortedModules.map((module) => {
            const Icon = module.icon
            return (
              <Card
                key={module.id}
                className="border-primary/20 bg-card transition-all hover:border-primary/40"
              >
                <CardContent className="flex flex-col gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-foreground">
                        {module.name}
                      </h3>
                      {module.itemCount >= 0 && (
                        <p className="text-xs text-muted-foreground">
                          {module.itemCount} mục
                        </p>
                      )}
                    </div>
                  </div>
                  {module.description ? (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
