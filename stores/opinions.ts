import { defineStore } from 'pinia'
import type { Opinion, CreateOpinionData, UpdateOpinionData, OpinionFilters } from '~/types/opinion'
import type { PaginatedResponse, ApiError } from '~/types/api'

interface OpinionsState {
  opinions: Opinion[]
  currentOpinion: Opinion | null
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: OpinionFilters
  cache: Record<string, Opinion>
}

export const useOpinionsStore = defineStore('opinions', {
  state: (): OpinionsState => ({
    opinions: [],
    currentOpinion: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {},
    cache: {}
  }),

  getters: {
    getOpinionById: (state) => (id: string): Opinion | null => {
      return state.cache[id] || state.opinions.find(opinion => opinion.id === id) || null
    },

    filteredOpinions: (state) => {
      let filtered = [...state.opinions]

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(opinion => 
          opinion.title.toLowerCase().includes(search) ||
          opinion.content.toLowerCase().includes(search)
        )
      }

      if (state.filters.type) {
        filtered = filtered.filter(opinion => opinion.type === state.filters.type)
      }

      if (state.filters.municipalityId) {
        filtered = filtered.filter(opinion => opinion.municipalityId === state.filters.municipalityId)
      }

      return filtered
    },

    hasMorePages: (state) => {
      return state.pagination.page < state.pagination.totalPages
    }
  },

  actions: {
    async fetchOpinions(params: OpinionFilters = {}) {
      try {
        this.isLoading = true
        const { $api } = useNuxtApp()

        const response = await $api.get<PaginatedResponse<Opinion>>('/opinions', {
          page: this.pagination.page,
          limit: this.pagination.limit,
          ...params
        })

        if (response.success) {
          this.opinions = response.data
          this.pagination = response.meta.pagination
          
          // Mettre en cache les avis
          response.data.forEach(opinion => {
            this.cache[opinion.id] = opinion
          })
        }
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors du chargement des avis')
      } finally {
        this.isLoading = false
      }
    },

    async fetchOpinionById(id: string, force = false) {
      // Vérifier d'abord le cache
      if (!force && this.cache[id]) {
        this.currentOpinion = this.cache[id]
        return this.currentOpinion
      }

      try {
        this.isLoading = true
        const { $api } = useNuxtApp()

        const response = await $api.get<{ opinion: Opinion }>(`/opinions/${id}`)

        this.currentOpinion = response.opinion
        this.cache[id] = response.opinion
        return this.currentOpinion
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors du chargement de l\'avis')
      } finally {
        this.isLoading = false
      }
    },

    async createOpinion(opinionData: CreateOpinionData) {
      try {
        this.isCreating = true
        const { $api } = useNuxtApp()

        const response = await $api.post<{ opinion: Opinion }>('/opinions', opinionData)

        const newOpinion = response.opinion
        this.opinions.unshift(newOpinion)
        this.cache[newOpinion.id] = newOpinion
        return newOpinion
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors de la création de l\'avis')
      } finally {
        this.isCreating = false
      }
    },

    async updateOpinion(id: string, opinionData: UpdateOpinionData) {
      try {
        this.isUpdating = true
        const { $api } = useNuxtApp()

        const response = await $api.put<{ opinion: Opinion }>(`/opinions/${id}`, opinionData)

        if (response.success) {
          const updatedOpinion = response.data.opinion
          
          // Mettre à jour dans la liste
          const index = this.opinions.findIndex(opinion => opinion.id === id)
          if (index !== -1) {
            this.opinions[index] = updatedOpinion
          }
          
          // Mettre à jour le cache et l'avis courant
          this.cache[id] = updatedOpinion
          if (this.currentOpinion?.id === id) {
            this.currentOpinion = updatedOpinion
          }
          
          return updatedOpinion
        }
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors de la mise à jour de l\'avis')
      } finally {
        this.isUpdating = false
      }
    },

    async deleteOpinion(id: string) {
      try {
        const { $api } = useNuxtApp()

        await $api.delete(`/opinions/${id}`)

        // Supprimer de la liste, du cache et réinitialiser si c'est l'avis courant
        this.opinions = this.opinions.filter(opinion => opinion.id !== id)
        delete this.cache[id]
        if (this.currentOpinion?.id === id) {
          this.currentOpinion = null
        }
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors de la suppression de l\'avis')
      }
    },

    async likeOpinion(id: string) {
      try {
        const { $api } = useNuxtApp()

        const response = await $api.post<{ liked: boolean; likesCount: number }>(`/opinions/${id}/like`)

        if (response.success) {
          const { liked, likesCount } = response.data
          
          // Mettre à jour dans la liste
          const opinion = this.opinions.find(op => op.id === id)
          if (opinion) {
            opinion.isLiked = liked
            opinion.likesCount = likesCount
          }
          
          // Mettre à jour le cache
          if (this.cache[id]) {
            this.cache[id].isLiked = liked
            this.cache[id].likesCount = likesCount
          }
          
          // Mettre à jour l'avis courant
          if (this.currentOpinion?.id === id) {
            this.currentOpinion.isLiked = liked
            this.currentOpinion.likesCount = likesCount
          }
          
          return { liked, likesCount }
        }
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors du like')
      }
    },

    async loadMore() {
      if (!this.hasMorePages || this.isLoading) return

      const nextPage = this.pagination.page + 1
      try {
        this.isLoading = true
        const { $api } = useNuxtApp()

        const response = await $api.get<PaginatedResponse<Opinion>>('/opinions', {
          page: nextPage,
          limit: this.pagination.limit,
          ...this.filters
        })

        if (response.success) {
          this.opinions.push(...response.data)
          this.pagination = response.meta.pagination
          
          // Mettre en cache les nouveaux avis
          response.data.forEach(opinion => {
            this.cache[opinion.id] = opinion
          })
        }
      } catch (error: any) {
        const apiError = error as ApiError
        throw new Error(apiError.response?.error.message || 'Erreur lors du chargement')
      } finally {
        this.isLoading = false
      }
    },

    setFilters(filters: OpinionFilters) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1 // Reset to first page
    },

    clearFilters() {
      this.filters = {}
      this.pagination.page = 1
    },

    setPage(page: number) {
      this.pagination.page = page
    },

    setLimit(limit: number) {
      this.pagination.limit = limit
      this.pagination.page = 1
    },

    clearCache() {
      this.cache = {}
    },

    reset() {
      this.$reset()
    },

    // Methods for real-time updates
    updateOpinionFromRealtime(opinion: Opinion) {
      const index = this.opinions.findIndex(op => op.id === opinion.id)
      if (index !== -1) {
        this.opinions[index] = opinion
      }
      this.cache[opinion.id] = opinion
      if (this.currentOpinion?.id === opinion.id) {
        this.currentOpinion = opinion
      }
    },

    updateOpinionLikes(opinionId: string, likesCount: number) {
      const opinion = this.opinions.find(op => op.id === opinionId)
      if (opinion) {
        opinion.likesCount = likesCount
      }
      if (this.cache[opinionId]) {
        this.cache[opinionId].likesCount = likesCount
      }
      if (this.currentOpinion?.id === opinionId) {
        this.currentOpinion.likesCount = likesCount
      }
    },

    addCommentFromRealtime(comment: any) {
      // Find the opinion and add the comment
      const opinion = this.opinions.find(op => op.id === comment.opinionId)
      if (opinion && opinion.comments) {
        opinion.comments.push(comment)
      }
      
      if (this.cache[comment.opinionId]?.comments) {
        this.cache[comment.opinionId].comments.push(comment)
      }
      
      if (this.currentOpinion?.id === comment.opinionId && this.currentOpinion.comments) {
        this.currentOpinion.comments.push(comment)
      }
    }
  }
})
