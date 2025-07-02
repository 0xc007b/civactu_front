import type { User, LoginCredentials, RegisterData } from '~/types'

// Composable pour l'authentification
export const useAuth = () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const token = useCookie('auth-token')

  const { post, get } = useApi()

  // Getters computed
  const userRole = computed(() => user.value?.role || 'CITIZEN')
  const isAdmin = computed(() => user.value?.role === 'ADMIN')
  const isOfficial = computed(() => user.value?.role === 'OFFICIAL')
  const isCitizen = computed(() => user.value?.role === 'CITIZEN')
  const userFullName = computed(() => 
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )
  const userInitials = computed(() => {
    if (!user.value) return '??'
    const firstInitial = user.value.firstName?.[0]?.toUpperCase() || ''
    const lastInitial = user.value.lastName?.[0]?.toUpperCase() || ''
    return firstInitial + lastInitial || user.value.email[0]?.toUpperCase() || '?'
  })
  const isEmailVerified = computed(() => user.value?.isVerified || false)
  const municipality = computed(() => user.value?.profile?.municipality)
  const region = computed(() => user.value?.profile?.region)

  // Actions
  const login = async (credentials: LoginCredentials) => {
    try {
      isLoading.value = true
      
      const response = await post('/api/v1/auth/login', credentials)
      
      if (response.success) {
        const { user: userData, access_token } = response.data as any
        
        // Stocker les données
        user.value = userData
        token.value = access_token
        isAuthenticated.value = true
        
        // Redirection
        await navigateTo('/dashboard')
        
        return { success: true }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de connexion')
    } finally {
      isLoading.value = false
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      isLoading.value = true
      
      const response = await post('/api/v1/auth/register', userData)
      
      if (response.success) {
        return { 
          success: true, 
          message: 'Inscription réussie. Vérifiez votre email pour activer votre compte.' 
        }
      }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'inscription')
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      // Note: L'API ne semble pas avoir d'endpoint de logout, donc on nettoie juste localement
      console.log('Déconnexion locale')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      // Nettoyer les données locales
      user.value = null
      token.value = null
      isAuthenticated.value = false
      
      // Redirection
      await navigateTo('/auth/login')
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await post('/api/v1/auth/forgot-password', { email })
      return { success: true, message: 'Un email de réinitialisation a été envoyé.' }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors de l\'envoi')
    }
  }

  const resetPassword = async (token: string, password: string) => {
    try {
      await post('/api/v1/auth/reset-password', { token, password })
      return { success: true, message: 'Mot de passe réinitialisé avec succès.' }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de réinitialisation')
    }
  }

  const verifyEmail = async (verificationToken: string) => {
    try {
      await post('/api/v1/auth/verify-email', { token: verificationToken })
      
      if (user.value) {
        user.value.isVerified = true
      }
      
      return { success: true, message: 'Email vérifié avec succès.' }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur de vérification')
    }
  }

  const resendVerification = async () => {
    try {
      await post('/api/v1/auth/resend-verification')
      return { success: true, message: 'Email de vérification renvoyé.' }
    } catch (error: any) {
      throw new Error(error.message || 'Erreur lors du renvoi')
    }
  }

  const refreshToken = async () => {
    try {
      const response = await post('/api/v1/auth/refresh')
      
      if (response.success) {
        const { user: userData, access_token } = response.data as any
        user.value = userData
        token.value = access_token
        isAuthenticated.value = true
        return true
      }
    } catch (error) {
      console.error('Erreur lors du refresh token:', error)
      user.value = null
      token.value = null
      isAuthenticated.value = false
      return false
    }
  }

  const initializeAuth = async () => {
    if (token.value) {
      try {
        const response = await get('/api/v1/users/me')
        
        if (response.success) {
          user.value = response.data as User
          isAuthenticated.value = true
        } else {
          // Token invalide, nettoyer
          token.value = null
          isAuthenticated.value = false
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'auth:', error)
        token.value = null
        isAuthenticated.value = false
      }
    }
  }

  // Utilitaires de permissions
  const hasRole = (role: string): boolean => {
    return user.value?.role === role
  }

  const hasAnyRole = (roles: string[]): boolean => {
    return user.value ? roles.includes(user.value.role) : false
  }

  const canAccess = (permission: string): boolean => {
    if (!user.value || user.value.status !== 'ACTIVE') return false
    
    // Logique de base des permissions
    switch (permission) {
      case 'admin':
        return isAdmin.value
      case 'moderate':
        return isAdmin.value || isOfficial.value
      default:
        return true
    }
  }

  // Initialiser au montage
  onMounted(() => {
    initializeAuth()
  })

  return {
    // State
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    
    // Getters
    userRole,
    isAdmin,
    isOfficial,
    isCitizen,
    userFullName,
    userInitials,
    isEmailVerified,
    municipality,
    region,
    
    // Actions
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshToken,
    initializeAuth,
    
    // Utilities
    hasRole,
    hasAnyRole,
    canAccess
  }
}
