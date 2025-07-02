import { defineStore } from 'pinia'
import type { ApiQueryParams } from '~/types/api'

interface Region {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface Municipality {
  id: string
  name: string
  regionId: string
  region?: Region
  createdAt: string
  updatedAt: string
}

interface RegionsState {
  regions: Region[]
  municipalities: Municipality[]
  currentRegion: Region | null
  currentMunicipality: Municipality | null
  loading: boolean
  error: string | null
}

export const useRegionsStore = defineStore('regions', {
  state: (): RegionsState => ({
    regions: [],
    municipalities: [],
    currentRegion: null,
    currentMunicipality: null,
    loading: false,
    error: null
  }),

  getters: {
    getRegionById: (state) => (id: string): Region | undefined => {
      return state.regions.find(r => r.id === id)
    },

    getMunicipalityById: (state) => (id: string): Municipality | undefined => {
      return state.municipalities.find(m => m.id === id)
    },

    getMunicipalitiesByRegion: (state) => (regionId: string): Municipality[] => {
      return state.municipalities.filter(m => m.regionId === regionId)
    }
  },

  actions: {
    // === RÉGIONS ===

    async fetchRegions() {
      try {
        this.loading = true
        this.error = null
        const { $api } = useNuxtApp()

        const response = await $api.get<{ data: Region[] }>('/api/v1/locations/regions')
        this.regions = response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des régions'
        console.error('Error fetching regions:', error)
      } finally {
        this.loading = false
      }
    },

    async createRegion(regionData: any) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        const response = await $api.post<{ data: Region }>('/api/v1/locations/regions', regionData)
        const newRegion = response.data
        this.regions.push(newRegion)
        return newRegion
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la région'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateRegion(id: string, regionData: any) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        const response = await $api.put<{ data: Region }>(`/api/v1/locations/regions/${id}`, regionData)
        const updatedRegion = response.data
        
        const index = this.regions.findIndex(r => r.id === id)
        if (index !== -1) {
          this.regions[index] = updatedRegion
        }

        if (this.currentRegion?.id === id) {
          this.currentRegion = updatedRegion
        }

        return updatedRegion
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour de la région'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteRegion(id: string) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        await $api.delete(`/api/v1/locations/regions/${id}`)
        
        this.regions = this.regions.filter(r => r.id !== id)
        if (this.currentRegion?.id === id) {
          this.currentRegion = null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression de la région'
        throw error
      } finally {
        this.loading = false
      }
    },

    // === MUNICIPALITÉS ===

    async fetchMunicipalities(params?: ApiQueryParams) {
      try {
        this.loading = true
        this.error = null
        const { $api } = useNuxtApp()

        const response = await $api.get<{ data: Municipality[] }>('/api/v1/locations/municipalities', params)
        this.municipalities = response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des municipalités'
        console.error('Error fetching municipalities:', error)
      } finally {
        this.loading = false
      }
    },

    async createMunicipality(municipalityData: any) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        const response = await $api.post<{ data: Municipality }>('/api/v1/locations/municipalities', municipalityData)
        const newMunicipality = response.data
        this.municipalities.push(newMunicipality)
        return newMunicipality
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création de la municipalité'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMunicipalityById(id: string) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        const response = await $api.get<{ data: Municipality }>(`/api/v1/locations/municipalities/${id}`)
        this.currentMunicipality = response.data
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement de la municipalité'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateMunicipality(id: string, municipalityData: any) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        const response = await $api.put<{ data: Municipality }>(`/api/v1/locations/municipalities/${id}`, municipalityData)
        const updatedMunicipality = response.data
        
        const index = this.municipalities.findIndex(m => m.id === id)
        if (index !== -1) {
          this.municipalities[index] = updatedMunicipality
        }

        if (this.currentMunicipality?.id === id) {
          this.currentMunicipality = updatedMunicipality
        }

        return updatedMunicipality
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour de la municipalité'
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteMunicipality(id: string) {
      try {
        this.loading = true
        const { $api } = useNuxtApp()

        await $api.delete(`/api/v1/locations/municipalities/${id}`)
        
        this.municipalities = this.municipalities.filter(m => m.id !== id)
        if (this.currentMunicipality?.id === id) {
          this.currentMunicipality = null
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression de la municipalité'
        throw error
      } finally {
        this.loading = false
      }
    },

    setCurrentRegion(region: Region | null) {
      this.currentRegion = region
    },

    setCurrentMunicipality(municipality: Municipality | null) {
      this.currentMunicipality = municipality
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.regions = []
      this.municipalities = []
      this.currentRegion = null
      this.currentMunicipality = null
      this.loading = false
      this.error = null
    }
  }
})
