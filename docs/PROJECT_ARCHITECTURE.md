# PROJECT_ARCHITECTURE.md - Frontend Utilisateurs CivActu (Nuxt + PWA)

## 📋 Vue d'ensemble

Cette architecture décrit la structure complète du frontend utilisateur pour l'application CivActu, basée sur l'analyse de l'API backend existante. L'application utilise **Nuxt 3**, **Nuxt UI** et est configurée comme **PWA** pour offrir une expérience mobile native optimale.

## 🎯 Fonctionnalités principales basées sur l'API

D'après l'analyse du backend, l'application frontend doit supporter :

### 🔐 Authentification
- Inscription/Connexion avec vérification email
- Gestion des rôles : CITIZEN, OFFICIAL, ADMIN
- Réinitialisation de mot de passe
- Refresh tokens automatique

### 👤 Gestion Utilisateur
- Profil utilisateur complet avec géolocalisation
- Gestion des municipalités et régions
- Système de statuts (ACTIVE, INACTIVE, SUSPENDED)

### 💭 Avis/Opinions
- Création d'avis (SUPPORT, OPPOSE, NEUTRAL, SUGGESTION)
- Système de likes et vues
- Commentaires sur les avis
- Tags et catégorisation

### 🚨 Signalements
- Signalements par catégorie (INFRASTRUCTURE, ENVIRONMENT, etc.)
- Upload d'images et documents
- Géolocalisation avec cartes
- Suivi de statut (PENDING, IN_PROGRESS, RESOLVED, REJECTED)
- Assignation aux élus
- Système de priorité

### 💬 Messagerie
- Messages directs entre utilisateurs
- Réponses et fils de discussion
- Notifications de lecture

### 🔔 Notifications
- Système de notifications en temps réel
- Notifications push PWA
- Historique des notifications

### 📊 Statistiques
- Dashboard personnalisé
- Statistiques publiques
- Activité récente

## 🏗️ Structure du Projet

