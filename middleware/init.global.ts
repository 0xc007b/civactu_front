export default defineNuxtRouteMiddleware(async (to, from) => {
  // Ce middleware s'exécute avant tous les autres
  // Il initialise l'authentification si un token existe
  
  if (process.client) {
    const authStore = useAuthStore()
    
    try {
      await authStore.initializeAuth()
    } catch (error) {
      // En cas d'erreur, on nettoie l'authentification
      console.warn('Erreur lors de l\'initialisation de l\'authentification:', error)
      authStore.clearAuth()
    }
  }
})
