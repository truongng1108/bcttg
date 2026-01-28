"use client"

import type { ReactNode } from "react"
import { AlertTriangle, SearchX, ShieldX, Wrench } from "lucide-react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export type StatusPageCode = "403" | "404" | "500" | "503"

export interface StatusPageAction {
  readonly label: string
  readonly href: string
}

export interface StatusPageProps {
  readonly code: StatusPageCode
  readonly title: string
  readonly description?: string
  readonly primaryAction: StatusPageAction
  readonly secondaryAction?: StatusPageAction
  readonly extraAction?: ReactNode
}

export function StatusPage({
  code,
  title,
  description,
  primaryAction,
  secondaryAction,
  extraAction,
}: StatusPageProps) {
  const iconForCode = {
    "404": SearchX,
    "403": ShieldX,
    "503": Wrench,
    "500": AlertTriangle,
  } as const
  const Icon = iconForCode[code]

  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-xl border-border bg-card shadow-sm">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-accent bg-accent/10">
              <Icon className="h-7 w-7 text-accent" />
            </div>
            <div className="mt-5 text-5xl font-extrabold tracking-tight text-primary">
              {code}
            </div>
            <h1 className="mt-3 text-xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            )}

            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-center">
              <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Link href={primaryAction.href}>{primaryAction.label}</Link>
              </Button>
              {secondaryAction && (
                <Button asChild variant="outline" className="bg-transparent">
                  <Link href={secondaryAction.href}>{secondaryAction.label}</Link>
                </Button>
              )}
              {extraAction && <span className="contents">{extraAction}</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