```
civactu-frontend/
├── .nuxt/                          # Dossier généré automatiquement
├── .output/                        # Build output
├── assets/                         # Assets statiques
│   ├── css/
│   │   ├── main.css
│   │   ├── components.css
│   │   └── themes/
│   │       ├── light.css
│   │       └── dark.css
│   ├── images/
│   │   ├── logo/
│   │   ├── icons/
│   │   └── illustrations/
│   └── fonts/
├── components/                     # Composants réutilisables
│   ├── App/
│   │   ├── AppHeader.vue
│   │   ├── AppNavigation.vue
│   │   ├── AppSidebar.vue
│   │   ├── AppFooter.vue
│   │   └── AppBreadcrumb.vue
│   ├── Auth/
│   │   ├── LoginForm.vue
│   │   ├── RegisterForm.vue
│   │   ├── ForgotPasswordForm.vue
│   │   ├── ResetPasswordForm.vue
│   │   ├── EmailVerificationForm.vue
│   │   └── ResendVerificationForm.vue
│   ├── User/
│   │   ├── UserProfile.vue
│   │   ├── UserProfileForm.vue
│   │   ├── UserAvatar.vue
│   │   ├── UserCard.vue
│   │   └── UserBadge.vue
│   ├── Opinion/
│   │   ├── OpinionCard.vue
│   │   ├── OpinionForm.vue
│   │   ├── OpinionList.vue
│   │   ├── OpinionFilters.vue
│   │   ├── OpinionStats.vue
│   │   └── OpinionLikeButton.vue
│   ├── Report/
│   │   ├── ReportCard.vue
│   │   ├── ReportForm.vue
│   │   ├── ReportList.vue
│   │   ├── ReportFilters.vue
│   │   ├── ReportStatusBadge.vue
│   │   ├── ReportPriorityBadge.vue
│   │   ├── ReportMap.vue
│   │   ├── ReportImageUpload.vue
│   │   ├── ReportTimeline.vue
│   │   └── ReportAssignment.vue
│   ├── Message/
│   │   ├── MessageThread.vue
│   │   ├── MessageComposer.vue
│   │   ├── MessageList.vue
│   │   ├── MessageItem.vue
│   │   └── MessageSearch.vue
│   ├── Comment/
│   │   ├── CommentList.vue
│   │   ├── CommentForm.vue
│   │   ├── CommentItem.vue
│   │   └── CommentReply.vue
│   ├── Notification/
│   │   ├── NotificationBell.vue
│   │   ├── NotificationList.vue
│   │   ├── NotificationItem.vue
│   │   └── NotificationCenter.vue
│   ├── Location/
│   │   ├── LocationPicker.vue
│   │   ├── LocationDisplay.vue
│   │   ├── MunicipalitySelect.vue
│   │   └── RegionSelect.vue
│   ├── Tag/
│   │   ├── TagSelector.vue
│   │   ├── TagCloud.vue
│   │   └── TagBadge.vue
│   ├── Stats/
│   │   ├── StatsCard.vue
│   │   ├── StatsChart.vue
│   │   ├── ActivityFeed.vue
│   │   └── PublicStats.vue
│   └── UI/
│       ├── BaseButton.vue
│       ├── BaseInput.vue
│       ├── BaseModal.vue
│       ├── BaseCard.vue
│       ├── BaseBadge.vue
│       ├── BaseSpinner.vue
│       ├── BaseToast.vue
│       ├── BaseDropdown.vue
│       ├── BasePagination.vue
│       ├── BaseFileUpload.vue
│       └── BaseMap.vue
├── composables/                    # Fonctions composables
│   ├── useAuth.ts
│   ├── useApi.ts
│   ├── useNotifications.ts
│   ├── useGeolocation.ts
│   ├── useLocalStorage.ts
│   ├── usePWA.ts
│   ├── useUpload.ts
│   ├── useMap.ts
│   ├── useSearch.ts
│   ├── useRealtime.ts
│   └── useTheme.ts
├── layouts/                        # Layouts Nuxt
│   ├── default.vue
│   ├── auth.vue
│   ├── dashboard.vue
│   └── minimal.vue
├── middleware/                     # Middleware de navigation
│   ├── auth.ts
│   ├── guest.ts
│   ├── verified.ts
│   ├── role.ts
│   └── admin.ts
├── pages/                          # Pages de l'application
│   ├── index.vue                   # Page d'accueil publique
│   ├── auth/
│   │   ├── login.vue
│   │   ├── register.vue
│   │   ├── forgot-password.vue
│   │   ├── reset-password.vue
│   │   ├── verify-email.vue
│   │   └── resend-verification.vue
│   ├── dashboard/
│   │   └── index.vue              # Dashboard personnalisé
│   ├── profile/
│   │   ├── index.vue              # Voir le profil
│   │   └── edit.vue               # Modifier le profil
│   ├── opinions/
│   │   ├── index.vue              # Liste des avis
│   │   ├── create.vue             # Créer un avis
│   │   ├── [id]/
│   │   │   ├── index.vue          # Détail d'un avis
│   │   │   └── edit.vue           # Modifier un avis
│   │   └── my.vue                 # Mes avis
│   ├── reports/
│   │   ├── index.vue              # Liste des signalements
│   │   ├── create.vue             # Créer un signalement
│   │   ├── [id]/
│   │   │   ├── index.vue          # Détail d'un signalement
│   │   │   └── edit.vue           # Modifier un signalement
│   │   ├── my.vue                 # Mes signalements
│   │   └── assigned.vue           # Signalements assignés (élus)
│   ├── messages/
│   │   ├── index.vue              # Liste des messages
│   │   ├── compose.vue            # Composer un message
│   │   └── [id].vue               # Conversation
│   ├── notifications/
│   │   └── index.vue              # Centre de notifications
│   ├── search/
│   │   └── index.vue              # Recherche globale
│   ├── stats/
│       └── public.vue             # Statistiques publiques
│  
├── plugins/                        # Plugins Nuxt
│   ├── api.client.ts
│   ├── auth.client.ts
│   ├── toast.client.ts
│   ├── pwa.client.ts
│   ├── map.client.ts
│   └── websocket.client.ts
├── public/                         # Fichiers publics
│   ├── favicon.ico
│   ├── manifest.json
│   ├── sw.js                      # Service Worker
│   ├── icons/                     # Icônes PWA
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   └── robots.txt
├── server/                         # API Server (optionnel)
│   ├── api/
│   └── tsconfig.json
├── stores/                         # Pinia stores
│   ├── auth.ts
│   ├── user.ts
│   ├── opinions.ts
│   ├── reports.ts
│   ├── messages.ts
│   ├── notifications.ts
│   ├── locations.ts
│   ├── tags.ts
│   ├── stats.ts
│   └── app.ts
├── types/                          # Types TypeScript
│   ├── auth.ts
│   ├── user.ts
│   ├── opinion.ts
│   ├── report.ts
│   ├── message.ts
│   ├── notification.ts
│   ├── location.ts
│   ├── comment.ts
│   ├── tag.ts
│   ├── stats.ts
│   └── api.ts
├── utils/                          # Utilitaires
│   ├── api.ts
│   ├── auth.ts
│   ├── validation.ts
│   ├── formatting.ts
│   ├── constants.ts
│   ├── permissions.ts
│   ├── upload.ts
│   └── geo.ts
├── .env                           # Variables d'environnement
├── nuxt.config.ts                 # Configuration Nuxt
├── package.json
├── tailwind.config.js             # Configuration Tailwind (via Nuxt UI)
├── tsconfig.json                  # Configuration TypeScript
├── pwa.config.ts                  # Configuration PWA
└── README.md
```

## 🔧 Configuration Principale

### `nuxt.config.ts`

