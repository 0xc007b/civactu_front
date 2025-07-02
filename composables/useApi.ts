import type { ApiResponse, PaginatedResponse, ApiError, ApiQueryParams } from '~/types/api'

// Composable pour les appels API
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  // Fonction utilitaire pour créer les headers
  const createHeaders = (customHeaders: Record<string, string> = {}) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    }

    // Récupérer le token depuis le cookie
    const token = useCookie('auth-token')
    if (token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    return headers
  }

  // Fonction utilitaire pour construire l'URL avec les paramètres
  const buildURL = (endpoint: string, params?: Record<string, any>): string => {
    const url = new URL(endpoint, baseURL)
    
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

  // Fonction utilitaire pour gérer les erreurs
  const handleError = (error: any): ApiError => {
    if (error.data && error.data.error) {
      const apiError = new Error(error.data.error.message) as ApiError
      apiError.code = error.data.error.code
      apiError.status = error.status
      apiError.response = error.data
      return apiError
    }
    
    const genericError = new Error(error.message || 'Une erreur est survenue') as ApiError
    genericError.status = error.status
    return genericError
  }

  // Méthodes HTTP
  const get = async <T>(endpoint: string, params?: ApiQueryParams): Promise<ApiResponse<T>> => {
    try {
      const url = buildURL(endpoint, params)
      const headers = createHeaders()

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'GET',
        headers
      })

      return response
    } catch (error: any) {
      throw handleError(error)
    }
  }

  const post = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const url = buildURL(endpoint)
      const headers = createHeaders()

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'POST',
        headers,
        body: data
      })

      return response
    } catch (error: any) {
      throw handleError(error)
    }
  }

  const put = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const url = buildURL(endpoint)
      const headers = createHeaders()

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'PUT',
        headers,
        body: data
      })

      return response
    } catch (error: any) {
      throw handleError(error)
    }
  }

  const patch = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    try {
      const url = buildURL(endpoint)
      const headers = createHeaders()

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'PATCH',
        headers,
        body: data
      })

      return response
    } catch (error: any) {
      throw handleError(error)
    }
  }

  const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    try {
      const url = buildURL(endpoint)
      const headers = createHeaders()

      const response = await $fetch<ApiResponse<T>>(url, {
        method: 'DELETE',
        headers
      })

      return response
    } catch (error: any) {
      throw handleError(error)
    }
  }

  // Upload de fichiers
  const upload = async <T>(
    endpoint: string, 
    file: File | Blob, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> => {
    return new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const url = buildURL(endpoint)
        const headers = createHeaders()
        delete headers['Content-Type'] // Laisser le navigateur définir le content-type pour FormData

        // Utiliser XMLHttpRequest pour avoir le callback de progression
        const xhr = new XMLHttpRequest()

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100
            onProgress(progress)
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
            try {
              const errorResponse = JSON.parse(xhr.responseText)
              reject(handleError({ data: errorResponse, status: xhr.status }))
            } catch {
              reject(handleError({ message: `Erreur HTTP: ${xhr.status}`, status: xhr.status }))
            }
          }
        }

        xhr.onerror = () => reject(handleError({ message: 'Erreur de réseau' }))
        xhr.ontimeout = () => reject(handleError({ message: 'Timeout de la requête' }))

        xhr.open('POST', url)
        
        Object.entries(headers).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value)
        })

        xhr.send(formData)
      } catch (error) {
        reject(handleError(error))
      }
    })
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    baseURL
  }
}

// Composable pour la pagination
export const usePagination = <T>(
  fetchFunction: (params: ApiQueryParams) => Promise<PaginatedResponse<T>>,
  initialParams: ApiQueryParams = {}
) => {
  const items = ref<T[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const params = ref({ ...initialParams })

  const load = async (resetItems = true) => {
    try {
      isLoading.value = true
      error.value = null

      const response = await fetchFunction({
        ...params.value,
        page: pagination.value.page,
        limit: pagination.value.limit
      })

      if (resetItems) {
        items.value = response.data as T[]
      } else {
        items.value = [...(items.value as T[]), ...(response.data as T[])]
      }

      pagination.value = response.meta.pagination
    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement'
    } finally {
      isLoading.value = false
    }
  }

  const loadMore = async () => {
    if (pagination.value.page < pagination.value.totalPages && !isLoading.value) {
      pagination.value.page++
      await load(false)
    }
  }

  const refresh = async () => {
    pagination.value.page = 1
    await load(true)
  }

  const setPage = async (page: number) => {
    pagination.value.page = page
    await load(true)
  }

  const setLimit = async (limit: number) => {
    pagination.value.limit = limit
    pagination.value.page = 1
    await load(true)
  }

  const setParams = async (newParams: ApiQueryParams) => {
    params.value = { ...params.value, ...newParams }
    pagination.value.page = 1
    await load(true)
  }

  const hasMore = computed(() => 
    pagination.value.page < pagination.value.totalPages
  )

  // Charger les données initiales
  onMounted(() => {
    load()
  })

  return {
    items: readonly(items),
    isLoading: readonly(isLoading),
    error: readonly(error),
    pagination: readonly(pagination),
    params: readonly(params),
    hasMore,
    load,
    loadMore,
    refresh,
    setPage,
    setLimit,
    setParams
  }
}
