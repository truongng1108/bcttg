"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Eye, EyeOff, Trash2, Download, GripVertical, Edit, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable, type Column } from "@/components/admin/shared/data-table"
import { StatusBadge, type StatusType } from "@/components/admin/shared/status-badge"
import { ConfirmDialog } from "@/components/admin/shared/confirm-dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SelectOption } from "@/lib/data/types"
import type { ContentCategory, ContentItem } from "@/lib/types/api"
import { ContentItemsService } from "@/lib/services/content-items.service"
import { ContentCategoriesService } from "@/lib/services/content-categories.service"
import { PageHeader } from "@/components/admin/shared/page-header"
import { toast } from "sonner"
import { AdminLoadingState } from "@/components/admin/shared/admin-loading-state"
import { AdminSection } from "@/components/admin/shared/admin-section"
import { AdminStatsGrid } from "@/components/admin/shared/admin-stats-grid"
import { CategoryForm } from "./category-form"
import { ContentForm } from "./content-form"
import { ContentCategoryFormData } from "@/lib/schemas/content-category.schema"
import { ContentItemFormData } from "@/lib/schemas/content-item.schema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { SortableList } from "@/components/admin/shared/sortable/sortable-list"
import { SortableCard } from "@/components/admin/shared/sortable/sortable-card"
import { STATUS_FILTER_OPTIONS } from "@/lib/constants/status-options"
import type { CMSItemDisplay } from "@/lib/types/display"

