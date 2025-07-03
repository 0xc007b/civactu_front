import { defineStore } from 'pinia'
import type { Message, MessageCreateInput, MessageUpdateInput, MessageFilters } from '~/types/message'
import type { PaginatedResponse, ApiResponse } from '~/types/api'

interface MessagesState {
  messages: Message[]
  currentMessage: Message | null
  conversations: Record<string, Message[]>
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: MessageFilters
  unreadCount: number
}

export const useMessagesStore = defineStore('messages', {
  state: (): MessagesState => ({
    messages: [],
    currentMessage: null,
    conversations: {},
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      totalPages: 0
    },
    filters: {},
    unreadCount: 0
  }),

  getters: {
    getMessageById: (state) => (id: string): Message | undefined => {
      return state.messages.find(m => m.id === id)
    },

    getConversation: (state) => (userId: string): Message[] => {
      return state.conversations[userId] || []
    },

    getConversationPreview: (state) => {
      const conversations: Record<string, { lastMessage: Message; unreadCount: number }> = {}
      
      state.messages.forEach(message => {
        const otherUserId = message.senderId === state.filters.recipientId ? message.recipientId : message.senderId
        
        if (!conversations[otherUserId] || 
            new Date(message.createdAt) > new Date(conversations[otherUserId].lastMessage.createdAt)) {
          conversations[otherUserId] = {
            lastMessage: message,
            unreadCount: state.conversations[otherUserId]?.filter(m => 
              m.status !== 'READ' && m.recipientId === state.filters.recipientId
            ).length || 0
          }
        }
      })
      
      return conversations
    },

    filteredMessages: (state) => {
      let filtered = [...state.messages]

      if (state.filters.senderId) {
        filtered = filtered.filter(m => m.senderId === state.filters.senderId)
      }

      if (state.filters.receiverId) {
        filtered = filtered.filter(m => m.recipientId === state.filters.recipientId)
      }

      if (state.filters.status) {
        filtered = filtered.filter(m => m.status === state.filters.status)
      }

      if (state.filters.search) {
        const search = state.filters.search.toLowerCase()
        filtered = filtered.filter(m => 
          m.content.toLowerCase().includes(search) ||
          m.subject?.toLowerCase().includes(search)
        )
      }

      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  },

  actions: {
    async fetchMessages(page = 1, limit = 20, refresh = false) {
      if (this.loading && !refresh) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        
        const response = await $api.get<PaginatedResponse<Message>>('/api/v1/messages', {
          page,
          limit,
          ...Object.fromEntries(
            Object.entries(this.filters).filter(([_, value]) => value !== undefined && value !== '')
          )
        })

        if (page === 1 || refresh) {
          this.messages = response.data
        } else {
          this.messages.push(...response.data)
        }

        this.pagination = response.meta.pagination

        // Update unread count
        this.updateUnreadCount()
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des messages'
        console.error('Error fetching messages:', error)
      } finally {
        this.loading = false
      }
    },

    async fetchConversation(userId: string, page = 1, limit = 50) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        
        const response = await $api.get<PaginatedResponse<Message>>(`/api/v1/messages/conversation/${userId}`, {
          page,
          limit
        })
        
        this.conversations[userId] = response.data.sort((a: Message, b: Message) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )

        return response.data
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement de la conversation'
        console.error('Error fetching conversation:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async sendMessage(messageData: MessageCreateInput) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        const response = await $api.post<ApiResponse<Message>>('/api/v1/messages', messageData)

        const newMessage = response.data
        this.messages.unshift(newMessage)

        // Add to conversation
        const otherUserId = newMessage.recipientId
        if (!this.conversations[otherUserId]) {
          this.conversations[otherUserId] = []
        }
        this.conversations[otherUserId].push(newMessage)

        this.pagination.total++

        return newMessage
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de l\'envoi du message'
        console.error('Error sending message:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async markAsRead(messageId: string) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.patch<ApiResponse<Message>>(`/api/v1/messages/${messageId}/read`, {})

        const updatedMessage = response.data
        
        // Update in messages list
        const index = this.messages.findIndex(m => m.id === messageId)
        if (index !== -1) {
          this.messages[index] = updatedMessage
        }

        // Update in conversation
        Object.keys(this.conversations).forEach(userId => {
          const msgIndex = this.conversations[userId].findIndex(m => m.id === messageId)
          if (msgIndex !== -1) {
            this.conversations[userId][msgIndex] = updatedMessage
          }
        })

        this.updateUnreadCount()

        return updatedMessage
      } catch (error: any) {
        console.error('Error marking message as read:', error)
        throw error
      }
    },

    async deleteMessage(messageId: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api.delete(`/messages/${messageId}`)

        // Remove from messages list
        this.messages = this.messages.filter(m => m.id !== messageId)
        
        // Remove from conversations
        Object.keys(this.conversations).forEach(userId => {
          this.conversations[userId] = this.conversations[userId].filter(m => m.id !== messageId)
        })

        this.pagination.total--

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Message supprimé',
          message: 'Le message a été supprimé avec succès'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression du message'
        console.error('Error deleting message:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const { $api } = useNuxtApp()
        const response = await $api.get<ApiResponse<{ count: number }>>('/api/v1/messages/unread/count')
        this.unreadCount = response.data.count
      } catch (error: any) {
        console.error('Error fetching unread count:', error)
      }
    },

    updateUnreadCount() {
      const authStore = useAuthStore()
      const currentUserId = authStore.user?.id
      
      if (currentUserId) {
        this.unreadCount = this.messages.filter(m => 
          m.recipientId === currentUserId && m.status !== 'READ'
        ).length
      }
    },

    setFilters(filters: Partial<MessagesState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {}
    },

    setCurrentMessage(message: Message | null) {
      this.currentMessage = message
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.messages = []
      this.currentMessage = null
      this.conversations = {}
      this.loading = false
      this.error = null
      this.pagination = {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0
      }
      this.filters = {}
      this.unreadCount = 0
    },

    // Method for real-time updates
    addMessageFromRealtime(message: Message) {
      this.messages.unshift(message)
      this.unreadCount++
    }
  }
})

// Auto-import for Nuxt
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMessagesStore, import.meta.hot))
}
