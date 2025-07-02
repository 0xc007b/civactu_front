export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  meta: {
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}

export interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: any
  }
}

export interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  params?: Record<string, any>
  signal?: AbortSignal
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchParams {
  search?: string
  filters?: Record<string, any>
}

export interface ApiQueryParams extends PaginationParams, SearchParams {
  [key: string]: any
}

export interface UploadResponse {
  success: boolean
  data: {
    url: string
    filename: string
    size: number
    mimeType: string
  }
}

export interface HealthCheckResponse {
  success: boolean
  data: {
    status: 'healthy' | 'unhealthy'
    timestamp: string
    uptime: number
    version: string
    database: 'connected' | 'disconnected'
  }
}

// Types d'erreurs API
export type ApiErrorCode = 
  | 'AUTH_001' // Token manquant
  | 'AUTH_002' // Token invalide
  | 'AUTH_003' // Token expiré
  | 'AUTH_004' // Identifiants incorrects
  | 'AUTH_005' // Compte non vérifié
  | 'AUTH_006' // Compte suspendu
  | 'AUTHZ_001' // Permissions insuffisantes
  | 'AUTHZ_002' // Ressource interdite
  | 'AUTHZ_003' // Action non autorisée
  | 'VALID_001' // Données manquantes
  | 'VALID_002' // Format invalide
  | 'VALID_003' // Valeur hors limites
  | 'VALID_004' // Email déjà utilisé
  | 'RESOURCE_001' // Ressource non trouvée
  | 'RESOURCE_002' // Ressource déjà existante
  | 'RESOURCE_003' // Conflit de ressource
  | 'SERVER_001' // Erreur interne
  | 'SERVER_002' // Base de données indisponible
  | 'SERVER_003' // Service externe indisponible

export interface ApiError extends Error {
  code?: ApiErrorCode
  status?: number
  response?: ErrorResponse
}