```typescript
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt'
  ],
  
  // Configuration PWA
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 20
    },
    manifest: {
      name: 'CivActu - Démocratie Participative',
      short_name: 'CivActu',
      description: 'Application citoyenne pour la démocratie participative',
      theme_color: '#3B82F6',
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      categories: ['government', 'social', 'productivity'],
      screenshots: [
        {
          src: 'screenshots/mobile-1.png',
          sizes: '390x844',
          type: 'image/png',
          form_factor: 'narrow'
        },
        {
          src: 'screenshots/desktop-1.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide'
        }
      ],
      icons: [
        {
          src: 'icons/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: 'icons/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: 'icons/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png'
        },
        {
          src: 'icons/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: 'icons/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icons/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },
  
  // Configuration API
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:3001/api/v1',
      wsUrl: process.env.WS_URL || 'ws://localhost:3001',
      appName: 'CivActu',
      appVersion: '1.0.0',
      mapboxToken: process.env.MAPBOX_TOKEN,
      vapidPublicKey: process.env.VAPID_PUBLIC_KEY
    }
  },
  
  // Configuration Nuxt UI
  ui: {
    global: true,
    icons: ['heroicons', 'simple-icons']
  },
  
  // CSS Framework
  <!-- css: ['~/assets/css/main.css'], -->
  
  // Configuration TypeScript
  typescript: {
    typeCheck: true
  },
  
  // SSR Configuration
  ssr: true,
  
  // Routage
  router: {
    middleware: ['auth']
  }
})
```

### `package.json`

```json
{
  "name": "civactu-frontend",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nuxt dev",
    "build": "nuxt build",
    "preview": "nuxt preview",
    "generate": "nuxt generate",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "type-check": "nuxt typecheck"
  },
  "dependencies": {
    "@nuxt/eslint": "^1.4.1",
    "@nuxt/fonts": "^0.11.4",
    "@nuxt/icon": "^1.15.0",
    "@nuxt/image": "^1.10.0",
    "@nuxt/scripts": "^0.11.8",
    "@nuxt/ui": "^3.2.0",
    "@pinia/nuxt": "^0.5.1",
    "@vite-pwa/nuxt": "^0.4.0",
    "@vueuse/nuxt": "^11.0.0",
    "mapbox-gl": "^3.0.0",
    "nuxt": "^3.17.5",
    "pinia": "^2.2.0",
    "vue": "^3.5.17",
    "vue-router": "^4.5.1",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/mapbox-gl": "^3.1.0",
    "typescript": "^5.8.3"
  }
}
```

## 🔐 Gestion de l'Authentification

### Store Pinia - `stores/auth.ts`

```typescript
import { defineStore } from 'pinia'
import type { User, LoginCredentials, RegisterData, AuthResponse } from '~/types/auth'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isEmailVerified: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    isEmailVerified: false
  }),

  getters: {
    userRole: (state): string => state.user?.role || 'CITIZEN',
    isAdmin: (state): boolean => state.user?.role === 'ADMIN',
    isOfficial: (state): boolean => state.user?.role === 'OFFICIAL',
    isCitizen: (state): boolean => state.user?.role === 'CITIZEN',
    userFullName: (state): string => 
      state.user ? `${state.user.firstName} ${state.user.lastName}` : '',
    hasProfile: (state): boolean => !!state.user?.profile,
    municipality: (state) => state.user?.profile?.municipality,
    region: (state) => state.user?.profile?.region
  },

  actions: {
    async login(credentials: LoginCredentials) {
      try {
        this.isLoading = true
        const { data } = await $fetch<AuthResponse>('/auth/login', {
          method: 'POST',
          body: credentials
        })
        
        this.setAuth(data.user, data.access_token)
        await navigateTo('/dashboard')
        
        return { success: true }
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur de connexion')
      } finally {
        this.isLoading = false
      }
    },

    async register(userData: RegisterData) {
      try {
        this.isLoading = true
        const { data } = await $fetch<AuthResponse>('/auth/register', {
          method: 'POST',
          body: userData
        })
        
        return { 
          success: true, 
          message: 'Inscription réussie. Vérifiez votre email.' 
        }
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur d\'inscription')
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.clearAuth()
      await navigateTo('/auth/login')
    },

    async verifyEmail(token: string) {
      try {
        await $fetch('/auth/verify-email', {
          method: 'POST',
          body: { token }
        })
        
        this.isEmailVerified = true
        return { success: true }
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur de vérification')
      }
    },

    async resendVerification(email: string) {
      try {
        await $fetch('/auth/resend-verification', {
          method: 'POST',
          body: { email }
        })
        
        return { success: true }
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur lors de l\'envoi')
      }
    },

    async forgotPassword(email: string) {
      try {
        await $fetch('/auth/forgot-password', {
          method: 'POST',
          body: { email }
        })
        return { success: true }
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur lors de l\'envoi')
      }
    },

    async resetPassword(token: string, password: string) {
      try {
        await $fetch('/auth/reset-password', {
          method: 'POST',
          body: { token, password }
        })
        return { success: true }
      } catch (error: any) {
        throw new Error(error.data?.message || 'Erreur de réinitialisation')
      }
    },

    setAuth(user: User, token: string) {
      this.user = user
      this.token = token
      this.isAuthenticated = true
      this.isEmailVerified = user.isVerified
      
      // Stocker le token en cookie sécurisé
      const tokenCookie = useCookie('auth-token', {
        httpOnly: false,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 jours
      })
      tokenCookie.value = token
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.isEmailVerified = false
      
      const tokenCookie = useCookie('auth-token')
      tokenCookie.value = null
    },

    async initializeAuth() {
      const tokenCookie = useCookie('auth-token')
      const token = tokenCookie.value
      
      if (token) {
        try {
          const { data } = await $fetch<{ user: User }>('/users/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          
          this.setAuth(data.user, token)
        } catch (error) {
          this.clearAuth()
        }
      }
    },

    async refreshToken() {
      try {
        const { data } = await $fetch<AuthResponse>('/auth/refresh')
        this.setAuth(data.user, data.access_token)
        return { success: true }
      } catch (error) {
        this.clearAuth()
        throw error
      }
    }
  }
})
```