export function CMSContent() {
  const router = useRouter()
  
  // UI State
  const [activeTab, setActiveTab] = useState<"content" | "categories">("content")
  
  // Table/List State
  const [searchQuery, setSearchQuery] = useState("")
  const [filterValues, setFilterValues] = useState<Record<string, string>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [totalElements, setTotalElements] = useState(0)
  
  // Loading State
  const [isLoading, setIsLoading] = useState(true)
  const [isMutating, setIsMutating] = useState(false)
  
  // Data State
  const [contentData, setContentData] = useState<CMSItemDisplay[]>([])
  const [contentCategories, setContentCategories] = useState<ContentCategory[]>([])
  const [categoryOptions, setCategoryOptions] = useState<SelectOption[]>([])
  const [contentCategoryOptions, setContentCategoryOptions] = useState<SelectOption[]>([])
  
  // Content Item Dialogs
  const [contentFormState, setContentFormState] = useState({
    open: false,
    selectedItem: null as CMSItemDisplay | null,
    itemForEdit: null as ContentItem | null,
  })
  const [contentDeleteState, setContentDeleteState] = useState({
    dialogOpen: false,
    selectedItem: null as CMSItemDisplay | null,
  })
  const [contentHideState, setContentHideState] = useState({
    dialogOpen: false,
    selectedItem: null as CMSItemDisplay | null,
  })
  const [contentReorderState, setContentReorderState] = useState({
    open: false,
    draft: [] as CMSItemDisplay[],
  })
  
  // Category Dialogs
  const [categoryFormState, setCategoryFormState] = useState({
    open: false,
    selectedCategory: null as ContentCategory | null,
  })
  const [categoryDeleteState, setCategoryDeleteState] = useState({
    dialogOpen: false,
    selectedCategory: null as ContentCategory | null,
  })
  const [categoriesReorderState, setCategoriesReorderState] = useState({
    open: false,
    draft: [] as ContentCategory[],
  })
  
  // Static Options - imported from constants

  const loadContent = async () => {
    setIsLoading(true)
    try {
      const params: Record<string, string | number | boolean | null | undefined> = {
        page: currentPage,
        page_size: pageSize,
      }
      if (searchQuery) {
        params.q = searchQuery
      }
      if (filterValues.category && filterValues.category !== "all") {
        params.category_id = Number(filterValues.category)
      }
      if (filterValues.status && filterValues.status !== "all") {
        params.is_visible = filterValues.status === "active"
      }
      const response = await ContentItemsService.getAllAdmin(params)
      const mapped: CMSItemDisplay[] = response.data.map((item) => {
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
      setContentData(mapped)
      if (response.meta) {
        setTotalElements(response.meta.total_elements)
      }
    } catch {
      toast.error("Không tải được dữ liệu CMS")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [currentPage, searchQuery, filterValues])

  useEffect(() => {
    ContentCategoriesService.getAllAdmin({ page_size: 100 })
      .then((response) => {
        setContentCategories(response.data)
        const filterOptions: SelectOption[] = [
          { value: "all", label: "Tất cả" },
          ...response.data.map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          })),
        ]
        setCategoryOptions(filterOptions)

        const childCategoryOptions: SelectOption[] = response.data
          .filter((cat) => !!cat.parentId)
          .map((cat) => ({
            value: String(cat.id),
            label: cat.name,
          }))
        setContentCategoryOptions(childCategoryOptions)
      })
      .catch(() => {
        toast.error("Không tải được danh mục")
      })
  }, [])

  const handleToggleVisibility = async (item: CMSItemDisplay) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await ContentItemsService.toggleVisibility(Number(item.id), !item.isVisible)
      await loadContent()
      toast.success(item.isVisible ? "Đã ẩn bài viết" : "Đã hiện bài viết")
    } catch {
      toast.error("Cập nhật trạng thái bài viết thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const columns: Column<CMSItemDisplay>[] = [
    {
      key: "order",
      title: "",
      width: "w-10",
      render: () => (
        <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" />
      ),
    },
    {
      key: "title",
      title: "Tiêu đề",
      sortable: true,
      render: (_, row) => (
        <div className="max-w-md">
          <span className="line-clamp-2 font-medium">{row.title}</span>
        </div>
      ),
    },
    {
      key: "category",
      title: "Danh mục",
      sortable: true,
      render: (_, row) => (
        <span className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
          {row.category}
        </span>
      ),
    },
    {
      key: "author",
      title: "Tác giả",
      sortable: true,
    },
    {
      key: "views",
      title: "Lượt xem",
      sortable: true,
      render: (value) => (
        <span className="text-muted-foreground">{Number(value).toLocaleString()}</span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (value) => <StatusBadge status={value as StatusType} />,
    },
    {
      key: "visibility",
      title: "Hiển thị",
      render: (_, row) => (
        <Switch
          checked={row.status === "active"}
          onCheckedChange={() => handleToggleVisibility(row)}
          disabled={row.status === "pending"}
        />
      ),
    },
    {
      key: "updatedAt",
      title: "Cập nhật",
      sortable: true,
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
            title="Xem chi tiết"
            onClick={() => {
              router.push(`/cms/${row.id}/detail`)
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Sửa"
            onClick={async () => {
              try {
                const fullItem = await ContentItemsService.getByIdAdmin(Number(row.id))
                setContentFormState({ open: true, selectedItem: row, itemForEdit: fullItem })
              } catch {
                toast.error("Không tải được thông tin bài viết")
              }
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-[#F57C00]"
            title={row.status === "hidden" ? "Hiện" : "Ẩn"}
            onClick={() => {
              setContentHideState({ dialogOpen: true, selectedItem: row })
            }}
          >
            {row.status === "hidden" ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Xóa"
            onClick={() => {
              setContentDeleteState({ dialogOpen: true, selectedItem: row })
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const filters = [
    {
      key: "category",
      label: "Danh mục",
      options: categoryOptions,
    },
    {
      key: "status",
      label: "Trạng thái",
      options: STATUS_FILTER_OPTIONS,
    },
  ]

  const filteredContentData = contentData

  const totalCount = totalElements
  const activeCount = contentData.filter((c) => c.status === "active").length
  const hiddenCount = contentData.filter((c) => c.status === "hidden").length

  const statsItems = [
    { id: "total", value: totalCount, label: "Tổng bài viết", icon: Plus, variant: "default" as const },
    { id: "active", value: activeCount, label: "Đang hiển thị", icon: Eye, variant: "success" as const },
    { id: "hidden", value: hiddenCount, label: "Đã ẩn", icon: EyeOff, variant: "default" as const },
  ]

  const loadCategories = async () => {
    try {
      const response = await ContentCategoriesService.getAllAdmin({ page_size: 100 })
      setContentCategories(response.data)
      const filterOptions: SelectOption[] = [
        { value: "all", label: "Tất cả" },
        ...response.data.map((cat) => ({
          value: String(cat.id),
          label: cat.name,
        })),
      ]
      setCategoryOptions(filterOptions)

      const childCategoryOptions: SelectOption[] = response.data
        .filter((cat) => !!cat.parentId)
        .map((cat) => ({
          value: String(cat.id),
          label: cat.name,
        }))
      setContentCategoryOptions(childCategoryOptions)
    } catch {
      toast.error("Không tải được danh mục")
    }
  }

  const handleCategorySubmit = async (data: ContentCategoryFormData) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      if (categoryFormState.selectedCategory) {
        await ContentCategoriesService.update(categoryFormState.selectedCategory.id, data)
        toast.success("Đã cập nhật danh mục")
      } else {
        await ContentCategoriesService.create(data)
        toast.success("Đã thêm danh mục")
      }
      await loadCategories()
      setCategoryFormState({ open: false, selectedCategory: null })
    } catch {
      toast.error(categoryFormState.selectedCategory ? "Cập nhật danh mục thất bại" : "Thêm danh mục thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleCategoryDelete = async () => {
    if (!categoryDeleteState.selectedCategory) return
    if (isMutating) return
    setIsMutating(true)
    try {
      await ContentCategoriesService.delete(categoryDeleteState.selectedCategory.id)
      await loadCategories()
      toast.success("Đã xóa danh mục")
      setCategoryDeleteState({ dialogOpen: false, selectedCategory: null })
    } catch {
      toast.error("Xóa danh mục thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleCategoryToggleVisibility = async (category: ContentCategory) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await ContentCategoriesService.toggleVisibility(category.id, !category.isVisible)
      await loadCategories()
      toast.success(category.isVisible ? "Đã ẩn danh mục" : "Đã hiện danh mục")
    } catch {
      toast.error("Cập nhật trạng thái danh mục thất bại")
    } finally {
      setIsMutating(false)
    }
  }

  const handleContentSubmit = async (data: ContentItemFormData) => {
    if (isMutating) return
    setIsMutating(true)
    try {
      if (contentFormState.selectedItem) {
        const apiItem = contentData.find((c) => c.id === contentFormState.selectedItem!.id)
        if (apiItem) {
          await ContentItemsService.update(Number(apiItem.id), data)
          toast.success("Đã cập nhật bài viết")
        }
      } else {
        await ContentItemsService.create(data)
        toast.success("Đã thêm bài viết")
      }
      await loadContent()
      setContentFormState({ open: false, selectedItem: null, itemForEdit: null })
    } catch (err) {
      let message = "Thao tác thất bại"
      if (err instanceof Error) {
        message = err.message
      } else if (contentFormState.selectedItem) {
        message = "Cập nhật bài viết thất bại"
      } else {
        message = "Thêm bài viết thất bại"
      }
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const categoryColumns: Column<ContentCategory>[] = [
    {
      key: "name",
      title: "Tên danh mục",
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-medium">{row.name}</span>
          {row.parentId && (
            <span className="ml-2 text-xs text-muted-foreground">
              (Danh mục con)
            </span>
          )}
        </div>
      ),
    },
    {
      key: "type",
      title: "Loại",
      render: (value) => (
        <span className="text-sm text-muted-foreground">
          {value === "TRUYEN_THONG" ? "Truyền thống" : "Nét tiêu biểu"}
        </span>
      ),
    },
    {
      key: "slug",
      title: "Slug",
      render: (_, row) => (
        <span className="font-mono text-xs text-muted-foreground">{row.slug}</span>
      ),
    },
    {
      key: "isVisible",
      title: "Hiển thị",
      render: (_, row) => (
        <Switch
          checked={row.isVisible}
          onCheckedChange={() => handleCategoryToggleVisibility(row)}
          disabled={isMutating}
        />
      ),
    },
    {
      key: "sortOrder",
      title: "Thứ tự",
      sortable: true,
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-blue-600"
            title="Xem chi tiết"
            onClick={() => {
              router.push(`/cms/categories/${row.id}/detail`)
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            title="Sửa"
            onClick={() => {
              setCategoryFormState({ open: true, selectedCategory: row })
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            title="Xóa"
            onClick={() => {
              setCategoryDeleteState({ dialogOpen: true, selectedCategory: row })
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  const confirmDelete = async () => {
    if (!contentDeleteState.selectedItem) return
    if (isMutating) return
    setIsMutating(true)
    try {
      await ContentItemsService.delete(Number(contentDeleteState.selectedItem.id))
      await loadContent()
      toast.success("Đã xóa bài viết")
    } catch {
      toast.error("Xóa bài viết thất bại")
    } finally {
      setIsMutating(false)
      setContentDeleteState({ dialogOpen: false, selectedItem: null })
    }
  }

  const confirmToggleHidden = async () => {
    if (!contentHideState.selectedItem) return
    if (isMutating) return
    setIsMutating(true)
    try {
      const selectedItem = contentHideState.selectedItem
      await ContentItemsService.toggleVisibility(
        Number(selectedItem.id),
        !selectedItem.isVisible
      )
      await loadContent()
      toast.success(selectedItem.isVisible ? "Đã ẩn bài viết" : "Đã hiện bài viết")
    } catch {
      toast.error("Cập nhật trạng thái bài viết thất bại")
    } finally {
      setIsMutating(false)
      setContentHideState({ dialogOpen: false, selectedItem: null })
    }
  }

  const openContentReorder = () => {
    const selectedCategoryId = filterValues.category || "all"
    if (selectedCategoryId === "all") {
      toast.error("Vui lòng chọn danh mục để sắp xếp bài viết")
      return
    }
    const next = [...contentData].sort((a, b) => a.order - b.order)
    setContentReorderState({ open: true, draft: next })
  }

  const openCategoriesReorder = () => {
    const next = [...contentCategories].sort((a, b) => a.sortOrder - b.sortOrder)
    setCategoriesReorderState({ open: true, draft: next })
  }

  const saveContentReorder = async () => {
    const selectedCategoryId = filterValues.category || "all"
    if (selectedCategoryId === "all") {
      toast.error("Vui lòng chọn danh mục để sắp xếp bài viết")
      return
    }
    if (isMutating) return
    setIsMutating(true)
    try {
      await ContentItemsService.reorder({
        categoryId: Number(selectedCategoryId),
        orders: contentReorderState.draft.map((item, index) => ({
          id: Number(item.id),
          sortOrder: index + 1,
        })),
      })
      toast.success("Đã lưu thứ tự bài viết")
      setContentReorderState({ open: false, draft: [] })
      await loadContent()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lưu thứ tự bài viết thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  const saveCategoriesReorder = async () => {
    if (isMutating) return
    setIsMutating(true)
    try {
      await ContentCategoriesService.reorder({
        orders: categoriesReorderState.draft.map((cat, index) => ({
          id: cat.id,
          sortOrder: index + 1,
        })),
      })
      toast.success("Đã lưu thứ tự danh mục")
      setCategoriesReorderState({ open: false, draft: [] })
      await loadCategories()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Lưu thứ tự danh mục thất bại"
      toast.error(message)
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <AdminSection
      header={
        <PageHeader
          title="Quản lý Nội dung CMS"
          description="Quản lý nội dung bài viết, tài liệu truyền thống"
          actions={
            activeTab === "content" ? (
              <>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Xuất Excel
                </Button>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={openContentReorder}
                >
                  <GripVertical className="h-4 w-4" />
                  Sắp xếp
                </Button>
                <Button
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setContentFormState({ open: true, selectedItem: null, itemForEdit: null })
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Thêm bài viết
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent"
                  onClick={openCategoriesReorder}
                >
                  <GripVertical className="h-4 w-4" />
                  Sắp xếp
                </Button>
                <Button
                  className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    setCategoryFormState({ open: true, selectedCategory: null })
                  }}
                >
                  <Plus className="h-4 w-4" />
                  Thêm danh mục
                </Button>
              </>
            )
          }
        />
      }
    >
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "content" | "categories")}>
        <TabsList>
          <TabsTrigger value="content">Bài viết</TabsTrigger>
          <TabsTrigger value="categories">Danh mục</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          {isLoading && <AdminLoadingState />}

          <AdminStatsGrid items={statsItems} columns={4} />

          <DataTable
            columns={columns}
            data={filteredContentData}
            searchPlaceholder="Tìm theo tiêu đề, tác giả..."
            onSearch={(value) => {
              setSearchQuery(value)
              setCurrentPage(1)
            }}
            filters={filters}
            filterValues={filterValues}
            onFilterChange={(key, value) => {
              setFilterValues((prev) => ({ ...prev, [key]: value }))
              setCurrentPage(1)
            }}
            onClearFilters={() => {
              setFilterValues({})
              setCurrentPage(1)
            }}
            totalItems={totalElements}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <DataTable
            columns={categoryColumns}
            data={contentCategories}
            searchPlaceholder="Tìm theo tên danh mục..."
            onSearch={() => {
            }}
            totalItems={contentCategories.length}
            currentPage={1}
            pageSize={100}
            onPageChange={() => {}}
          />
        </TabsContent>
      </Tabs>

      <CategoryForm
        open={categoryFormState.open}
        onOpenChange={(open) => {
          setCategoryFormState({ open, selectedCategory: open ? categoryFormState.selectedCategory : null })
        }}
        mode={categoryFormState.selectedCategory ? "edit" : "create"}
        initialData={categoryFormState.selectedCategory || undefined}
        parentCategories={contentCategories.filter((c) => !c.parentId)}
        onSubmit={handleCategorySubmit}
        isMutating={isMutating}
      />

      <ContentForm
        open={contentFormState.open}
        onOpenChange={(open) => {
          setContentFormState({
            open,
            selectedItem: open ? contentFormState.selectedItem : null,
            itemForEdit: open ? contentFormState.itemForEdit : null,
          })
        }}
        mode={contentFormState.selectedItem ? "edit" : "create"}
        initialData={contentFormState.itemForEdit || undefined}
        categoryOptions={contentCategoryOptions}
        onSubmit={handleContentSubmit}
        isMutating={isMutating}
      />

      <Dialog open={contentReorderState.open} onOpenChange={(open) => setContentReorderState({ ...contentReorderState, open })}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sắp xếp bài viết</DialogTitle>
            <DialogDescription>Kéo thả để thay đổi thứ tự hiển thị</DialogDescription>
          </DialogHeader>
          <SortableList
            items={contentReorderState.draft}
            getId={(item) => item.id}
            onReorder={(next) => setContentReorderState({ ...contentReorderState, draft: [...next] })}
          >
            {(item, index) => (
              <SortableCard
                id={item.id}
                index={index}
                title={item.title}
                subtitle={item.category}
              />
            )}
          </SortableList>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setContentReorderState({ open: false, draft: [] })}
              disabled={isMutating}
            >
              Hủy
            </Button>
            <Button onClick={saveContentReorder} disabled={isMutating}>
              {isMutating ? "Đang lưu..." : "Lưu thứ tự"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={categoriesReorderState.open} onOpenChange={(open) => setCategoriesReorderState({ ...categoriesReorderState, open })}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sắp xếp danh mục</DialogTitle>
            <DialogDescription>Kéo thả để thay đổi thứ tự</DialogDescription>
          </DialogHeader>
          <SortableList
            items={categoriesReorderState.draft}
            getId={(item) => item.id}
            onReorder={(next) => setCategoriesReorderState({ ...categoriesReorderState, draft: [...next] })}
          >
            {(item, index) => (
              <SortableCard
                id={item.id}
                index={index}
                title={item.name}
                subtitle={item.slug}
              />
            )}
          </SortableList>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoriesReorderState({ open: false, draft: [] })}
              disabled={isMutating}
            >
              Hủy
            </Button>
            <Button onClick={saveCategoriesReorder} disabled={isMutating}>
              {isMutating ? "Đang lưu..." : "Lưu thứ tự"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={contentDeleteState.dialogOpen}
        onOpenChange={(open) => setContentDeleteState({ ...contentDeleteState, dialogOpen: open })}
        title="Xác nhận xóa bài viết"
        description={`Bạn có chắc chắn muốn xóa bài viết "${contentDeleteState.selectedItem?.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa bài viết"
        variant="danger"
        icon="delete"
        onConfirm={confirmDelete}
      />

      <ConfirmDialog
        open={contentHideState.dialogOpen}
        onOpenChange={(open) => setContentHideState({ ...contentHideState, dialogOpen: open })}
        title={
          contentHideState.selectedItem?.status === "hidden"
            ? "Xác nhận hiện bài viết"
            : "Xác nhận ẩn bài viết"
        }
        description={
          contentHideState.selectedItem?.status === "hidden"
            ? `Bạn có chắc chắn muốn hiện lại bài viết "${contentHideState.selectedItem?.title}"?`
            : `Bạn có chắc chắn muốn ẩn bài viết "${contentHideState.selectedItem?.title}"? Bài viết sẽ không hiển thị trên ứng dụng.`
        }
        confirmText={contentHideState.selectedItem?.status === "hidden" ? "Hiện bài viết" : "Ẩn bài viết"}
        variant="warning"
        icon="hide"
        onConfirm={confirmToggleHidden}
      />

      <ConfirmDialog
        open={categoryDeleteState.dialogOpen}
        onOpenChange={(open) => setCategoryDeleteState({ ...categoryDeleteState, dialogOpen: open })}
        title="Xác nhận xóa danh mục"
        description={`Bạn có chắc chắn muốn xóa danh mục "${categoryDeleteState.selectedCategory?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa danh mục"
        variant="danger"
        icon="delete"
        onConfirm={handleCategoryDelete}
      />
    </AdminSection>
  )
}
