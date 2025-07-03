// Types pour les meta de route
export interface RouteMeta {
  requiresRole?: string
  requiresRoles?: string[]
  layout?: string
  middleware?: string | string[]
}

// Augmenter le type global de Nuxt pour inclure nos meta personnalisées
declare module 'vue-router' {
  interface RouteMeta {
    requiresRole?: string
    requiresRoles?: string[]
  }
}