## 📱 Composables Principaux

### `composables/useApi.ts`

```typescript
export const useApi = () => {
  const { token } = useAuthStore()
  const config = useRuntimeConfig()
  const toast = useToast()
  
  const apiCall = async <T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    
    try {
      return await $fetch<T>(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers
      })
    } catch (error: any) {
      if (error.status === 401) {
        const authStore = useAuthStore()
        authStore.clearAuth()
        await navigateTo('/auth/login')
        toast.add({ 
          title: 'Session expirée', 
          description: 'Veuillez vous reconnecter',
          color: 'red' 
        })
      } else if (error.status >= 500) {
        toast.add({ 
          title: 'Erreur serveur', 
          description: 'Une erreur inattendue est survenue',
          color: 'red' 
        })
      }
      throw error
    }
  }
  
  // Méthodes spécifiques
  const get = <T>(endpoint: string, query: any = {}) => 
    apiCall<T>(endpoint, { 
      method: 'GET',
      query
    })
  
  const post = <T>(endpoint: string, data: any) => 
    apiCall<T>(endpoint, { 
      method: 'POST', 
      body: data 
    })
  
  const put = <T>(endpoint: string, data: any) => 
    apiCall<T>(endpoint, { 
      method: 'PUT', 
      body: data 
    })
  
  const patch = <T>(endpoint: string, data: any) => 
    apiCall<T>(endpoint, { 
      method: 'PATCH', 
      body: data 
    })
  
  const del = <T>(endpoint: string) => 
    apiCall<T>(endpoint, { method: 'DELETE' })
  
  return {
    apiCall,
    get,
    post,
    put,
    patch,
    delete: del
  }
}
```

### `composables/useNotifications.ts`

```typescript
export const useNotifications = () => {
  const api = useApi()
  const toast = useToast()
  
  const notifications = ref([])
  const unreadCount = computed(() => 
    notifications.value.filter(n => n.status === 'UNREAD').length
  )
  
  const fetchNotifications = async (filters: any = {}) => {
    try {
      const { data } = await api.get('/notifications', filters)
      notifications.value = data
      return data
    } catch (error) {
      toast.add({ 
        title: 'Erreur', 
        description: 'Impossible de charger les notifications',
        color: 'red' 
      })
      throw error
    }
  }
  
  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.status = 'READ'
        notification.readAt = new Date().toISOString()
      }
    } catch (error) {
      toast.add({ 
        title: 'Erreur', 
        description: 'Impossible de marquer comme lu',
        color: 'red' 
      })
    }
  }
  
  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all')
      notifications.value.forEach(n => {
        n.status = 'READ'
        n.readAt = new Date().toISOString()
      })
      toast.add({ 
        title: 'Succès', 
        description: 'Toutes les notifications ont été marquées comme lues',
        color: 'green' 
      })
    } catch (error) {
      toast.add({ 
        title: 'Erreur', 
        description: 'Impossible de marquer toutes comme lues',
        color: 'red' 
      })
    }
  }
  
  return {
    notifications: readonly(notifications),
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}
```

### `composables/useGeolocation.ts`

```typescript
export const useGeolocation = () => {
  const coordinates = ref<{ latitude: number; longitude: number } | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  
  const getCurrentPosition = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Géolocalisation non supportée'))
        return
      }
      
      isLoading.value = true
      error.value = null
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          coordinates.value = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          isLoading.value = false
          resolve(position)
        },
        (err) => {
          error.value = getGeolocationErrorMessage(err.code)
          isLoading.value = false
          reject(err)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    })
  }
  
  const getGeolocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Permission de géolocalisation refusée'
      case 2:
        return 'Position indisponible'
      case 3:
        return 'Délai d\'attente dépassé'
      default:
        return 'Erreur de géolocalisation inconnue'
    }
  }
  
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Implémentation avec Mapbox ou autre service
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${useRuntimeConfig().public.mapboxToken}&types=address&limit=1`
      )
      const data = await response.json()
      return data.features[0]?.place_name || 'Adresse inconnue'
    } catch (err) {
      throw new Error('Impossible de récupérer l\'adresse')
    }
  }
  
  return {
    coordinates: readonly(coordinates),
    isLoading: readonly(isLoading),
    error: readonly(error),
    getCurrentPosition,
    reverseGeocode
  }
}
```

## 🎨 Middleware de Navigation

### `middleware/auth.ts`

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuthStore()
  
  if (!isAuthenticated) {
    return navigateTo('/auth/login')
  }
})
```

