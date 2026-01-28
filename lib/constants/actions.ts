import {
  LogIn,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Shield,
} from "lucide-react"
import type React from "react"

export const actionIcons: Record<string, React.ElementType> = {
  login: LogIn,
  logout: LogOut,
  create: Plus,
  update: Edit,
  delete: Trash2,
  view: Eye,
  error: AlertTriangle,
  security: Shield,
}
