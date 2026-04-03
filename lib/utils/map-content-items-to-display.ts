import type { ContentCategory, ContentItem } from "@/lib/types/api"
import type { CMSItemDisplay } from "@/lib/types/display"

export function mapContentItemsToDisplay(
  items: readonly ContentItem[],
  contentCategories: readonly ContentCategory[]
): CMSItemDisplay[] {
  return items.map((item) => {
    const category = contentCategories.find((c) => c.id === item.categoryId)
    return {
      id: String(item.id),
      title: item.title,
      category: category?.name || "Chưa phân loại",
      author: "",
      status: item.isVisible ? "active" : "hidden",
      views: item.viewCount,
      publishedAt: item.publishedAt || item.createdAt,
      updatedAt: item.updatedAt,
      order: item.sortOrder,
      isVisible: item.isVisible,
      categoryId: item.categoryId,
    }
  })
}
