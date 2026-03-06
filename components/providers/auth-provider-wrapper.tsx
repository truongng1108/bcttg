"use client"

import { AuthProvider } from "@/lib/contexts/auth-context"

export function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

