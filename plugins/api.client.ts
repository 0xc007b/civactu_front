import { ApiClient } from '~/utils/api'

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig()
  
  // Créer l'instance de l'API client
  const apiClient = new ApiClient(config.public.apiBase || 'http://localhost:3001')
  
  // Initialiser le token depuis les cookies si disponible
  if (process.client) {
    const tokenCookie = useCookie('auth-token')
    if (tokenCookie.value) {
      apiClient.setAuthToken(tokenCookie.value)
    }
  }
  
  // Injecter dans l'app pour être disponible via useNuxtApp()
  return {
    provide: {
      api: apiClient
    }
  }
})
