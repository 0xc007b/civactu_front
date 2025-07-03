# Refactorisation de l'API - Unification des systèmes

## Problème identifié

Le projet avait deux systèmes d'API distincts qui faisaient essentiellement la même chose :

1. **`useApi()` composable** - Utilisait `$fetch` de Nuxt avec sa propre logique
2. **`ApiClient` classe** - Utilisait `fetch` natif avec une instance globale via `$api`

Cette duplication causait :
- Code redondant et maintenance difficile
- Logique d'authentification dupliquée
- Gestion d'erreur incohérente
- Confusion sur quelle API utiliser

## Solution implémentée

### 1. Refactorisation du composable `useApi`

Le composable `useApi` a été simplifié pour agir comme un wrapper autour de l'`ApiClient` global :

```typescript
// Avant : Logic complexe avec $fetch
export const useApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  
  const createHeaders = () => { /* ... */ }
  const buildURL = () => { /* ... */ }
  const handleError = () => { /* ... */ }
  
  const get = async () => {
    // Logique complexe avec $fetch
  }
  // ...
}

// Après : Wrapper simple autour d'ApiClient
export const useApi = () => {
  const { $api } = useNuxtApp()

  const get = async <T>(endpoint: string, params?: ApiQueryParams) => {
    return $api.get<ApiResponse<T>>(endpoint, params)
  }
  // ...
}
```

### 2. Amélioration de l'ApiClient

L'`ApiClient` a été amélioré pour :
- Récupérer automatiquement le token d'authentification depuis les cookies
- Exposer publiquement le `baseURL` via `apiBaseURL`
- Gérer l'authentification de manière transparente

```typescript
// Nouveau : Récupération automatique du token
private getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const cookies = document.cookie.split(';')
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='))
    if (authCookie) {
      return authCookie.split('=')[1]
    }
  }
  return null
}

private createHeaders(customHeaders = {}): Record<string, string> {
  const headers = { ...this.defaultHeaders, ...customHeaders }
  
  // Récupération automatique du token
  const token = this.getAuthToken()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  return headers
}
```

## Avantages de cette approche

### ✅ Compatibilité complète
- Aucun changement nécessaire dans le code existant
- Tous les appels `useApi()` continuent de fonctionner
- Interface identique maintenue

### ✅ Code unifié
- Une seule source de vérité pour les appels API
- Logique d'authentification centralisée
- Gestion d'erreur cohérente

### ✅ Maintenance simplifiée
- Plus de duplication de code
- Un seul endroit pour les améliorations futures
- Tests plus faciles

### ✅ Flexibilité préservée
- `useApi()` pour l'usage simple dans les composants
- `$api` direct pour les cas complexes (stores, plugins)

## Utilisation

### Dans les composables (recommandé)
```typescript
// useApiNotifications.ts
export const useApiNotifications = () => {
  const { get, put, post } = useApi() // Interface familière
  
  const getUserNotifications = async (params?: ApiQueryParams) => {
    return await get('/api/v1/notifications', params)
  }
  // ...
}
```

### Dans les stores (pour les cas complexes)
```typescript
// stores/auth.ts
const { $api } = useNuxtApp()
const response = await $api.post<AuthResponse>('/api/v1/auth/login', credentials)
```

## Migration pour les développeurs

**Aucune action requise !** 

Tous les appels existants continuent de fonctionner exactement comme avant. Le changement est transparent.

## Prochaines étapes possibles

1. **Standardiser l'utilisation** : Migrer progressivement tous les usages vers `useApi()` pour la cohérence
2. **Améliorer le typage** : Ajouter des types plus spécifiques pour chaque endpoint
3. **Ajouter du cache** : Implémenter un système de cache dans l'ApiClient
4. **Optimiser les performances** : Ajouter la gestion des requêtes en parallèle

## Test de la migration

Pour vérifier que tout fonctionne :

1. Lancer l'application : `npm run dev`
2. Tester l'authentification
3. Vérifier les notifications
4. Tester l'upload de fichiers

Aucune régression ne devrait être observée.
