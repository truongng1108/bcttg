"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface PublicListShellProps {
  readonly title: string
  readonly description: string
  readonly controls: ReactNode
  readonly children: ReactNode
  readonly isLoading: boolean
  readonly currentPage: number
  readonly totalPages: number
  readonly onPrevPage: () => void
  readonly onNextPage: () => void
}

export function PublicListShell({
  title,
  description,
  controls,
  children,
  isLoading,
  currentPage,
  totalPages,
  onPrevPage,
  onNextPage,
}: PublicListShellProps) {
  return (
    <main className="container mx-auto min-h-screen px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>

        <div className="mb-6">{controls}</div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          </div>
        ) : (
          children
        )}

        {!isLoading && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" onClick={onPrevPage} disabled={currentPage <= 1}>
              Trước
            </Button>
            <span className="text-sm text-muted-foreground">
              Trang {currentPage} / {totalPages}
            </span>
            <Button variant="outline" onClick={onNextPage} disabled={currentPage >= totalPages}>
              Sau
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}


