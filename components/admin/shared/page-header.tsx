"use client"

import type React from "react"
import type { PageHeaderProps } from "@/lib/types/components"

export function PageHeader({ icon: Icon, title, description, actions, metadata }: PageHeaderProps) {
  if (Icon) {
    return (
      <div className="flex items-center justify-between rounded-md border border-primary/20 bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
            <Icon className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wide text-primary">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
        {metadata && <div className="text-right">{metadata}</div>}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
      {metadata && <div className="text-right">{metadata}</div>}
    </div>
  )
}
