import type { User } from '~/types/user'
import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useUsers = () => {
  const authStore = useAuthStore()

  // Créer un nouvel utilisateur (inscription publique)
  const createUser = async (userData: any) => {
    try {
      return await authStore.register(userData)
    } catch (error) {
      throw error
    }
  }

  // Obtenir tous les utilisateurs (admin seulement) - Cette fonctionnalité pourrait nécessiter un store dédié
  const getAllUsers = async (params?: ApiQueryParams): Promise<PaginatedResponse<User>> => {
    try {
      const { $api } = useNuxtApp()
      const response = await $api.get('/api/v1/users', params)
      return response as PaginatedResponse<User>
    } catch (error) {
      throw error
    }
  }

  // Obtenir le profil de l'utilisateur actuel
  const getCurrentUser = async () => {
    try {
      await authStore.initializeAuth()
      return { success: true, data: authStore.user }
    } catch (error) {
      throw error
    }
  }

  // Obtenir le profil de l'utilisateur actuel (endpoint alternatif)
  const getUserProfile = async () => {
    try {
      return await getCurrentUser()
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour le profil de l'utilisateur actuel
  const updateProfile = async (profileData: any) => {
    try {
      return await authStore.updateProfile(profileData)
    } catch (error) {
      throw error
    }
  }

  // Obtenir un utilisateur par son ID
  const getUserById = async (id: string) => {
    try {
      const { $api } = useNuxtApp()
      const response = await $api.get(`/api/v1/users/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour un utilisateur (admin/modération)
  const updateUser = async (id: string, userData: any) => {
    try {
      const { $api } = useNuxtApp()
      const response = await $api.patch(`/api/v1/users/${id}`, userData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Supprimer un utilisateur (admin seulement)
  const deleteUser = async (id: string) => {
    try {
      const { $api } = useNuxtApp()
      const response = await $api.delete(`/api/v1/users/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Exposer les données réactives du store d'authentification
  const {
    user,
    isAuthenticated,
    isLoading,
    userRole,
    isAdmin,
    isOfficial,
    isCitizen,
    userFullName,
    userInitials,
    isEmailVerified,
    municipality,
    region
  } = storeToRefs(authStore)

  // Exposer les actions du store d'authentification
  const {
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    refreshToken,
    hasRole,
    hasAnyRole,
    canAccess
  } = authStore

  return {
    // Actions API
    createUser,
    getAllUsers,
    getCurrentUser,
    getUserProfile,
    updateProfile,
    getUserById,
    updateUser,
    deleteUser,
    
    // État réactif de l'utilisateur connecté
    user,
    isAuthenticated,
    isLoading,
    userRole,
    isAdmin,
    isOfficial,
    isCitizen,
    userFullName,
    userInitials,
    isEmailVerified,
    municipality,
    region,
    
    // Actions d'authentification
    login,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    refreshToken,
    hasRole,
    hasAnyRole,
    canAccess
  }
}
