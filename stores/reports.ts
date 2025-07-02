import { defineStore } from 'pinia'
import type { Report, ReportCreateInput, ReportUpdateInput, PaginatedResponse, ApiResponse } from '~/types'

interface ReportsState {
  reports: Report[]
  currentReport: Report | null
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    status?: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED'
    type?: 'INAPPROPRIATE_CONTENT' | 'SPAM' | 'HARASSMENT' | 'MISINFORMATION' | 'OTHER'
    targetType?: 'OPINION' | 'COMMENT' | 'USER'
    targetId?: string
    reportedBy?: string
    search?: string
  }
  cache: Map<string, Report>
}

export const useReportsStore = defineStore('reports', {
  state: (): ReportsState => ({
    reports: [],
    currentReport: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    },
    filters: {},
    cache: new Map()
  }),

  getters: {
    getReportById: (state) => (id: string): Report | undefined => {
      return state.cache.get(id) || state.reports.find(r => r.id === id)
    },

    filteredReports: (state) => {
      let filtered = [...state.reports]

      if (state.filters.status) {
        filtered = filtered.filter(r => r.status === state.filters.status)
      }

      if (state.filters.type) {
        filtered = filtered.filter(r => r.type === state.filters.type)
      }

      if (state.filters.targetType) {
        filtered = filtered.filter(r => r.targetType === state.filters.targetType)
      }

      if (state.filters.targetId) {
        filtered = filtered.filter(r => r.targetId === state.filters.targetId)
      }

      if (state.filters.reportedBy) {
        filtered = filtered.filter(r => r.reportedBy === state.filters.reportedBy)
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(r => 
          r.reason?.toLowerCase().includes(search) ||
          r.description?.toLowerCase().includes(search)
        )
      }

      return filtered
    },

    reportsByStatus: (state) => {
      return state.reports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    },

    reportsByType: (state) => {
      return state.reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  },

  actions: {
    async fetchReports(page = 1, limit = 10, refresh = false) {
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

        const response = await $api<PaginatedResponse<Report>>(`/reports?${params}`)

        if (page === 1 || refresh) {
          this.reports = response.data
        } else {
          this.reports.push(...response.data)
        }

        // Update cache
        response.data.forEach(report => {
          this.cache.set(report.id, report)
        })

        this.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages
        }
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des signalements'
        console.error('Error fetching reports:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchReportById(id: string, force = false) {
      if (!force && this.cache.has(id)) {
        this.currentReport = this.cache.get(id)!
        return this.currentReport
      }

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Report>>(`/reports/${id}`)
        
        this.currentReport = response.data
        this.cache.set(id, response.data)
        
        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement du signalement'
        console.error('Error fetching report:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createReport(reportData: ReportCreateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Report>>('/reports', {
          method: 'POST',
          body: reportData
        })

        const newReport = response.data
        this.reports.unshift(newReport)
        this.cache.set(newReport.id, newReport)
        this.pagination.total++

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Signalement créé',
          message: 'Votre signalement a été envoyé avec succès'
        })

        return newReport
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la création du signalement'
        console.error('Error creating report:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateReport(id: string, updateData: ReportUpdateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Report>>(`/reports/${id}`, {
          method: 'PATCH',
          body: updateData
        })

        const updatedReport = response.data
        
        // Update in list
        const index = this.reports.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reports[index] = updatedReport
        }

        // Update cache
        this.cache.set(id, updatedReport)

        // Update current if it's the same
        if (this.currentReport?.id === id) {
          this.currentReport = updatedReport
        }

        return updatedReport
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la mise à jour du signalement'
        console.error('Error updating report:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteReport(id: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api(`/reports/${id}`, { method: 'DELETE' })

        // Remove from list
        this.reports = this.reports.filter(r => r.id !== id)
        
        // Remove from cache
        this.cache.delete(id)

        // Clear current if it's the same
        if (this.currentReport?.id === id) {
          this.currentReport = null
        }

        this.pagination.total--

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Signalement supprimé',
          message: 'Le signalement a été supprimé avec succès'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression du signalement'
        console.error('Error deleting report:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    setFilters(filters: Partial<ReportsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {}
    },

    setCurrentReport(report: Report | null) {
      this.currentReport = report
    },

    clearError() {
      this.error = null
    },

    clearCache() {
      this.cache.clear()
    },

    reset() {
      this.reports = []
      this.currentReport = null
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        limit: 10,
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
  import.meta.hot.accept(acceptHMRUpdate(useReportsStore, import.meta.hot))
}
