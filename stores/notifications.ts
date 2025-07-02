import { defineStore } from 'pinia'
import type { Notification, PaginatedResponse, ApiResponse } from '~/types'

interface NotificationsState {
  notifications: Notification[]
  loading: boolean
  error: string | null
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  filters: {
    type?: 'OPINION_LIKE' | 'OPINION_COMMENT' | 'COMMENT_REPLY' | 'REPORT_STATUS' | 'MESSAGE_RECEIVED' | 'SYSTEM_ANNOUNCEMENT'
    read?: boolean
    userId?: string
  }
  unreadCount: number
}

export const useNotificationsStore = defineStore('notifications', {
  state: (): NotificationsState => ({
    notifications: [],
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
    getNotificationById: (state) => (id: string): Notification | undefined => {
      return state.notifications.find(n => n.id === id)
    },

    unreadNotifications: (state) => {
      return state.notifications.filter(n => n.status === 'UNREAD')
    },

    filteredNotifications: (state) => {
      let filtered = [...state.notifications]

      if (state.filters.type) {
        filtered = filtered.filter(n => n.type === state.filters.type)
      }

      if (state.filters.read !== undefined) {
        filtered = filtered.filter(n => n.status === (state.filters.read ? 'READ' : 'UNREAD'))
      }

      if (state.filters.userId) {
        filtered = filtered.filter(n => n.userId === state.filters.userId)
      }

      return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    },

    notificationsByType: (state) => {
      return state.notifications.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }
  },

  actions: {
    async fetchNotifications(page = 1, limit = 20, refresh = false) {
      if (this.loading && !refresh) return

      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...Object.fromEntries(
            Object.entries(this.filters).filter(([_, value]) => value !== undefined && value !== '')
          )
        })

        const response = await $api<PaginatedResponse<Notification>>(`/notifications?${params}`)

        if (page === 1 || refresh) {
          this.notifications = response.data
        } else {
          this.notifications.push(...response.data)
        }

        this.pagination = {
          page: response.page,
          limit: response.limit,
          total: response.total,
          totalPages: response.totalPages
        }

        this.updateUnreadCount()
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du chargement des notifications'
        console.error('Error fetching notifications:', error)
      } finally {
        this.loading = false
      }
    },

    async markAsRead(notificationId: string) {
      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<Notification>>(`/notifications/${notificationId}/read`, {
          method: 'PATCH'
        })

        const updatedNotification = response.data
        
        // Update in notifications list
        const index = this.notifications.findIndex(n => n.id === notificationId)
        if (index !== -1) {
          this.notifications[index] = updatedNotification
        }

        this.updateUnreadCount()

        return updatedNotification
      } catch (error: any) {
        console.error('Error marking notification as read:', error)
        throw error
      }
    },

    async markAllAsRead() {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api('/notifications/mark-all-read', {
          method: 'PATCH'
        })

        // Update all notifications as read
        this.notifications.forEach(notification => {
          notification.status = 'READ'
          notification.readAt = new Date().toISOString()
        })

        this.unreadCount = 0

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Notifications marquées comme lues',
          message: 'Toutes les notifications ont été marquées comme lues'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors du marquage des notifications'
        console.error('Error marking all notifications as read:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteNotification(notificationId: string) {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api(`/notifications/${notificationId}`, { method: 'DELETE' })

        // Remove from notifications list
        this.notifications = this.notifications.filter(n => n.id !== notificationId)
        this.pagination.total--

        this.updateUnreadCount()

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Notification supprimée',
          message: 'La notification a été supprimée avec succès'
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression de la notification'
        console.error('Error deleting notification:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteAllRead() {
      this.loading = true
      this.error = null

      try {
        const { $api } = useNuxtApp()
        await $api('/notifications/delete-read', { method: 'DELETE' })

        // Remove read notifications from the list
        const beforeCount = this.notifications.length
        this.notifications = this.notifications.filter(n => n.status === 'UNREAD')
        const deletedCount = beforeCount - this.notifications.length

        this.pagination.total -= deletedCount

        // Show success notification
        const appStore = useAppStore()
        appStore.addNotification({
          type: 'success',
          title: 'Notifications supprimées',
          message: `${deletedCount} notification(s) lue(s) supprimée(s)`
        })
      } catch (error: any) {
        this.error = error.message || 'Erreur lors de la suppression des notifications'
        console.error('Error deleting read notifications:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUnreadCount() {
      try {
        const { $api } = useNuxtApp()
        const response = await $api<ApiResponse<{ count: number }>>('/notifications/unread/count')
        this.unreadCount = response.data.count
      } catch (error: any) {
        console.error('Error fetching unread count:', error)
      }
    },

    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(n => n.status === 'UNREAD').length
    },

    addRealtimeNotification(notification: Notification) {
      this.notifications.unshift(notification)
      this.pagination.total++
      this.updateUnreadCount()

      // Show toast notification
      const appStore = useAppStore()
      appStore.addNotification({
        type: 'info',
        title: 'Nouvelle notification',
        message: notification.title
      })
    },

    setFilters(filters: Partial<NotificationsState['filters']>) {
      this.filters = { ...this.filters, ...filters }
    },

    clearFilters() {
      this.filters = {}
    },

    clearError() {
      this.error = null
    },

    reset() {
      this.notifications = []
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
    }
  }
})

// Auto-import for Nuxt
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNotificationsStore, import.meta.hot))
}
