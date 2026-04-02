"use client"

import { useEffect, useState } from "react"
import { FileText, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProfileType } from "@/lib/constants/profile-types"
import { PROFILE_TYPE_LABELS, PROFILE_TYPE_VALUES } from "@/lib/constants/profile-types"

interface DataProfileUnitTreeProps {
  readonly presetType?: ProfileType | null
  readonly unitNamesByType: Record<ProfileType, readonly string[]>
  readonly selectedProfileType: ProfileType | null
  readonly selectedUnitName: string | null
  readonly onSelectAll: () => void
  readonly onSelectProfileType: (type: ProfileType) => void
  readonly onSelectUnit: (type: ProfileType, unitName: string) => void
}

export function DataProfileUnitTree({
  presetType = null,
  unitNamesByType,
  selectedProfileType,
  selectedUnitName,
  onSelectAll,
  onSelectProfileType,
  onSelectUnit,
}: DataProfileUnitTreeProps) {
  const [expandedTypes, setExpandedTypes] = useState<Set<ProfileType>>(() => new Set())

  useEffect(() => {
    if (presetType) {
      setExpandedTypes(new Set())
      return
    }
    if (!selectedProfileType) {
      setExpandedTypes(new Set())
      return
    }
    setExpandedTypes(new Set([selectedProfileType]))
  }, [presetType, selectedProfileType])

  const isRootSelected = presetType
    ? selectedUnitName === null
    : selectedProfileType === null && selectedUnitName === null

  const renderUnitRow = (profileType: ProfileType, unitName: string) => {
    const isSelectedUnit = selectedUnitName === unitName && (presetType ? true : selectedProfileType === profileType)

    return (
      <div
        key={`${profileType}-${unitName}`}
        className={cn(
          "group flex items-center justify-between rounded-md px-2 py-1",
          isSelectedUnit ? "bg-primary/10" : "hover:bg-muted/40"
        )}
        style={{ paddingLeft: 16 }}
      >
        <button
          type="button"
          onClick={() => onSelectUnit(profileType, unitName)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">{unitName}</span>
        </button>
      </div>
    )
  }

  const renderProfileTypeRow = (profileType: ProfileType) => {
    const units = unitNamesByType[profileType] ?? []
    const isExpanded = expandedTypes.has(profileType) || (selectedUnitName !== null && selectedProfileType === profileType)
    const isSelectedType = presetType ? false : selectedProfileType === profileType && selectedUnitName === null
    const Icon = isSelectedType ? FolderOpen : Folder

    return (
      <div key={profileType} className="space-y-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              onSelectProfileType(profileType)
              setExpandedTypes((prev) => {
                const next = new Set(prev)
                if (next.has(profileType)) next.delete(profileType)
                else next.add(profileType)
                return next
              })
            }}
            className={cn(
              "flex flex-1 items-center gap-2 rounded-md px-2 py-1 hover:bg-muted/40",
              isSelectedType && "bg-primary/10"
            )}
            style={{ paddingLeft: 0 }}
          >
            <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{PROFILE_TYPE_LABELS[profileType]}</span>
            <span className="text-xs text-muted-foreground">{units.length}</span>
          </button>
        </div>
        {isExpanded && units.length > 0 && <div className="space-y-1">{units.map((u) => renderUnitRow(profileType, u))}</div>}
        {isExpanded && units.length === 0 && (
          <div className="px-2 py-2 text-center text-sm text-muted-foreground">Chưa có đơn vị</div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div
        className={cn(
          "flex items-center justify-between rounded-md px-2 py-1",
          isRootSelected ? "bg-primary/10" : "hover:bg-muted/40"
        )}
      >
        <button
          type="button"
          onClick={onSelectAll}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="min-w-0 flex-1 truncate text-sm font-medium">Tất cả hồ sơ</span>
        </button>
      </div>

      {presetType ? (
        <div className="space-y-1">
          {unitNamesByType[presetType]?.length ? (
            unitNamesByType[presetType].map((u) => renderUnitRow(presetType, u))
          ) : (
            <div className="px-2 py-3 text-center text-sm text-muted-foreground">Chưa có danh sách đơn vị</div>
          )}
        </div>
      ) : (
        <div className="space-y-1">
          {PROFILE_TYPE_VALUES.map((t) => renderProfileTypeRow(t))}
        </div>
      )}
    </div>
  )
}

