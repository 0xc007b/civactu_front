import { defineStore } from 'pinia'
import type { Location, LocationCreateInput, LocationUpdateInput, PaginatedResponse, ApiResponse } from '~/types'

interface LocationsState {
  locations: Location[]
  currentLocation: Location | null
  nearbyLocations: Location[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    type?: 'CITY' | 'DISTRICT' | 'NEIGHBORHOOD' | 'LANDMARK' | 'CUSTOM'
    search?: string
    radius?: number
    centerLat?: number
    centerLng?: number
    hasOpinions?: boolean
  }
  cache: Map<string, Location>
  userLocation: GeolocationPosition | null
}

export const useLocationsStore = defineStore('locations', {
  state: (): LocationsState => ({
    locations: [],
    currentLocation: null,
    nearbyLocations: [],
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },
    filters: {},
    cache: new Map(),
    userLocation: null
  }),

  getters: {
    getLocationById: (state) => (id: string): Location | undefined => {
      return state.cache.get(id) || state.locations.find(l => l.id === id)
    },

    getLocationByName: (state) => (name: string): Location | undefined => {
      return state.locations.find(l => l.name.toLowerCase() === name.toLowerCase())
    },

    filteredLocations: (state) => {
      let filtered = [...state.locations]

      if (state.filters.type) {
        filtered = filtered.filter(l => l.type === state.filters.type)
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(l => 
          l.name.toLowerCase().includes(search) ||
          l.address?.toLowerCase().includes(search) ||
          l.description?.toLowerCase().includes(search)
        )
      }

      if (state.filters.hasOpinions) {
        filtered = filtered.filter(l => l.opinionsCount && l.opinionsCount > 0)
      }

      // Sort by distance if user location is available
      if (state.userLocation && state.filters.centerLat && state.filters.centerLng) {
        filtered.sort((a, b) => {
          const distanceA = calculateDistance(
            state.filters.centerLat!,
            state.filters.centerLng!,
            a.latitude,
            a.longitude
          )
          const distanceB = calculateDistance(
            state.filters.centerLat!,
            state.filters.centerLng!,
            b.latitude,
            b.longitude
          )
          return distanceA - distanceB
        })
      }

      return filtered
    },

    locationsByType: (state) => {
      return state.locations.reduce((acc, location) => {
        acc[location.type] = (acc[location.type] || [])
        acc[location.type].push(location)
        return acc
      }, {} as Record<string, Location[]>)
    },

    popularLocations: (state) => {
      return [...state.locations]
        .filter(l => l.opinionsCount && l.opinionsCount > 0)
        .sort((a, b) => (b.opinionsCount || 0) - (a.opinionsCount || 0))
        .slice(0, 10)
    },

    searchSuggestions: (state) => (query: string) => {
      if (!query || query.length < 2) return []
      
      const lowerQuery = query.toLowerCase()
      return state.locations
        .filter(location => 
          location.name.toLowerCase().includes(lowerQuery) ||
          location.address?.toLowerCase().includes(lowerQuery)
        )
        .sort((a, b) => (b.opinionsCount || 0) - (a.opinionsCount || 0))
        .slice(0, 10)
    }
  },

  actions: {
    async fetchLocations(page = 1, limit = 20, refresh = false) {
      if (this.loading && !refresh) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...Object.fromEntries(
            Object.entries(this.filters).filter(([_, value]) => value !== undefined && value !== '')
          )
        })

        const response = await $api<PaginatedResponse<Location>>(`/locations?${params}`)

        if (page === 1 || refresh) {
          this.locations = response.data
        } else {
          this.locations.push(...response.data)
        }

        // Update cache
        response.data.forEach(location => {
          this.cache.set(location.id, location)
        })

        this.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des lieux'
        console.error('Error fetching locations:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLocationById(id: string, force = false) {
      if (!force && this.cache.has(id)) {
        this.currentLocation = this.cache.get(id)!
        return this.currentLocation
      }

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Location>>(`/locations/${id}`)
        
        this.currentLocation = response.data
        this.cache.set(id, response.data)
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement du lieu'
        console.error('Error fetching location:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async searchLocations(query: string, limit = 20) {
      if (!query || query.length < 2) return []

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Location[]>>(`/locations/search?q=${encodeURIComponent(query)}&limit=${limit}`)
        
        // Update cache
        response.data.forEach(location => {
          this.cache.set(location.id, location)
        })
        
        return response.data
      } catch (error: any) {
        console.error('Error searching locations:', error)
        return []
      }
    },

    async fetchNearbyLocations(latitude: number, longitude: number, radius = 5000, limit = 20) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const params = new URLSearchParams({
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          radius: radius.toString(),
          limit: limit.toString()
        })

        const response = await $api<ApiResponse<Location[]>>(`/locations/nearby?${params}`)
        
        this.nearbyLocations = response.data
        
        // Update cache
        response.data.forEach(location => {
          this.cache.set(location.id, location)
        })
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des lieux à proximité'
        console.error('Error fetching nearby locations:', error)
      } finally {
        this.loading = false
      }
    },

    async createLocation(locationData: LocationCreateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Location>>('/locations', {
          method: 'POST',
          body: locationData
        })

        const newLocation = response.data
        this.locations.unshift(newLocation)
        this.cache.set(newLocation.id, newLocation)
        this.pagination.total++

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Lieu créé',
          message: `Le lieu "${newLocation.name}" a été créé avec succès`
        })

        return newLocation
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création du lieu'
        console.error('Error creating location:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateLocation(id: string, updateData: LocationUpdateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Location>>(`/locations/${id}`, {
          method: 'PATCH',
          body: updateData
        })

        const updatedLocation = response.data
        
        // Update in list
        const index = this.locations.findIndex(l => l.id === id)
        if (index !== -1) {
          this.locations[index] = updatedLocation
        }

        // Update in nearby locations
        const nearbyIndex = this.nearbyLocations.findIndex(l => l.id === id)
        if (nearbyIndex !== -1) {
          this.nearbyLocations[nearbyIndex] = updatedLocation
        }

        // Update cache
        this.cache.set(id, updatedLocation)

        // Update current if it's the same
        if (this.currentLocation?.id === id) {
          this.currentLocation = updatedLocation
        }

        return updatedLocation
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour du lieu'
        console.error('Error updating location:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteLocation(id: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api(`/locations/${id}`, { method: 'DELETE' })

        // Remove from list
        this.locations = this.locations.filter(l => l.id !== id)
        
        // Remove from nearby locations
        this.nearbyLocations = this.nearbyLocations.filter(l => l.id !== id)
        
        // Remove from cache
        this.cache.delete(id)

        // Clear current if it's the same
        if (this.currentLocation?.id === id) {
          this.currentLocation = null
        }

        this.pagination.total--

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Lieu supprimé',
          message: 'Le lieu a été supprimé avec succès'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression du lieu'
        console.error('Error deleting location:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async setUserLocation() {
      try {
        if (!navigator.geolocation) {
          throw new Error('Géolocalisation non supportée')
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes
          })
        })

        this.userLocation = position
        
        // Update filters with user location
        this.filters.centerLat = position.coords.latitude
        this.filters.centerLng = position.coords.longitude

        return position
      } catch (error: any) {
        console.error('Error getting user location:', error)
        throw error
      }
    },

    setFilters(filters: Partial<LocationsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {}
    },

    setCurrentLocation(location: Location | null) {
      this.currentLocation = location
    },

    clearError() {
      this.error = null
    },

    clearCache() {
      this.cache.clear()
    },

    reset() {
      this.locations = []
      this.currentLocation = null
      this.nearbyLocations = []
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
      this.filters = {}
      this.cache.clear()
      this.userLocation = null
    }
  }
})

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c * 1000 // Return distance in meters
}

// Auto-import for Nuxt
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLocationsStore, import.meta.hot))
}
