import { ApiClient } from '~/utils/api'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  
  // Créer l'instance de l'API client
  const apiClient = new ApiClient(config.public.apiBase || 'http://localhost:3001/api/v1')
  
  // Injecter dans l'app pour être disponible via useNuxtApp()
  return {
    provide: {
      api: apiClient
    }
  }
})
