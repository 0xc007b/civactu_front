import type { User } from '~/types/user'

// Constantes pour les tokens
export const AUTH_TOKEN_KEY = 'auth-token'
export const REFRESH_TOKEN_KEY = 'refresh-token'
export const USER_DATA_KEY = 'user-data'

// Gestion des tokens
export function setAuthToken(token: string): void {
  if (import.meta.client) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }
}

export function getAuthToken(): string | null {
  if (import.meta.client) {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  }
  return null
}

export function removeAuthToken(): void {
  if (import.meta.client) {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  }
}

export function setRefreshToken(token: string): void {
  if (import.meta.client) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  }
}

export function getRefreshToken(): string | null {
  if (import.meta.client) {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }
  return null
}

// Gestion des données utilisateur
export function setUserData(user: User): void {
  if (import.meta.client) {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  }
}

export function getUserData(): User | null {
  if (import.meta.client) {
    const userData = localStorage.getItem(USER_DATA_KEY)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        console.error('Error parsing user data:', error)
        removeAuthToken()
        return null
      }
    }
  }
  return null
}

export function removeUserData(): void {
  if (import.meta.client) {
    localStorage.removeItem(USER_DATA_KEY)
  }
}

// Validation des tokens
export function isTokenExpired(token: string): boolean {
  if (!token) return true
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Date.now() / 1000
    return payload.exp < currentTime
  } catch (error) {
    return true
  }
}

export function getTokenPayload(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (error) {
    return null
  }
}

// Nettoyage complet de l'authentification
export function clearAuth(): void {
  if (import.meta.client) {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  }
}

// Note: Les fonctions de rôles et permissions sont disponibles dans utils/permissions.ts
// Note: Les fonctions de formatage utilisateur sont disponibles dans utils/formatting.ts
