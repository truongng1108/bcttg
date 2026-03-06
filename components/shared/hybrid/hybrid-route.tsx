"use client"

import type { ReactNode } from "react"
import { useAuth } from "@/lib/contexts/auth-context"

interface HybridRouteProps {
  readonly admin: ReactNode
  readonly public: ReactNode
}

export function HybridRoute({ admin, public: publicNode }: HybridRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="container mx-auto min-h-screen px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        </div>
      </main>
    )
  }

  if (isAuthenticated) {
    return admin
  }

  return publicNode
}


