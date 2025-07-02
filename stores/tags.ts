import { defineStore } from 'pinia'
import type { Tag, TagCreateInput, TagUpdateInput, PaginatedResponse, ApiResponse } from '~/types'

interface TagsState {
  tags: Tag[]
  popularTags: Tag[]
  currentTag: Tag | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    search?: string
    category?: string
    minUsageCount?: number
  }
  cache: Map<string, Tag>
}

export const useTagsStore = defineStore('tags', {
  state: (): TagsState => ({
    tags: [],
    popularTags: [],
    currentTag: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 50,
      total: 0,
      totalPages: 0
    },
    filters: {},
    cache: new Map()
  }),

  getters: {
    getTagById: (state) => (id: string): Tag | undefined => {
      return state.cache.get(id) || state.tags.find(t => t.id === id)
    },

    getTagByName: (state) => (name: string): Tag | undefined => {
      return state.tags.find(t => t.name.toLowerCase() === name.toLowerCase())
    },

    filteredTags: (state) => {
      let filtered = [...state.tags]

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(t => 
          t.name.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
        )
      }

      if (state.filters.category) {
        filtered = filtered.filter(t => t.category === state.filters.category)
      }

      if (state.filters.minUsageCount) {
        filtered = filtered.filter(t => t.usageCount >= state.filters.minUsageCount!)
      }

      return filtered.sort((a, b) => b.usageCount - a.usageCount)
    },

    tagsByCategory: (state) => {
      return state.tags.reduce((acc, tag) => {
        const category = tag.category || 'other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(tag)
        return acc
      }, {} as Record<string, Tag[]>)
    },

    searchSuggestions: (state) => (query: string) => {
      if (!query || query.length < 2) return []
      
      const lowerQuery = query.toLowerCase()
      return state.tags
        .filter(tag => tag.name.toLowerCase().includes(lowerQuery))
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 10)
    }
  },

  actions: {
    async fetchTags(page = 1, limit = 50, refresh = false) {
      if (this.loading && !refresh) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        
        const response = await $api.get<PaginatedResponse<Tag>>('/tags', {
          page,
          limit,
          ...Object.fromEntries(
            Object.entries(this.filters).filter(([_, value]) => value !== undefined && value !== '')
          )
        })

        if (page === 1 || refresh) {
          this.tags = response.data
        } else {
          this.tags.push(...response.data)
        }

        // Update cache
        response.data.forEach((tag: Tag) => {
          this.cache.set(tag.id, tag)
        })

        this.pagination = response.meta.pagination
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des tags'
        console.error('Error fetching tags:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchPopularTags(limit = 20) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Tag[]>>(`/tags/popular?limit=${limit}`)
        
        this.popularTags = response.data
        
        // Update cache
        response.data.forEach(tag => {
          this.cache.set(tag.id, tag)
        })
      } catch (error: any) {
        console.error('Error fetching popular tags:', error)
      }
    },

    async fetchTagById(id: string, force = false) {
      if (!force && this.cache.has(id)) {
        this.currentTag = this.cache.get(id)!
        return this.currentTag
      }

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Tag>>(`/tags/${id}`)
        
        this.currentTag = response.data
        this.cache.set(id, response.data)
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement du tag'
        console.error('Error fetching tag:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchTags(query: string) {
      if (!query || query.length < 2) return []

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Tag[]>>(`/tags/search?q=${encodeURIComponent(query)}`)
        
        // Update cache
        response.data.forEach(tag => {
          this.cache.set(tag.id, tag)
        })
        
        return response.data
      } catch (error: any) {
        console.error('Error searching tags:', error)
        return []
      }
    },

    async createTag(tagData: TagCreateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Tag>>('/tags', {
          method: 'POST',
          body: tagData
        })

        const newTag = response.data
        this.tags.unshift(newTag)
        this.cache.set(newTag.id, newTag)
        this.pagination.total++

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Tag créé',
          message: `Le tag "${newTag.name}" a été créé avec succès`
        })

        return newTag
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création du tag'
        console.error('Error creating tag:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateTag(id: string, updateData: TagUpdateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Tag>>(`/tags/${id}`, {
          method: 'PATCH',
          body: updateData
        })

        const updatedTag = response.data
        
        // Update in list
        const index = this.tags.findIndex(t => t.id === id)
        if (index !== -1) {
          this.tags[index] = updatedTag
        }

        // Update in popular tags
        const popularIndex = this.popularTags.findIndex(t => t.id === id)
        if (popularIndex !== -1) {
          this.popularTags[popularIndex] = updatedTag
        }

        // Update cache
        this.cache.set(id, updatedTag)

        // Update current if it's the same
        if (this.currentTag?.id === id) {
          this.currentTag = updatedTag
        }

        return updatedTag
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour du tag'
        console.error('Error updating tag:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteTag(id: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api.delete('/tags/${id}')

        // Remove from list
        this.tags = this.tags.filter(t => t.id !== id)
        
        // Remove from popular tags
        this.popularTags = this.popularTags.filter(t => t.id !== id)
        
        // Remove from cache
        this.cache.delete(id)

        // Clear current if it's the same
        if (this.currentTag?.id === id) {
          this.currentTag = null
        }

        this.pagination.total--

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Tag supprimé',
          message: 'Le tag a été supprimé avec succès'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression du tag'
        console.error('Error deleting tag:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async suggestTags(content: string) {
      if (!content || content.length < 10) return []

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Tag[]>>('/tags/suggest', {
          method: 'POST',
          body: { content }
        })
        
        return response.data
      } catch (error: any) {
        console.error('Error getting tag suggestions:', error)
        return []
      }
    },

    setFilters(filters: Partial<TagsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {}
    },

    setCurrentTag(tag: Tag | null) {
      this.currentTag = tag
    },

    clearError() {
      this.error = null
    },

    clearCache() {
      this.cache.clear()
    },

    reset() {
      this.tags = []
      this.popularTags = []
      this.currentTag = null
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 0
      }
      this.filters = {}
      this.cache.clear()
    }
  }
})

// Auto-import for Nuxt
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTagsStore, import.meta.hot))
}
