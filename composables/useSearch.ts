interface SearchOptions {
  limit?: number
  offset?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}

interface SearchResult<T> {
  items: T[]
  total: number
  hasMore: boolean
  query: string
  filters: Record<string, any>
}

interface SearchHistory {
  query: string
  timestamp: string
  resultsCount: number
}

export const useSearch = <T = any>() => {
  const query = ref('')
  const results = ref<T[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const hasMore = ref(false)
  const currentPage = ref(1)
  const filters = ref<Record<string, any>>({})
  const sortBy = ref<string>('')
  const sortOrder = ref<'asc' | 'desc'>('desc')
  
  // Search history
  const searchHistory = ref<SearchHistory[]>([])
  const maxHistoryItems = 10

  const { $api } = useNuxtApp()

  const search = async (
    searchQuery: string,
    endpoint: string,
    options: SearchOptions = {}
  ): Promise<SearchResult<T>> => {
    try {
      loading.value = true
      error.value = null
      query.value = searchQuery

      const params = new URLSearchParams()
      params.set('q', searchQuery)
      
      if (options.limit) params.set('limit', options.limit.toString())
      if (options.offset) params.set('offset', options.offset.toString())
      if (options.sortBy) params.set('sortBy', options.sortBy)
      if (options.sortOrder) params.set('sortOrder', options.sortOrder)

      // Add filters
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.set(key, value.toString())
          }
        })
      }

      const response = await $api.get<{
        data: T[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>(`${endpoint}`, Object.fromEntries(params))

      const searchResult: SearchResult<T> = {
        items: response.data,
        total: response.total,
        hasMore: (response.page * response.limit) < response.total,
        query: searchQuery,
        filters: options.filters || {}
      }

      results.value = searchResult.items
      total.value = searchResult.total
      hasMore.value = searchResult.hasMore
      currentPage.value = response.page

      // Add to search history
      addToHistory(searchQuery, searchResult.total)

      return searchResult
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la recherche'
      console.error('Search error:', err)
      
      return {
        items: [],
        total: 0,
        hasMore: false,
        query: searchQuery,
        filters: options.filters || {}
      }
    } finally {
      loading.value = false
    }
  }

  const searchMore = async (endpoint: string, options: SearchOptions = {}) => {
    if (!hasMore.value || loading.value) return

    try {
      loading.value = true
      const nextPage = currentPage.value + 1

      const params = new URLSearchParams()
      params.set('q', query.value)
      params.set('page', nextPage.toString())
      
      if (options.limit) params.set('limit', options.limit.toString())
      if (sortBy.value) params.set('sortBy', sortBy.value)
      if (sortOrder.value) params.set('sortOrder', sortOrder.value)

      // Add filters
      Object.entries(filters.value).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, value.toString())
        }
      })

      const response = await $api.get<{
        data: T[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>(`${endpoint}`, Object.fromEntries(params))

      results.value = [...results.value, ...response.data]
      currentPage.value = response.page
      hasMore.value = (response.page * response.limit) < response.total

    } catch (err: any) {
      error.value = err.message || 'Erreur lors du chargement des résultats suivants'
      console.error('Search more error:', err)
    } finally {
      loading.value = false
    }
  }

  const clearResults = () => {
    results.value = []
    total.value = 0
    hasMore.value = false
    currentPage.value = 1
    error.value = null
  }

  const clearQuery = () => {
    query.value = ''
    clearResults()
  }

  const setFilter = (key: string, value: any) => {
    filters.value[key] = value
  }

  const removeFilter = (key: string) => {
    delete filters.value[key]
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const setSorting = (by: string, order: 'asc' | 'desc' = 'desc') => {
    sortBy.value = by
    sortOrder.value = order
  }

  const clearSorting = () => {
    sortBy.value = ''
    sortOrder.value = 'desc'
  }

  // Search history management
  const addToHistory = (searchQuery: string, resultsCount: number) => {
    if (!searchQuery.trim()) return

    // Remove existing entry if it exists
    searchHistory.value = searchHistory.value.filter(h => h.query !== searchQuery)

    // Add new entry at the beginning
    searchHistory.value.unshift({
      query: searchQuery,
      timestamp: new Date().toISOString(),
      resultsCount
    })

    // Keep only the last maxHistoryItems
    if (searchHistory.value.length > maxHistoryItems) {
      searchHistory.value = searchHistory.value.slice(0, maxHistoryItems)
    }

    // Save to localStorage
    saveHistoryToStorage()
  }

  const removeFromHistory = (searchQuery: string) => {
    searchHistory.value = searchHistory.value.filter(h => h.query !== searchQuery)
    saveHistoryToStorage()
  }

  const clearHistory = () => {
    searchHistory.value = []
    saveHistoryToStorage()
  }

  const loadHistoryFromStorage = () => {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('search-history')
        if (stored) {
          searchHistory.value = JSON.parse(stored)
        }
      } catch (err) {
        console.error('Error loading search history:', err)
        searchHistory.value = []
      }
    }
  }

  const saveHistoryToStorage = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem('search-history', JSON.stringify(searchHistory.value))
      } catch (err) {
        console.error('Error saving search history:', err)
      }
    }
  }

  // Auto-complete suggestions
  const getSuggestions = async (
    partialQuery: string,
    endpoint: string,
    limit = 5
  ): Promise<string[]> => {
    if (!partialQuery.trim() || partialQuery.length < 2) return []

    try {
      const response = await $api.get<{ data: string[] }>(
        `${endpoint}/suggestions`, { q: partialQuery, limit: limit.toString() }
      )
      return response.data
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      return []
    }
  }

  // Advanced search with multiple fields
  const advancedSearch = async (
    searchParams: Record<string, any>,
    endpoint: string,
    options: SearchOptions = {}
  ) => {
    try {
      loading.value = true
      error.value = null

      const params = new URLSearchParams()
      
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.set(key, value.toString())
        }
      })

      if (options.limit) params.set('limit', options.limit.toString())
      if (options.offset) params.set('offset', options.offset.toString())
      if (options.sortBy) params.set('sortBy', options.sortBy)
      if (options.sortOrder) params.set('sortOrder', options.sortOrder)

      const response = await $api.get<{
        data: T[]
        total: number
        page: number
        limit: number
        totalPages: number
      }>(`${endpoint}`, Object.fromEntries(params))

      results.value = response.data
      total.value = response.total
      hasMore.value = (response.page * response.limit) < response.total
      currentPage.value = response.page

      return {
        items: response.data,
        total: response.total,
        hasMore: hasMore.value,
        query: JSON.stringify(searchParams),
        filters: searchParams
      }
    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la recherche avancée'
      console.error('Advanced search error:', err)
      
      return {
        items: [],
        total: 0,
        hasMore: false,
        query: JSON.stringify(searchParams),
        filters: searchParams
      }
    } finally {
      loading.value = false
    }
  }

  // Initialize search history on mount
  onMounted(() => {
    loadHistoryFromStorage()
  })

  return {
    // State
    query: readonly(query),
    results: readonly(results),
    total: readonly(total),
    loading: readonly(loading),
    error: readonly(error),
    hasMore: readonly(hasMore),
    currentPage: readonly(currentPage),
    filters: readonly(filters),
    sortBy: readonly(sortBy),
    sortOrder: readonly(sortOrder),
    searchHistory: readonly(searchHistory),

    // Methods
    search,
    searchMore,
    advancedSearch,
    getSuggestions,
    clearResults,
    clearQuery,
    setFilter,
    removeFilter,
    clearFilters,
    setSorting,
    clearSorting,
    addToHistory,
    removeFromHistory,
    clearHistory
  }
}
