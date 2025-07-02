import type { Notification } from '~/types/notification'
import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useUserNotifications = () => {
  const { get, put, post } = useApi()

  // Obtenir les notifications de l'utilisateur avec filtres
  const getUserNotifications = async (params?: ApiQueryParams): Promise<PaginatedResponse<Notification>> => {
    try {
      const response = await get('/api/v1/notifications', params)
      return response as PaginatedResponse<Notification>
    } catch (error) {
      throw error
    }
  }

  // Marquer une notification comme lue
  const markNotificationAsRead = async (id: string) => {
    try {
      const response = await put(`/api/v1/notifications/${id}/read`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Marquer toutes les notifications comme lues
  const markAllNotificationsAsRead = async () => {
    try {
      const response = await put('/api/v1/notifications/read-all')
      return response
    } catch (error) {
      throw error
    }
  }

  // === FONCTIONS ADMIN ===

  // Envoyer une notification à un utilisateur spécifique (admin seulement)
  const sendNotificationToUser = async (notificationData: any) => {
    try {
      const response = await post('/api/v1/notifications/send/user', notificationData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Envoyer une notification à tous les utilisateurs (admin seulement)
  const sendNotificationToAll = async (notificationData: any) => {
    try {
      const response = await post('/api/v1/notifications/send/all', notificationData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Envoyer une notification aux utilisateurs d'une municipalité (admin seulement)
  const sendNotificationToMunicipality = async (notificationData: any) => {
    try {
      const response = await post('/api/v1/notifications/send/municipality', notificationData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Envoyer une notification aux utilisateurs avec un rôle spécifique (admin seulement)
  const sendNotificationToRole = async (notificationData: any) => {
    try {
      const response = await post('/api/v1/notifications/send/role', notificationData)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    sendNotificationToUser,
    sendNotificationToAll,
    sendNotificationToMunicipality,
    sendNotificationToRole
  }
}
