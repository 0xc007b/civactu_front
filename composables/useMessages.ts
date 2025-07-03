import type { Message } from '~/types/message'
import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useMessages = () => {
  const { get, post, put, delete: del } = useApi()

  // Envoyer un message
  const sendMessage = async (messageData: any) => {
    try {
      const response = await post('/api/v1/messages', messageData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Obtenir les messages de l'utilisateur avec filtres
  const getUserMessages = async (params?: ApiQueryParams): Promise<PaginatedResponse<Message>> => {
    try {
      const response = await get('/api/v1/messages', params)
      return response as PaginatedResponse<Message>
    } catch (error) {
      throw error
    }
  }

  // Obtenir un message par son ID
  const getMessageById = async (id: string) => {
    try {
      const response = await get(`/messages/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Supprimer un message
  const deleteMessage = async (id: string) => {
    try {
      const response = await del(`/messages/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Marquer un message comme lu
  const markMessageAsRead = async (id: string) => {
    try {
      const response = await put(`/api/v1/messages/${id}/read`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Répondre à un message
  const replyToMessage = async (id: string, replyData: any) => {
    try {
      const response = await post(`/messages/${id}/reply`, replyData)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    sendMessage,
    getUserMessages,
    getMessageById,
    deleteMessage,
    markMessageAsRead,
    replyToMessage
  }
}
