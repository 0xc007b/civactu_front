export interface Tag {
  id: string
  name: string
  color: string
  description?: string
  category?: string
  usageCount: number
  createdAt: string
  updatedAt: string
}

export interface TagCreateInput {
  name: string
  color?: string
  description?: string
  category?: string
}

export interface TagUpdateInput {
  name?: string
  color?: string
  description?: string
  category?: string
}

export interface TagFilters {
  search?: string
  sortBy?: 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}

export interface TagStats {
  totalTags: number
  mostUsedTags: Array<{
    tag: Tag
    usageCount: number
  }>
}
