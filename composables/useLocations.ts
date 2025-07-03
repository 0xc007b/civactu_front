import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useLocations = () => {
  const { get, post, put, delete: del } = useApi()

  // === RÉGIONS ===

  // Obtenir toutes les régions
  const getAllRegions = async () => {
    try {
      const response = await get('/api/v1/locations/regions')
      return response
    } catch (error) {
      throw error
    }
  }

  // Créer une nouvelle région (admin seulement)
  const createRegion = async (regionData: any) => {
    try {
      const response = await post('/api/v1/locations/regions', regionData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour une région (admin seulement)
  const updateRegion = async (id: string, regionData: any) => {
    try {
      const response = await put(`/api/v1/locations/regions/${id}`, regionData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Supprimer une région (admin seulement)
  const deleteRegion = async (id: string) => {
    try {
      const response = await del(`/locations/regions/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // === MUNICIPALITÉS ===

  // Obtenir les municipalités avec filtres
  const getMunicipalities = async (params?: ApiQueryParams) => {
    try {
      const response = await get('/api/v1/locations/municipalities', params)
      return response
    } catch (error) {
      throw error
    }
  }

  // Créer une nouvelle municipalité (admin seulement)
  const createMunicipality = async (municipalityData: any) => {
    try {
      const response = await post('/api/v1/locations/municipalities', municipalityData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Obtenir une municipalité par son ID
  const getMunicipalityById = async (id: string) => {
    try {
      const response = await get(`/locations/municipalities/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour une municipalité (admin seulement)
  const updateMunicipality = async (id: string, municipalityData: any) => {
    try {
      const response = await put(`/api/v1/locations/municipalities/${id}`, municipalityData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Supprimer une municipalité (admin seulement)
  const deleteMunicipality = async (id: string) => {
    try {
      const response = await del(`/locations/municipalities/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    // Régions
    getAllRegions,
    createRegion,
    updateRegion,
    deleteRegion,
    
    // Municipalités
    getMunicipalities,
    createMunicipality,
    getMunicipalityById,
    updateMunicipality,
    deleteMunicipality
  }
}
