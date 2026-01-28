import type { Dispatch, SetStateAction } from "react"

export function createDeleteHandler<T extends { id: string | number }>(
  setItems: Dispatch<SetStateAction<T[]>>,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSelected: Dispatch<SetStateAction<T | null>>
) {
  return (item: T) => {
    setSelected(item)
    setDialogOpen(true)
  }
}

export function createConfirmDeleteHandler<T extends { id: string | number }>(
  setItems: Dispatch<SetStateAction<T[]>>,
  setDialogOpen: Dispatch<SetStateAction<boolean>>,
  setSelected: Dispatch<SetStateAction<T | null>>,
  selectedItem: T | null
) {
  return () => {
    if (selectedItem) {
      setItems((prev) => prev.filter((item) => item.id !== selectedItem.id))
    }
    setDialogOpen(false)
    setSelected(null)
  }
}

export function createToggleHandler<T extends { id: string | number }>(
  setItems: Dispatch<SetStateAction<T[]>>,
  field: keyof T
) {
  return (id: T["id"], value: T[keyof T]) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }
}
