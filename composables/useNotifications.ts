import type { Notification as AppNotification } from '~/types'

interface NotificationOptions {
  title: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  persistent?: boolean
  action?: {
    label: string
    handler: () => void
  }
}

export const useNotifications = () => {
  const appStore = useAppStore()
  const notificationsStore = useNotificationsStore()

  // Expose reactive state from notifications store
  const { notifications, unreadCount, loading } = storeToRefs(notificationsStore)

  const show = (options: NotificationOptions) => {
    appStore.addNotification({
      type: options.type || 'info',
      title: options.title,
      message: options.message,
      timeout: options.duration
    })
  }

  const success = (title: string, message: string, options: Partial<NotificationOptions> = {}) => {
    show({
      type: 'success',
      title,
      message,
      ...options
    })
  }

  const error = (title: string, message: string, options: Partial<NotificationOptions> = {}) => {
    show({
      type: 'error',
      title,
      message,
      persistent: true,
      ...options
    })
  }

  const warning = (title: string, message: string, options: Partial<NotificationOptions> = {}) => {
    show({
      type: 'warning',
      title,
      message,
      ...options
    })
  }

  const info = (title: string, message: string, options: Partial<NotificationOptions> = {}) => {
    show({
      type: 'info',
      title,
      message,
      ...options
    })
  }

  const clear = (id: string) => {
    appStore.removeNotification(id)
  }

  const clearAll = () => {
    appStore.clearNotifications()
  }

  // Handle API errors
  const handleApiError = (error: any, fallbackMessage = 'Une erreur est survenue') => {
    let title = 'Erreur'
    let message = fallbackMessage

    if (error?.response?.data?.message) {
      message = error.response.data.message
    } else if (error?.message) {
      message = error.message
    }

    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          title = 'Données invalides'
          break
        case 401:
          title = 'Non autorisé'
          message = 'Vous devez vous connecter pour effectuer cette action'
          break
        case 403:
          title = 'Accès refusé'
          message = 'Vous n\'avez pas les permissions nécessaires'
          break
        case 404:
          title = 'Ressource introuvable'
          break
        case 429:
          title = 'Trop de requêtes'
          message = 'Veuillez patienter avant de réessayer'
          break
        case 500:
          title = 'Erreur serveur'
          message = 'Une erreur interne est survenue'
          break
      }
    }

    error(title, message)
  }

  // Handle validation errors
  const handleValidationErrors = (errors: Record<string, string[]>) => {
    const messages = Object.entries(errors)
      .map(([field, fieldErrors]) => `${field}: ${fieldErrors.join(', ')}`)
      .join('\n')

    error('Erreurs de validation', messages)
  }

  // Notifications store methods
  const fetchNotifications = notificationsStore.fetchNotifications
  const markAsRead = notificationsStore.markAsRead
  const markAllAsRead = notificationsStore.markAllAsRead

  return {
    // Toast notifications
    show,
    success,
    error,
    warning,
    info,
    clear,
    clearAll,
    handleApiError,
    handleValidationErrors,
    
    // User notifications state
    notifications,
    unreadCount,
    loading,
    
    // User notifications methods
    fetchNotifications,
    markAsRead,
    markAllAsRead
  }
}