### `middleware/verified.ts`

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  
  if (authStore.isAuthenticated && !authStore.isEmailVerified) {
    return navigateTo('/auth/verify-email')
  }
})
```

### `middleware/role.ts`

```typescript
export default defineNuxtRouteMiddleware((to, from) => {
  const { userRole } = useAuthStore()
  const requiredRole = to.meta.requiresRole
  
  if (requiredRole && userRole !== requiredRole) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit'
    })
  }
})
```

## 🗂️ Types TypeScript

### `types/auth.ts`

```typescript
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  avatar?: string
  role: 'CITIZEN' | 'OFFICIAL' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  isVerified: boolean
  lastLoginAt?: string
  profile?: UserProfile
  createdAt: string
  updatedAt: string
}

export interface UserProfile {
  id: string
  dateOfBirth?: string
  address?: string
  postalCode?: string
  city?: string
  biography?: string
  website?: string
  socialLinks?: Record<string, string>
  preferences?: Record<string, any>
  municipality?: Municipality
  region?: Region
}

export interface Municipality {
  id: string
  name: string
  postalCode: string
  inseeCode: string
  description?: string
  latitude?: number
  longitude?: number
}

export interface Region {
  id: string
  name: string
  code: string
  description?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role?: 'CITIZEN' | 'OFFICIAL'
}

export interface AuthResponse {
  access_token: string
  user: User
}
```

### `types/report.ts`

```typescript
export interface Report {
  id: string
  title: string
  description: string
  category: ReportCategory
  status: ReportStatus
  isAnonymous: boolean
  priority: 1 | 2 | 3 | 4 // Low, Medium, High, Critical
  address?: string
  latitude?: number
  longitude?: number
  images: string[]
  documents: string[]
  incidentDate?: string
  resolvedAt?: string
  reporter: User
  assignedTo?: User
  municipality?: Municipality
  region?: Region
  updates: ReportUpdate[]
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export type ReportStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'

export type ReportCategory = 
  | 'INFRASTRUCTURE'
  | 'ENVIRONMENT' 
  | 'SECURITY'
  | 'PUBLIC_SERVICE'
  | 'TRANSPORTATION'
  | 'HEALTH'
  | 'EDUCATION'
  | 'OTHER'

export interface ReportUpdate {
  id: string
  content: string
  status?: ReportStatus
  updatedBy: User
  createdAt: string
}

export interface CreateReportDto {
  title: string
  description: string
  category: ReportCategory
  priority?: number
  address?: string
  latitude?: number
  longitude?: number
  municipalityId?: string
  isAnonymous?: boolean
  incidentDate?: string
  images?: string[]
}
```

### `types/opinion.ts`

```typescript
export interface Opinion {
  id: string
  title: string
  content: string
  type: OpinionType
  isPublic: boolean
  isAnonymous: boolean
  likesCount: number
  viewsCount: number
  author: User
  municipality?: Municipality
  region?: Region
  comments: Comment[]
  tags: Tag[]
  createdAt: string
  updatedAt: string
}

export type OpinionType = 'SUPPORT' | 'OPPOSE' | 'NEUTRAL' | 'SUGGESTION'

export interface Tag {
  id: string
  name: string
  color: string
  description?: string
}

export interface CreateOpinionDto {
  title: string
  content: string
  type: OpinionType
  isPublic?: boolean
  isAnonymous?: boolean
  municipalityId?: string
  tags?: string[]
}
```

## 📄 Pages Principales

### `pages/dashboard/index.vue`

```vue
<template>
  <div class="space-y-6">
    <!-- En-tête du dashboard -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Bonjour {{ userFullName }} 👋
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Voici un aperçu de votre activité
        </p>
      </div>
      <UserAvatar :user="user" size="lg" />
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Mes Avis" 
        :value="userStats.opinions" 
        icon="i-heroicons-chat-bubble-left"
        color="blue"
        :to="`/opinions/my`"
      />
      <StatsCard 
        title="Mes Signalements" 
        :value="userStats.reports" 
        icon="i-heroicons-exclamation-triangle"
        color="orange"
        :to="`/reports/my`"
      />
      <StatsCard 
        title="Messages" 
        :value="userStats.messages" 
        icon="i-heroicons-envelope"
        color="green"
        :badge="userStats.unreadMessages > 0 ? userStats.unreadMessages : undefined"
        :to="`/messages`"
      />
      <StatsCard 
        title="Notifications" 
        :value="unreadCount" 
        icon="i-heroicons-bell"
        color="purple"
        :to="`/notifications`"
      />
    </div>

    <!-- Contenu principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activité récente -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Activité récente</h2>
              <UButton 
                variant="ghost" 
                size="sm"
                to="/dashboard/activity"
              >
                Voir tout
              </UButton>
            </div>
          </template>
          
          <ActivityFeed :activities="recentActivities" />
        </UCard>
      </div>
      
