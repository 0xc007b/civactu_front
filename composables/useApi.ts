import type { ApiResponse, PaginatedResponse, ApiQueryParams } from '~/types/api'

// Composable simplifié qui utilise l'ApiClient global
export const useApi = () => {
  const { $api } = useNuxtApp()

  // Wrapper pour maintenir la compatibilité avec l'interface existante
  const get = async <T>(endpoint: string, params?: ApiQueryParams): Promise<ApiResponse<T>> => {
    return $api.get<ApiResponse<T>>(endpoint, params)
  }

  const post = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return $api.post<ApiResponse<T>>(endpoint, data)
  }

  const put = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return $api.put<ApiResponse<T>>(endpoint, data)
  }

  const patch = async <T>(endpoint: string, data?: any): Promise<ApiResponse<T>> => {
    return $api.patch<ApiResponse<T>>(endpoint, data)
  }

  const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
    return $api.delete<ApiResponse<T>>(endpoint)
  }

  const upload = async <T>(
    endpoint: string, 
    file: File | Blob, 
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> => {
    return $api.upload<ApiResponse<T>>(endpoint, file, onProgress)
  }

  return {
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    baseURL: $api?.apiBaseURL
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
