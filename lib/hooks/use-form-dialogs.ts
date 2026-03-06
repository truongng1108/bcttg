import { useState } from "react"

export function useFormDialogs<T = unknown>() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [itemForEdit, setItemForEdit] = useState<T | null>(null)
  const [itemForDelete, setItemForDelete] = useState<T | null>(null)

  const openCreate = () => {
    setItemForEdit(null)
    setCreateOpen(true)
  }

  const openEdit = (item: T) => {
    setItemForEdit(item)
    setEditOpen(true)
  }

  const openDelete = (item: T) => {
    setItemForDelete(item)
    setDeleteOpen(true)
  }

  const closeCreate = () => {
    setCreateOpen(false)
    setItemForEdit(null)
  }

  const closeEdit = () => {
    setEditOpen(false)
    setItemForEdit(null)
  }

  const closeDelete = () => {
    setDeleteOpen(false)
    setItemForDelete(null)
  }

  return {
    createOpen,
    editOpen,
    deleteOpen,
    itemForEdit,
    itemForDelete,
    openCreate,
    openEdit,
    openDelete,
    closeCreate,
    closeEdit,
    closeDelete,
    setCreateOpen,
    setEditOpen,
    setDeleteOpen,
  }
}

