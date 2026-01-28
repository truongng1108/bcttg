"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import type { NavItemComponentProps } from "@/lib/types/components"

const isPathActive = (pathname: string, href?: string) => {
  if (!href) return false
  return pathname === href || pathname.startsWith(href + "/")
}

const getFirstChildHref = (children?: ReadonlyArray<{ href?: string }>) => {
  return children?.find((child) => child.href)?.href
}

const getFallbackHref = (item: NavItemComponentProps["item"]) => {
  return item.href ?? getFirstChildHref(item.children) ?? "/"
}

function NavGroup({
  item,
  collapsed,
  pathname,
  level = 0,
}: Readonly<NavItemComponentProps>) {
  const Icon = item.icon
  const isActive = isPathActive(pathname, item.href)
  const isChildActive = item.children?.some((child) => isPathActive(pathname, child.href)) ?? false
  const [open, setOpen] = useState(isActive || isChildActive)

  if (collapsed) {
    return <NavLeaf item={item} collapsed={collapsed} pathname={pathname} level={level} />
  }

  return (
    <li>
      <button
        type="button"
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
          level > 0 && "pl-9",
          isActive || isChildActive
            ? "border-l-2 border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-foreground shadow-sm"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive || isChildActive ? "text-sidebar-primary" : "",
          )}
        />
        <span className="flex-1 truncate text-left">{item.label}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 transition-transform",
            open ? "rotate-180" : "",
          )}
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-1">
          {item.children?.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              collapsed={collapsed}
              pathname={pathname}
              level={level + 1}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function NavLeaf({
  item,
  collapsed,
  pathname,
  level = 0,
}: Readonly<NavItemComponentProps>) {
  const Icon = item.icon
  const href = getFallbackHref(item)
  const isActive = isPathActive(pathname, href)

  if (!href) {
    return null
  }

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-200",
          collapsed && "justify-center px-2",
          level > 0 && !collapsed && "pl-9",
          isActive
            ? "border-l-2 border-sidebar-primary bg-sidebar-accent font-semibold text-sidebar-foreground shadow-sm"
            : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
        )}
        title={collapsed ? item.label : undefined}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0",
            isActive ? "text-sidebar-primary" : "",
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    </li>
  )
}

export function NavItemComponent({
  item,
  collapsed,
  pathname,
  level = 0,
}: Readonly<NavItemComponentProps>) {
  const hasChildren = item.children && item.children.length > 0
  if (hasChildren) {
    return <NavGroup item={item} collapsed={collapsed} pathname={pathname} level={level} />
  }
  return <NavLeaf item={item} collapsed={collapsed} pathname={pathname} level={level} />
}
