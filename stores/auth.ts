import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData, AuthResponse, UpdateProfileData } from '~/types'
import type { ApiError } from '~/types/api'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isEmailVerified: boolean
  loginAttempts: number
  lastLoginAttempt: number | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isEmailVerified: false,
    loginAttempts: 0,
    lastLoginAttempt: null
  }),

  getters: {
    userRole: (state): string => state.user?.role || 'CITIZEN',
    isAdmin: (state): boolean => state.user?.role === 'ADMIN',
    isOfficial: (state): boolean => state.user?.role === 'OFFICIAL',
    isCitizen: (state): boolean => state.user?.role === 'CITIZEN',
    userFullName: (state): string => 
      state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    userInitials: (state): string => {
      if (!state.user) return '??'
      const firstInitial = state.user.firstName?.[0]?.toUpperCase() || ''
      const lastInitial = state.user.lastName?.[0]?.toUpperCase() || ''
      return firstInitial + lastInitial || state.user.email[0]?.toUpperCase() || '?'
    },
    hasProfile: (state): boolean => !!state.user?.profile,
    municipality: (state) => state.user?.profile?.municipality,
    region: (state) => state.user?.profile?.region,
    isAccountActive: (state): boolean => state.user?.status === 'ACTIVE',
    canTryLogin: (state): boolean => {
      if (state.loginAttempts < 3) return true
      if (!state.lastLoginAttempt) return true
      const timeSinceLastAttempt = Date.now() - state.lastLoginAttempt
      return timeSinceLastAttempt > 15 * 60 * 1000 // 15 minutes
    }
  },

  actions: {
    async login(credentials: LoginCredentials) {
      if (!this.canTryLogin) {
        throw new Error('Trop de tentatives de connexion. Veuillez attendre 15 minutes.')
      }

      try {
        this.isLoading = true
        const { $api } = useNuxtApp()
        
        const response = await $api.post<AuthResponse>('/api/v1/auth/login', credentials)
        
        if (response.success) {
          this.setAuth(response.data.user, response.data.access_token)
          this.loginAttempts = 0
          this.lastLoginAttempt = null
          
          // Redirection après connexion réussie
          await navigateTo('/dashboard')
          
          return { success: true }
        }
      } catch (error: any) {
        console.error('Erreur de connexion:', error)
        this.loginAttempts++
        this.lastLoginAttempt = Date.now()
        
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur de connexion'
        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: RegisterData) {
      try {
        this.isLoading = true
        const { $api } = useNuxtApp()
        
        const response = await $api.post<AuthResponse>('/api/v1/auth/register', userData)
        
        if (response.success) {
          return { 
            success: true, 
            message: 'Inscription réussie. Vérifiez votre email pour activer votre compte.' 
          }
        }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur lors de l\'inscription'
        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      try {
        // Note: L'API ne semble pas avoir d'endpoint de logout, donc on nettoie juste localement
        console.log('Déconnexion locale')
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error)
      } finally {
        this.clearAuth()
        await navigateTo('/auth/login')
      }
    },

    async forgotPassword(email: string) {
      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/auth/forgot-password', { email })
        return { success: true, message: 'Un email de réinitialisation a été envoyé.' }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur lors de l\'envoi'
        throw new Error(message)
      }
    },

    async resetPassword(token: string, password: string) {
      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/auth/reset-password', { token, password })
        return { success: true, message: 'Mot de passe réinitialisé avec succès.' }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur de réinitialisation'
        throw new Error(message)
      }
    },

    async verifyEmail(token: string) {
      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/auth/verify-email', { token })
        
        if (this.user) {
          this.user.isVerified = true
          this.isEmailVerified = true
        }
        
        return { success: true, message: 'Email vérifié avec succès.' }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur de vérification'
        throw new Error(message)
      }
    },

    async resendVerificationEmail() {
      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/auth/resend-verification')
        return { success: true, message: 'Email de vérification renvoyé.' }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur lors de l\'envoi'
        throw new Error(message)
      }
    },

    async updateProfile(profileData: UpdateProfileData) {
      try {
        this.isLoading = true
        const { $api } = useNuxtApp()
        
        const response = await $api.put<{ user: User }>('/api/v1/users/profile', profileData)
        
        this.user = response.user
        return { success: true, message: 'Profil mis à jour avec succès.' }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur lors de la mise à jour'
        throw new Error(message)
      } finally {
        this.isLoading = false
      }
    },

    async changePassword(currentPassword: string, newPassword: string) {
      try {
        const { $api } = useNuxtApp()
        await $api.post('/api/v1/users/change-password', { currentPassword, newPassword })
        return { success: true, message: 'Mot de passe modifié avec succès.' }
      } catch (error: any) {
        const apiError = error as ApiError
        const message = apiError.response?.error.message || 'Erreur lors du changement de mot de passe'
        throw new Error(message)
      }
    },

    async refreshToken() {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.post<AuthResponse>('/api/v1/auth/refresh')
        
        if (response.success) {
          this.setAuth(response.data.user, response.data.access_token)
          return true
        }
      } catch (error) {
        console.error('Erreur lors du refresh token:', error)
        this.clearAuth()
        return false
      }
    },

    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      this.isEmailVerified = user.isVerified
      
      // Stocker le token dans un cookie
      const tokenCookie = useCookie<string | null>('auth-token', {
        default: (): string | null => null,
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 jours
      })
      tokenCookie.value = token

      // Configurer l'API client avec le token
      const { $api } = useNuxtApp()
      $api.setAuthToken(token)
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.isEmailVerified = false
      
      // Supprimer le cookie
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null

      // Supprimer le token de l'API client
      const { $api } = useNuxtApp()
      $api.setAuthToken(null)
    },

    async initializeAuth() {
      const tokenCookie = useCookie('auth-token')
      const token = tokenCookie.value
      
      if (token) {
        try {
          const { $api } = useNuxtApp()
          $api.setAuthToken(token)
          
          // Utiliser l'endpoint correct pour récupérer l'utilisateur actuel
          const response = await $api.get<{ success: boolean, data: User }>('/api/v1/users/me')
          
          if (response.success && response.data) {
            this.setAuth(response.data, token)
          }
           else {
            this.clearAuth()
          }
        } catch (error) {
          console.error('Erreur lors de l\'initialisation de l\'auth:', error)
          this.clearAuth()
        }
      }
    },

    // Utilitaires pour les permissions
    hasRole(role: string): boolean {
      return this.user?.role === role
    },

    hasAnyRole(roles: string[]): boolean {
      return this.user ? roles.includes(this.user.role) : false
    },

    updateUserStatus(status: string) {
      if (this.user) {
        this.user.status = status as any // Temporary casting, will be properly typed later
      }
    },

    canAccess(permission: string): boolean {
      // Cette méthode sera étendue avec la logique de permissions
      if (!this.user || !this.isAccountActive) return false
      
      // Logique de base des permissions
      switch (permission) {
        case 'admin':
          return this.isAdmin
        case 'moderate':
          return this.isAdmin || this.isOfficial
        default:
          return true
      }
    }
  }
})
