import { notesData } from "@/lib/data/mock/notes"
import type { Note } from "@/lib/data/types"

let notesStore: Note[] = [...notesData]

export class NotesService {
  static async getAll(): Promise<Note[]> {
    return notesStore
  }

  static async getById(id: number): Promise<Note | null> {
    return notesStore.find((note) => note.id === id) || null
  }

  static async create(data: Omit<Note, "id">): Promise<Note> {
    const maxId = notesStore.reduce((max, note) => Math.max(max, note.id), 0)
    const newNote: Note = {
      id: maxId + 1,
      title: String(data.title),
      content: String(data.content),
      category: String(data.category),
      starred: Boolean(data.starred),
      createdAt: String(data.createdAt),
      updatedAt: String(data.updatedAt),
    }
    notesStore = [newNote, ...notesStore]
    return newNote
  }

  static async update(id: number, data: Partial<Note>): Promise<Note> {
    const index = notesStore.findIndex((note) => note.id === id)
    if (index === -1) {
      throw new Error(`Note with id ${id} not found`)
    }
    const updated = { ...notesStore[index], ...data }
    notesStore = notesStore.map((note) => (note.id === id ? updated : note))
    return updated
  }

  static async delete(id: number): Promise<boolean> {
    const exists = notesStore.some((note) => note.id === id)
    if (!exists) return false
    notesStore = notesStore.filter((note) => note.id !== id)
    return true
  }
}
