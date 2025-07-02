import type { Tag } from '~/types/tag'

export const useTags = () => {
  const tagsStore = useTagsStore()

  // Créer un tag (admin seulement)
  const createTag = async (tagData: any) => {
    try {
      return await tagsStore.createTag(tagData)
    } catch (error) {
      throw error
    }
  }

  // Obtenir tous les tags
  const getAllTags = async () => {
    try {
      await tagsStore.fetchTags()
      return { success: true, data: tagsStore.tags }
    } catch (error) {
      throw error
    }
  }

  // Obtenir un tag par son ID
  const getTagById = async (id: string) => {
    try {
      return await tagsStore.fetchTagById(id)
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour un tag (admin seulement)
  const updateTag = async (id: string, tagData: any) => {
    try {
      return await tagsStore.updateTag(id, tagData)
    } catch (error) {
      throw error
    }
  }

  // Supprimer un tag (admin seulement)
  const deleteTag = async (id: string) => {
    try {
      await tagsStore.deleteTag(id)
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  // Rechercher des tags
  const searchTags = async (query: string) => {
    try {
      return await tagsStore.searchTags(query)
    } catch (error) {
      throw error
    }
  }

  // Obtenir les tags populaires
  const getPopularTags = async (limit = 20) => {
    try {
      await tagsStore.fetchPopularTags(limit)
      return { success: true, data: tagsStore.popularTags }
    } catch (error) {
      throw error
    }
  }

  // Exposer les données réactives du store
  const {
    tags,
    popularTags,
    currentTag,
    loading,
    error,
    pagination,
    filters,
    getTagById: getCachedTagById,
    getTagByName,
    filteredTags,
    tagsByCategory,
    searchSuggestions
  } = storeToRefs(tagsStore)

  // Exposer les actions du store
  const {
    setFilters,
    clearFilters,
    setCurrentTag,
    clearError,
    clearCache,
    reset
  } = tagsStore

  return {
    // Actions API
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag,
    searchTags,
    getPopularTags,
    
    // État réactif
    tags,
    popularTags,
    currentTag,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    getCachedTagById,
    getTagByName,
    filteredTags,
    tagsByCategory,
    searchSuggestions,
    
    // Actions du store
    setFilters,
    clearFilters,
    setCurrentTag,
    clearError,
    clearCache,
    reset
  }
}