      <!-- Notifications -->
      <div>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Notifications</h2>
              <UBadge v-if="unreadCount > 0" :label="unreadCount" />
            </div>
          </template>
          
          <NotificationList 
            :notifications="notifications.slice(0, 5)" 
            @mark-as-read="markAsRead"
          />
          
          <template #footer v-if="notifications.length > 5">
            <UButton 
              variant="ghost" 
              block 
              to="/notifications"
            >
              Voir toutes les notifications
            </UButton>
          </template>
        </UCard>
      </div>
    </div>

    <!-- Signalements assignés (pour les élus) -->
    <div v-if="isOfficial" class="space-y-4">
      <h2 class="text-2xl font-bold">Signalements assignés</h2>
      <ReportList 
        :reports="assignedReports" 
        :show-assignment="false"
        @update-status="handleReportUpdate"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['auth', 'verified'],
  layout: 'dashboard'
})

const { user, userFullName, isOfficial } = useAuth()
const { notifications, unreadCount, markAsRead } = useNotifications()
const { get } = useApi()

// Récupération des données du dashboard
const { data: dashboardData } = await useLazyAsyncData('dashboard', () =>
  get('/stats/dashboard')
)

const userStats = computed(() => dashboardData.value?.userStats || {})
const recentActivities = computed(() => dashboardData.value?.recentActivities || [])
const assignedReports = computed(() => dashboardData.value?.assignedReports || [])

// Mise à jour des notifications en temps réel
onMounted(async () => {
  await notifications.fetchNotifications({ limit: 10 })
})

const handleReportUpdate = async (reportId: string, update: any) => {
  try {
    await get(`/reports/${reportId}/update`, update)
    await refreshCookie('dashboard')
  } catch (error) {
    // Géré par le composable useApi
  }
}
</script>
```

### `pages/reports/create.vue`

```vue
<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Créer un signalement
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2">
        Signalez un problème dans votre commune pour améliorer votre quotidien
      </p>
    </div>

    <UForm
      :schema="reportSchema"
      :state="form"
      @submit="onSubmit"
      class="space-y-6"
    >
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Informations générales</h2>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Titre" name="title" required>
            <UInput 
              v-model="form.title"
              placeholder="Décrivez brièvement le problème"
            />
          </UFormGroup>

          <UFormGroup label="Description" name="description" required>
            <UTextarea 
              v-model="form.description"
              placeholder="Décrivez le problème en détail..."
              :rows="4"
            />
          </UFormGroup>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UFormGroup label="Catégorie" name="category" required>
              <USelect
                v-model="form.category"
                :options="categoryOptions"
                placeholder="Sélectionnez une catégorie"
              />
            </UFormGroup>

            <UFormGroup label="Priorité" name="priority">
              <USelect
                v-model="form.priority"
                :options="priorityOptions"
                placeholder="Niveau de priorité"
              />
            </UFormGroup>
          </div>

          <UFormGroup label="Date de l'incident" name="incidentDate">
            <UInput 
              v-model="form.incidentDate"
              type="datetime-local"
            />
          </UFormGroup>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Localisation</h2>
        </template>

        <div class="space-y-4">
          <UFormGroup label="Adresse" name="address">
            <UInput 
              v-model="form.address"
              placeholder="123 rue de la République, 75001 Paris"
            />
          </UFormGroup>

          <div class="flex space-x-4">
            <UButton 
              @click="getCurrentLocation"
              :loading="geoLoading"
              variant="outline"
            >
              <UIcon name="i-heroicons-map-pin" class="mr-2" />
              Utiliser ma position
            </UButton>
            
            <UButton 
              @click="showMap = !showMap"
              variant="outline"
            >
              <UIcon name="i-heroicons-map" class="mr-2" />
              {{ showMap ? 'Masquer' : 'Afficher' }} la carte
            </UButton>
          </div>

          <LocationPicker
            v-if="showMap"
            v-model:latitude="form.latitude"
            v-model:longitude="form.longitude"
            v-model:address="form.address"
            class="h-80 rounded-lg"
          />
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Photos et documents</h2>
        </template>

        <div class="space-y-4">
          <ReportImageUpload
            v-model="form.images"
            :max-files="5"
            :max-size="5 * 1024 * 1024"
            accept="image/*"
          />
          
          <p class="text-sm text-gray-500">
            Ajoutez jusqu'à 5 photos (max 5Mo chacune) pour illustrer le problème
          </p>
        </div>
      </UCard>

      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">Options</h2>
        </template>

        <div class="space-y-4">
          <UFormGroup>
            <UCheckbox
              v-model="form.isAnonymous"
              label="Signalement anonyme"
              help="Votre nom ne sera pas visible publiquement"
            />
          </UFormGroup>
        </div>
      </UCard>

      <div class="flex justify-end space-x-4">
        <UButton 
          variant="outline" 
          @click="$router.back()"
        >
          Annuler
        </UButton>
        <UButton 
          type="submit"
          :loading="isSubmitting"
        >
          Créer le signalement
        </UButton>
      </div>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  middleware: ['auth', 'verified'],
  layout: 'default'
})

