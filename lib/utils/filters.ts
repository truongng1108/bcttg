type IndexableValue = string | number | boolean | null | undefined
type PathValue =
  | IndexableValue
  | { [key: string]: PathValue }
  | readonly PathValue[]

function getPathValue(
  record: { [key: string]: PathValue },
  path: readonly string[]
): PathValue {
  let current: PathValue = record

  for (const key of path) {
    if (current === null || current === undefined) return undefined
    if (typeof current !== "object") return undefined
    if (Array.isArray(current)) return undefined
    const next: PathValue = (current as { [key: string]: PathValue })[key]
    current = next
  }

  return current
}

export function filterByFieldValue<T>(
  items: T[],
  selected: string,
  fieldPath: string
): T[] {
  if (selected === "all") return items
  const path = fieldPath.split(".")
  return items.filter((item) => {
    const value = getPathValue(item as { [key: string]: PathValue }, path)
    return typeof value === "string" && value === selected
  })
}

export function filterBySearch<T>(
  items: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query.trim()) return items

  const lowerQuery = query.toLowerCase()
  return items.filter((item) =>
    fields.some((field) => {
      const record = item as Record<string, IndexableValue>
      const value = record[String(field)]
      return typeof value === "string" && value.toLowerCase().includes(lowerQuery)
    })
  )
}

export function filterByCategory<T>(
  items: T[],
  category: string,
  field: keyof T
): T[] {
  return filterByFieldValue(items, category, String(field))
}

export function filterByStatus<T>(
  items: T[],
  status: string,
  field: keyof T
): T[] {
  return filterByFieldValue(items, status, String(field))
}

export function filterByStarred<T extends { starred?: boolean }>(
  items: T[],
  starredFilter: string
): T[] {
  if (starredFilter === "all") return items
  if (starredFilter === "starred") return items.filter((item) => item.starred === true)
  if (starredFilter === "unstarred") return items.filter((item) => !item.starred)
  return items
}
