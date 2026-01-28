import { songsData } from "@/lib/data/mock/songs"
import type { Song } from "@/lib/data/types"

let songsStore: Song[] = [...songsData]

export class SongsService {
  static async getAll(): Promise<Song[]> {
    return songsStore
  }

  static async getById(id: number): Promise<Song | null> {
    return songsStore.find((song) => song.id === id) || null
  }

  static async create(data: Omit<Song, "id">): Promise<Song> {
    const maxId = songsStore.reduce((max, song) => Math.max(max, song.id), 0)
    const newSong: Song = {
      id: maxId + 1,
      title: String(data.title),
      composer: String(data.composer),
      year: Number(data.year),
      duration: String(data.duration),
      category: { value: String(data.category.value), label: String(data.category.label) },
      status: data.status === "active" || data.status === "hidden" ? data.status : "active",
      plays: Number(data.plays),
      hasAudio: Boolean(data.hasAudio),
      hasLyrics: Boolean(data.hasLyrics),
    }
    songsStore = [newSong, ...songsStore]
    return newSong
  }

  static async update(id: number, data: Partial<Song>): Promise<Song> {
    const index = songsStore.findIndex((song) => song.id === id)
    if (index === -1) {
      throw new Error(`Song with id ${id} not found`)
    }
    const updated = { ...songsStore[index], ...data }
    songsStore = songsStore.map((song) => (song.id === id ? updated : song))
    return updated
  }

  static async delete(id: number): Promise<boolean> {
    const exists = songsStore.some((song) => song.id === id)
    if (!exists) return false
    songsStore = songsStore.filter((song) => song.id !== id)
    return true
  }
}
