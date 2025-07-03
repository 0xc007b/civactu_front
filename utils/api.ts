import type { ApiOptions, ApiResponse, PaginatedResponse, ErrorResponse, ApiError, ApiQueryParams } from '~/types/api'

export class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  // Getter public pour accéder au baseURL
  get apiBaseURL(): string {
    return this.baseURL
  }

  // Méthode pour récupérer automatiquement le token depuis les cookies
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      // Côté client, utiliser document.cookie
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
      if (authCookie) {
        return authCookie.split('=')[1]
      }
    }
    return null
  }

  // Méthode pour créer les headers avec le token automatique
  private createHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers = {
      ...this.defaultHeaders,
      ...customHeaders
    }

    // Récupérer automatiquement le token
    const token = this.getAuthToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.defaultHeaders.Authorization = `Bearer ${token}`
    } else {
      delete this.defaultHeaders.Authorization
    }
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL)
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)))
          } else {
            url.searchParams.set(key, String(value))
          }
        }
      })
    }
    
    return url.toString()
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type')
    
    if (!response.ok) {
      let errorData: ErrorResponse
      
      if (contentType?.includes('application/json')) {
        errorData = await response.json()
      } else {
        errorData = {
          success: false,
          error: {
            code: 'SERVER_001',
            message: response.statusText || 'Une erreur est survenue'
          }
        }
      }
      
      const error = new Error(errorData.error.message) as ApiError
      error.code = errorData.error.code as any
      error.status = response.status
      error.response = errorData
      
      throw error
    }

    if (contentType?.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as unknown as T
  }

  async request<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, params, signal } = options
    
    const url = this.buildURL(endpoint, params)
    
    // Utiliser la méthode createHeaders pour inclure automatiquement le token
    const requestHeaders = this.createHeaders(headers)

    const requestBody = body ? JSON.stringify(body) : undefined

    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: requestBody,
        signal
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        const networkError = new Error('Erreur de connexion réseau') as ApiError
        networkError.code = 'SERVER_003'
        throw networkError
      }
      throw error
    }
  }

  async get<T>(endpoint: string, params?: ApiQueryParams, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', params, signal })
  }

  async post<T>(endpoint: string, data?: any, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data, signal })
  }

  async put<T>(endpoint: string, data?: any, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data, signal })
  }

  async patch<T>(endpoint: string, data?: any, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: data, signal })
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', signal })
  }

  async upload<T>(endpoint: string, file: File | Blob, progressCallback?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    // Utiliser createHeaders mais sans Content-Type pour FormData
    const headers = this.createHeaders()
    delete headers['Content-Type'] // Let browser set it for FormData

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && progressCallback) {
          const progress = (event.loaded / event.total) * 100
          progressCallback(progress)
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } catch (error) {
            reject(new Error('Erreur de parsing de la réponse'))
          }
        } else {
          reject(new Error(`Erreur HTTP: ${xhr.status}`))
        }
      }

      xhr.onerror = () => reject(new Error('Erreur de réseau'))
      xhr.ontimeout = () => reject(new Error('Timeout de la requête'))

      xhr.open('POST', this.buildURL(endpoint))
      
      Object.entries(headers).forEach(([key, value]) => {
        if (key !== 'Content-Type') {
          xhr.setRequestHeader(key, value)
        }
      })

      xhr.send(formData)
    })
  }
}

// Instance globale
let apiInstance: ApiClient | null = null

export function createApiClient(baseURL: string): ApiClient {
  apiInstance = new ApiClient(baseURL)
  return apiInstance
}

export function getApiClient(): ApiClient {
  if (!apiInstance) {
    throw new Error('API client not initialized. Call createApiClient first.')
  }
  return apiInstance
}

// Utilitaires pour les réponses API
export function isApiResponse<T>(response: any): response is ApiResponse<T> {
  return response && typeof response.success === 'boolean'
}

export function isPaginatedResponse<T>(response: any): response is PaginatedResponse<T> {
  return response && typeof response.success === 'boolean' && response.data && Array.isArray(response.data) && response.meta?.pagination
}

export function isErrorResponse(response: any): response is ErrorResponse {
  return response && response.success === false && response.error
}

// Helper pour extraire les données des réponses API
export function extractData<T>(response: ApiResponse<T> | PaginatedResponse<T>): T | T[] {
  return response.data
}

export function extractPagination(response: PaginatedResponse<any>) {
  return response.meta.pagination
}
