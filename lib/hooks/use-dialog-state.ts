import { useState } from "react"

export function useDialogState<T = number | null>() {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<T | null>(null)

  const openDialog = (id: T) => {
    setSelectedId(id)
    setOpen(true)
  }

  const closeDialog = () => {
    setOpen(false)
    setSelectedId(null)
  }

  return {
    open,
    selectedId,
    openDialog,
    closeDialog,
    setOpen: (value: boolean) => {
      setOpen(value)
      if (!value) setSelectedId(null)
    },
  }
}

