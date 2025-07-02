import type { ApiQueryParams } from '~/types/api'

export const useStats = () => {
  const { get } = useApi()

  // Recherche globale
  const globalSearch = async (params: ApiQueryParams) => {
    try {
      const response = await get('/api/v1/search', params)
      return response
    } catch (error) {
      throw error
    }
  }

  // Obtenir les statistiques du dashboard personnalisé
  const getDashboardStats = async () => {
    try {
      const response = await get('/api/v1/stats/dashboard')
      return response
    } catch (error) {
      throw error
    }
  }

  // Obtenir les statistiques publiques
  const getPublicStats = async () => {
    try {
      const response = await get('/api/v1/stats/public')
      return response
    } catch (error) {
      throw error
    }
  }

  // Vérification de l'état de santé de l'API
  const healthCheck = async () => {
    try {
      const response = await get('/api/v1/health')
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    globalSearch,
    getDashboardStats,
    getPublicStats,
    healthCheck
  }
}
