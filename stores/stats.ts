import { defineStore } from 'pinia'
import type { Stats, ApiResponse } from '~/types'

interface StatsState {
  userStats: Stats | null
  globalStats: Stats | null
  locationStats: Record<string, Stats>
  loading: boolean
  error: string | null
  lastUpdated: string | null
}

export const useStatsStore = defineStore('stats', {
  state: (): StatsState => ({
    userStats: null,
    globalStats: null,
    locationStats: {},
    loading: false,
    error: null,
    lastUpdated: null
  }),

  getters: {
    hasUserStats: (state) => !!state.userStats,
    hasGlobalStats: (state) => !!state.globalStats,
    
    getLocationStats: (state) => (locationId: string): Stats | null => {
      return state.locationStats[locationId] || null
    },

    totalOpinions: (state) => {
      return state.globalStats?.public?.opinionsCount || 0
    },

    totalUsers: (state) => {
      return state.globalStats?.public?.usersCount || 0
    },

    totalComments: (state) => {
      return state.globalStats?.public?.commentsCount || 0
    },

    averageRating: (state) => {
      return state.globalStats?.public?.averageRating || 0
    },

    userRank: (state) => {
      return state.userStats?.users?.userRank || null
    },

    userContributions: (state) => {
      if (!state.userStats?.users) return 0
      return (state.userStats.users.opinionsCount || 0) + (state.userStats.users.commentsCount || 0)
    },

    isStatsStale: (state) => {
      if (!state.lastUpdated) return true
      const staleTime = 5 * 60 * 1000 // 5 minutes
      return Date.now() - new Date(state.lastUpdated).getTime() > staleTime
    }
  },

  actions: {
    async fetchUserStats(userId?: string, force = false) {
      if (this.loading && !force) return
      if (!force && this.userStats && !this.isStatsStale) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const endpoint = userId ? `/stats/user/${userId}` : '/stats/user'
        const response = await $api.get<ApiResponse<Stats>>(endpoint)
        
        this.userStats = response.data
        this.lastUpdated = new Date().toISOString()
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des statistiques utilisateur'
        console.error('Error fetching user stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchGlobalStats(force = false) {
      if (this.loading && !force) return
      if (!force && this.globalStats && !this.isStatsStale) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Stats>>('/stats/global')
        
        this.globalStats = response.data
        this.lastUpdated = new Date().toISOString()
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des statistiques globales'
        console.error('Error fetching global stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLocationStats(locationId: string, force = false) {
      if (this.loading && !force) return
      if (!force && this.locationStats[locationId] && !this.isStatsStale) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Stats>>(`/stats/location/${locationId}`)
        
        this.locationStats[locationId] = response.data
        this.lastUpdated = new Date().toISOString()
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des statistiques de localisation'
        console.error('Error fetching location stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchDashboardStats() {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<{
          user: Stats
          global: Stats
          locations: Record<string, Stats>
        }>>('/stats/dashboard')
        
        this.userStats = response.data.user
        this.globalStats = response.data.global
        this.locationStats = response.data.locations
        this.lastUpdated = new Date().toISOString()
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement du tableau de bord'
        console.error('Error fetching dashboard stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchStatsComparison(locationIds: string[], timeRange?: 'week' | 'month' | 'year') {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const params = new URLSearchParams()
        
        locationIds.forEach(id => params.append('locationIds', id))
        if (timeRange) params.set('timeRange', timeRange)

        const response = await $api.get<ApiResponse<Record<string, Stats>>>(`/stats/compare?${params}`)
        
        // Update location stats with fresh data
        Object.entries(response.data).forEach(([locationId, stats]) => {
          this.locationStats[locationId] = stats
        })
        
        this.lastUpdated = new Date().toISOString()
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la comparaison des statistiques'
        console.error('Error fetching stats comparison:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchTrendingStats(timeRange: 'day' | 'week' | 'month' = 'week') {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<{
          opinions: Array<{ date: string; count: number }>
          users: Array<{ date: string; count: number }>
          comments: Array<{ date: string; count: number }>
          ratings: Array<{ date: string; average: number }>
        }>>(`/stats/trending?timeRange=${timeRange}`)
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des tendances'
        console.error('Error fetching trending stats:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchLeaderboard(category: 'opinions' | 'comments' | 'likes' = 'opinions', limit = 10) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<Array<{
          userId: string
          username: string
          count: number
          rank: number
        }>>>(`/stats/leaderboard/${category}?limit=${limit}`)
        
        return response.data
      } catch (error: any) {
        console.error('Error fetching leaderboard:', error)
        return []
      }
    },

    incrementUserStat(statType: keyof Stats, increment = 1) {
      if (this.userStats && typeof this.userStats[statType] === 'number') {
        (this.userStats[statType] as number) += increment
      }
    },

    incrementGlobalStat(statType: keyof Stats, increment = 1) {
      if (this.globalStats && typeof this.globalStats[statType] === 'number') {
        (this.globalStats[statType] as number) += increment
      }
    },

    incrementLocationStat(locationId: string, statType: keyof Stats, increment = 1) {
      if (this.locationStats[locationId] && typeof this.locationStats[locationId][statType] === 'number') {
        (this.locationStats[locationId][statType] as number) += increment
      }
    },

    updateAverageRating(newRating: number, oldRating?: number) {
      if (this.globalStats?.public) {
        const currentAvg = this.globalStats.public.averageRating || 0
        const currentCount = this.globalStats.public.opinionsCount || 0
        
        let newAvg: number
        if (oldRating !== undefined) {
          // Update existing rating
          newAvg = ((currentAvg * currentCount) - oldRating + newRating) / currentCount
        } else {
          // New rating
          newAvg = ((currentAvg * currentCount) + newRating) / (currentCount + 1)
        }
        
        this.globalStats.public.averageRating = Math.round(newAvg * 100) / 100
      }
    },

    clearError() {
      this.error = null
    },

    invalidateStats() {
      this.lastUpdated = null
    },

    reset() {
      this.userStats = null
      this.globalStats = null
      this.locationStats = {}
      this.loading = false
      this.error = null
      this.lastUpdated = null
    }
  }
})

// Auto-import for Nuxt
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStatsStore, import.meta.hot))
}
