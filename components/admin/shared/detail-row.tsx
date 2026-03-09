"use client"

import { Copy, Check } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DetailRowProps {
  readonly label: string
  readonly value?: string | number | null
  readonly copyable?: boolean
  readonly className?: string
  readonly renderValue?: () => React.ReactNode
}

export function DetailRow({
  label,
  value,
  copyable = false,
  className,
  renderValue,
}: DetailRowProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (value === null || value === undefined) return
    try {
      await navigator.clipboard.writeText(String(value))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard errors
    }
  }

  let displayValue: React.ReactNode = "—"
  if (value !== null && value !== undefined) {
    if (renderValue) {
      displayValue = renderValue()
    } else {
      displayValue = String(value)
    }
  }

  return (
    <div className={cn("flex items-start gap-4 py-3 border-b last:border-0", className)}>
      <div className="w-32 flex-shrink-0">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-foreground break-words">{displayValue}</div>
      </div>
      {copyable && value !== null && value !== undefined && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 flex-shrink-0"
          onClick={handleCopy}
          title={copied ? "Đã sao chép" : "Sao chép"}
        >
          {copied ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      )}
    </div>
  )
}

