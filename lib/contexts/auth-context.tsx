"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import { AuthService } from "@/lib/services/auth.service"
import type { UserAccount } from "@/lib/types/api"

interface AuthContextType {
  isAuthenticated: boolean
  me: UserAccount | null
  login: (phone: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: Readonly<{ children: ReactNode }>) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [me, setMe] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const init = async () => {
      const token = AuthService.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const account = await AuthService.getMe()
        if (!cancelled) {
          setMe(account)
          setIsAuthenticated(true)
        }
      } catch {
        if (!cancelled) {
          setMe(null)
          setIsAuthenticated(false)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    void init()
    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (phone: string, password: string) => {
    await AuthService.login(phone, password)
    try {
      const account = await AuthService.getMe()
      setMe(account)
      setIsAuthenticated(true)
    } catch (err) {
      AuthService.logout()
      setMe(null)
      setIsAuthenticated(false)
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    AuthService.logout()
    setMe(null)
    setIsAuthenticated(false)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated, me, login, logout, isLoading }),
    [isAuthenticated, isLoading, login, logout, me]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