const { post } = useApi()
const { getCurrentPosition } = useGeolocation()
const toast = useToast()

const reportSchema = z.object({
  title: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères'),
  category: z.string().min(1, 'La catégorie est requise'),
  priority: z.number().optional(),
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  incidentDate: z.string().optional(),
  isAnonymous: z.boolean().optional()
})

const form = reactive({
  title: '',
  description: '',
  category: '',
  priority: 2,
  address: '',
  latitude: undefined,
  longitude: undefined,
  incidentDate: '',
  images: [],
  isAnonymous: false
})

const showMap = ref(false)
const geoLoading = ref(false)
const isSubmitting = ref(false)

const categoryOptions = [
  { label: 'Infrastructure', value: 'INFRASTRUCTURE' },
  { label: 'Environnement', value: 'ENVIRONMENT' },
  { label: 'Sécurité', value: 'SECURITY' },
  { label: 'Service Public', value: 'PUBLIC_SERVICE' },
  { label: 'Transport', value: 'TRANSPORTATION' },
  { label: 'Santé', value: 'HEALTH' },
  { label: 'Éducation', value: 'EDUCATION' },
  { label: 'Autre', value: 'OTHER' }
]

const priorityOptions = [
  { label: 'Faible', value: 1 },
  { label: 'Moyenne', value: 2 },
  { label: 'Élevée', value: 3 },
  { label: 'Critique', value: 4 }
]

const getCurrentLocation = async () => {
  try {
    geoLoading.value = true
    const position = await getCurrentPosition()
    form.latitude = position.coords.latitude
    form.longitude = position.coords.longitude
    
    // Géocodage inverse pour obtenir l'adresse
    const { reverseGeocode } = useGeolocation()
    form.address = await reverseGeocode(form.latitude, form.longitude)
    
    toast.add({
      title: 'Position obtenue',
      description: 'Votre position a été ajoutée au signalement',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Erreur de géolocalisation',
      description: error.message,
      color: 'red'
    })
  } finally {
    geoLoading.value = false
  }
}

const onSubmit = async () => {
  try {
    isSubmitting.value = true
    
    const reportData = {
      ...form,
      images: form.images.map(img => img.base64) // Conversion en base64 si nécessaire
    }
    
    const { data } = await post('/reports', reportData)
    
    toast.add({
      title: 'Signalement créé',
      description: 'Votre signalement a été créé avec succès',
      color: 'green'
    })
    
    await navigateTo(`/reports/${data.id}`)
  } catch (error) {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de créer le signalement',
      color: 'red'
    })
  } finally {
    isSubmitting.value = false
  }
}
</script>
```

## 🔔 Système de Notifications PWA

### `plugins/pwa.client.ts`

```typescript
export default defineNuxtPlugin(() => {
  const { $pwa } = useNuxtApp()
  const config = useRuntimeConfig()
  const { isAuthenticated } = useAuthStore()
  
  // Gestion des mises à jour PWA
  if ($pwa?.workbox) {
    $pwa.workbox.addEventListener('waiting', () => {
      const toast = useToast()
      toast.add({
        title: 'Mise à jour disponible',
        description: 'Une nouvelle version de l\'application est disponible',
        color: 'blue',
        actions: [{
          label: 'Actualiser',
          click: () => {
            $pwa.workbox.messageSkipWaiting()
            window.location.reload()
          }
        }]
      })
    })
  }
  
  // Configuration des notifications push
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(async (registration) => {
      if (!isAuthenticated) return
      
      // Vérifier l'abonnement existant
      let subscription = await registration.pushManager.getSubscription()
      
      if (!subscription) {
        // Demander permission et s'abonner
        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          subscription = await subscribeToPush(registration)
        }
      }
      
      // Envoyer l'abonnement au serveur
      if (subscription) {
        await sendSubscriptionToServer(subscription)
      }
    })
  }
  
  async function subscribeToPush(registration: ServiceWorkerRegistration) {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.public.vapidPublicKey)
    })
    
    return subscription
  }
  
  async function sendSubscriptionToServer(subscription: PushSubscription) {
    try {
      await $fetch('/notifications/subscribe', {
        method: 'POST',
        body: subscription,
        headers: {
          'Authorization': `Bearer ${useAuthStore().token}`
        }
      })
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'abonnement:', error)
    }
  }
  
  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')
    
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }
})
```

## 📊 Gestion d'État avec Pinia

### `stores/reports.ts`

```typescript
import { defineStore } from 'pinia'
import type { Report, CreateReportDto, ReportStatus } from '~/types/report'

