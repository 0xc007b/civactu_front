import type { Comment } from '~/types/comment'
import type { ApiQueryParams, PaginatedResponse } from '~/types/api'

export const useComments = () => {
  const { get, post, patch, delete: del } = useApi()

  // Créer un commentaire
  const createComment = async (commentData: any) => {
    try {
      const response = await post('/api/v1/comments', commentData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Obtenir les commentaires avec filtres
  const getComments = async (params?: ApiQueryParams): Promise<PaginatedResponse<Comment>> => {
    try {
      const response = await get('/api/v1/comments', params)
      return response as PaginatedResponse<Comment>
    } catch (error) {
      throw error
    }
  }

  // Obtenir un commentaire par son ID
  const getCommentById = async (id: string) => {
    try {
      const response = await get(`/api/v1/comments/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  // Mettre à jour un commentaire
  const updateComment = async (id: string, commentData: any) => {
    try {
      const response = await patch(`/api/v1/comments/${id}`, commentData)
      return response
    } catch (error) {
      throw error
    }
  }

  // Supprimer un commentaire
  const deleteComment = async (id: string) => {
    try {
      const response = await del(`/api/v1/comments/${id}`)
      return response
    } catch (error) {
      throw error
    }
  }

  return {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment
  }
}
