import type { Opinion } from '~/types/opinion'
import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useOpinions = () => {
  const opinionsStore = useOpinionsStore()

  // Créer une nouvelle opinion
  const createOpinion = async (opinionData: any) => {
    try {
      return await opinionsStore.createOpinion(opinionData)
    } catch (error) {
      throw error
    }
  }

  // Obtenir toutes les opinions avec filtres
  const getAllOpinions = async (params?: ApiQueryParams): Promise<PaginatedResponse<Opinion>> => {
    try {
      // Mapper les paramètres API vers les filtres d'opinions
      const opinionFilters = params ? {
        search: params.search,
        page: params.page,
        limit: params.limit,
        // Mapper les autres paramètres selon les besoins
        ...params.filters
      } : undefined
      
      await opinionsStore.fetchOpinions(opinionFilters)
      
      // Retourner la structure PaginatedResponse attendue
      return {
        success: true,
        data: opinionsStore.opinions,
        meta: {
          pagination: opinionsStore.pagination
        }
      } as PaginatedResponse<Opinion>
    } catch (error) {
      throw error
    }
  }

  // Obtenir une opinion par son ID
  const getOpinionById = async (id: string) => {
    try {
      return await opinionsStore.fetchOpinionById(id)
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour une opinion
  const updateOpinion = async (id: string, opinionData: any) => {
    try {
      return await opinionsStore.updateOpinion(id, opinionData)
    } catch (error) {
      throw error
    }
  }

  // Supprimer une opinion
  const deleteOpinion = async (id: string) => {
    try {
      await opinionsStore.deleteOpinion(id)
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  // Liker/unliker une opinion
  const toggleLikeOpinion = async (id: string) => {
    try {
      return await opinionsStore.likeOpinion(id)
    } catch (error) {
      throw error
    }
  }

  // Exposer les données réactives du store
  const {
    opinions,
    currentOpinion,
    isLoading,
    isCreating,
    isUpdating,
    pagination,
    filters,
    getOpinionById: getCachedOpinionById,
    filteredOpinions,
    hasMorePages
  } = storeToRefs(opinionsStore)

  // Exposer les actions du store
  const {
    loadMore,
    setFilters,
    clearFilters,
    setPage,
    setLimit,
    clearCache,
    reset,
    updateOpinionFromRealtime,
    updateOpinionLikes,
    addCommentFromRealtime
  } = opinionsStore

  return {
    // Actions API
    createOpinion,
    getAllOpinions,
    getOpinionById,
    updateOpinion,
    deleteOpinion,
    toggleLikeOpinion,
    
    // État réactif
    opinions,
    currentOpinion,
    isLoading,
    isCreating,
    isUpdating,
    pagination,
    filters,
    
    // Getters
    getCachedOpinionById,
    filteredOpinions,
    hasMorePages,
    
    // Actions du store
    loadMore,
    setFilters,
    clearFilters,
    setPage,
    setLimit,
    clearCache,
    reset,
    updateOpinionFromRealtime,
    updateOpinionLikes,
    addCommentFromRealtime
  }
}