interface ReportsState {
  reports: Report[]
  currentReport: Report | null
  isLoading: boolean
  filters: {
    status?: ReportStatus
    category?: string
    municipality?: string
    assignedToMe?: boolean
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export const useReportsStore = defineStore('reports', {
  state: (): ReportsState => ({
    reports: [],
    currentReport: null,
    isLoading: false,
    filters: {},
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    }
  }),

  getters: {
    pendingReports: (state): Report[] => 
      state.reports.filter(r => r.status === 'PENDING'),
    
    myReports: (state): Report[] => {
      const { user } = useAuthStore()
      return state.reports.filter(r => r.reporter.id === user?.id)
    },
    
    assignedReports: (state): Report[] => {
      const { user } = useAuthStore()
      return state.reports.filter(r => r.assignedTo?.id === user?.id)
    },
    
    reportsByCategory: (state) => {
      return state.reports.reduce((acc, report) => {
        const category = report.category
        if (!acc[category]) acc[category] = []
        acc[category].push(report)
        return acc
      }, {} as Record<string, Report[]>)
    }
  },

  actions: {
    async fetchReports(queryParams: any = {}) {
      try {
        this.isLoading = true
        const { get } = useApi()
        
        const params = {
          ...this.filters,
          ...queryParams,
          page: this.pagination.page,
          limit: this.pagination.limit
        }
        
        const { data, meta } = await get('/reports', params)
        
        if (params.page === 1) {
          this.reports = data
        } else {
          this.reports.push(...data)
        }
        
        this.pagination = meta.pagination
        
        return data
      } catch (error) {
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async fetchReport(id: string) {
      try {
        const { get } = useApi()
        const { data } = await get(`/reports/${id}`)
        
        this.currentReport = data
        
        // Mettre à jour dans la liste si elle existe
        const index = this.reports.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reports[index] = data
        }
        
        return data
      } catch (error) {
        throw error
      }
    },

    async createReport(reportData: CreateReportDto) {
      try {
        const { post } = useApi()
        const { data } = await post('/reports', reportData)
        
        this.reports.unshift(data)
        this.pagination.total++
        
        return data
      } catch (error) {
        throw error
      }
    },

    async updateReport(id: string, updateData: Partial<Report>) {
      try {
        const { put } = useApi()
        const { data } = await put(`/reports/${id}`, updateData)
        
        const index = this.reports.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reports[index] = { ...this.reports[index], ...data }
        }
        
        if (this.currentReport?.id === id) {
          this.currentReport = { ...this.currentReport, ...data }
        }
        
        return data
      } catch (error) {
        throw error
      }
    },

    async assignReport(id: string, assignedToId: string) {
      try {
        const { post } = useApi()
        const { data } = await post(`/reports/${id}/assign`, { assignedToId })
        
        const index = this.reports.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reports[index] = { ...this.reports[index], ...data }
        }
        
        return data
      } catch (error) {
        throw error
      }
    },

    async updateStatus(id: string, status: ReportStatus, content?: string) {
      try {
        const { post } = useApi()
        const { data } = await post(`/reports/${id}/update`, { status, content })
        
        const index = this.reports.findIndex(r => r.id === id)
        if (index !== -1) {
          this.reports[index] = { ...this.reports[index], ...data }
        }
        
        return data
      } catch (error) {
        throw error
      }
    },

    async deleteReport(id: string) {
      try {
        const { delete: del } = useApi()
        await del(`/reports/${id}`)
        
        this.reports = this.reports.filter(r => r.id !== id)
        this.pagination.total--
        
        if (this.currentReport?.id === id) {
          this.currentReport = null
        }
      } catch (error) {
        throw error
      }
    },

    setFilters(filters: Partial<ReportsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.page = 1
    },

    clearFilters() {
      this.filters = {}
      this.pagination.page = 1
    },

    setPage(page: number) {
      this.pagination.page = page
    }
  }
})
```

## 🚀 Configuration de Déploiement

### Variables d'environnement - `.env`

```bash
# API Configuration
API_BASE_URL=https://api.civactu.fr/api/v1
WS_URL=wss://api.civactu.fr

# Map Services
MAPBOX_TOKEN=your_mapbox_token_here

# PWA & Notifications
VAPID_PUBLIC_KEY=your_vapid_public_key_here

# Analytics (optionnel)
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Build Configuration
NUXT_PUBLIC_APP_NAME=CivActu
NUXT_PUBLIC_APP_VERSION=1.0.0
```

### Script de déploiement

```bash
# Build et génération
npm run build

# Upload des assets statiques
npm run generate

# Configuration du service worker
# Les fichiers seront dans .output/public/
```

## 📱 Fonctionnalités PWA Avancées

- **Installation native** : Prompt d'installation automatique
- **Mode hors-ligne** : Cache intelligent avec Workbox
- **Notifications push** : Intégration complète avec l'API
- **Synchronisation en arrière-plan** : Sync des données
- **Partage natif** : API de partage pour les signalements/avis
- **Géolocalisation** : Intégration avec les cartes
- **Appareil photo** : Capture directe pour les signalements

## 🎨 Design System

L'application utilise **Nuxt UI** qui fournit :
- Composants prêts à l'emploi
- Système de couleurs cohérent
- Mode sombre/clair automatique
- Responsive design par défaut
- Accessibilité intégrée
- Icônes Heroicons

Cette architecture offre une base complète et moderne pour développer l'interface utilisateur de CivActu, avec une approche PWA native, une expérience utilisateur optimisée et une intégration parfaite avec l'API backend existante.
