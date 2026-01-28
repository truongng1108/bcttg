"use client"

import type React from "react"

export interface AdminSectionProps {
  readonly header: React.ReactNode
  readonly children: React.ReactNode
  readonly footer?: React.ReactNode
  readonly className?: string
}

export function AdminSection({ header, children, footer, className }: AdminSectionProps) {
  return (
    <div className={className ?? "space-y-6"}>
      {header}
      {children}
      {footer}
    </div>
  )
}
