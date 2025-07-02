import type { Report } from '~/types/report'
import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useReports = () => {
  const reportsStore = useReportsStore()

  // Créer un nouveau rapport
  const createReport = async (reportData: any) => {
    try {
      return await reportsStore.createReport(reportData)
    } catch (error) {
      throw error
    }
  }

  // Obtenir tous les rapports avec filtres
  const getAllReports = async (params?: ApiQueryParams): Promise<PaginatedResponse<Report>> => {
    try {
      await reportsStore.fetchReports(params?.page || 1, params?.limit || 10)
      
      // Retourner la structure PaginatedResponse attendue
      return {
        success: true,
        data: reportsStore.reports,
        meta: {
          pagination: reportsStore.pagination
        }
      } as PaginatedResponse<Report>
    } catch (error) {
      throw error
    }
  }

  // Obtenir un rapport par son ID
  const getReportById = async (id: string) => {
    try {
      return await reportsStore.fetchReportById(id)
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour un rapport
  const updateReport = async (id: string, reportData: any) => {
    try {
      return await reportsStore.updateReport(id, reportData)
    } catch (error) {
      throw error
    }
  }

  // Supprimer un rapport
  const deleteReport = async (id: string) => {
    try {
      await reportsStore.deleteReport(id)
      return { success: true }
    } catch (error) {
      throw error
    }
  }

  // Assigner un rapport à un utilisateur
  const assignReport = async (id: string, assignData: any) => {
    try {
      return await reportsStore.assignReport(id, assignData)
    } catch (error) {
      throw error
    }
  }

  // Ajouter une mise à jour de statut au rapport
  const addStatusUpdate = async (id: string, updateData: any) => {
    try {
      return await reportsStore.addStatusUpdate(id, updateData)
    } catch (error) {
      throw error
    }
  }

  // Exposer les données réactives du store
  const {
    reports,
    currentReport,
    loading,
    error,
    pagination,
    filters,
    getReportById: getCachedReportById,
    filteredReports,
    reportsByStatus,
    reportsByType
  } = storeToRefs(reportsStore)

  // Exposer les actions du store
  const {
    setFilters,
    clearFilters,
    setCurrentReport,
    clearError,
    clearCache,
    reset
  } = reportsStore

  return {
    // Actions API
    createReport,
    getAllReports,
    getReportById,
    updateReport,
    deleteReport,
    assignReport,
    addStatusUpdate,
    
    // État réactif
    reports,
    currentReport,
    loading,
    error,
    pagination,
    filters,
    
    // Getters
    getCachedReportById,
    filteredReports,
    reportsByStatus,
    reportsByType,
    
    // Actions du store
    setFilters,
    clearFilters,
    setCurrentReport,
    clearError,
    clearCache,
    reset
  }
}
