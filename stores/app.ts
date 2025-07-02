import { defineStore } from 'pinia'

export interface AppState {
  isLoading: boolean
  isSidebarOpen: boolean
  isDarkMode: boolean
  currentPage: string
  theme: 'light' | 'dark' | 'system'
  breadcrumbs: Array<{ label: string; to?: string }>
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
    timeout?: number
  }>
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    isLoading: false,
    isSidebarOpen: false,
    isDarkMode: false,
    currentPage: '',
    theme: 'system',
    breadcrumbs: [],
    notifications: []
  }),

  getters: {
    hasNotifications: (state) => state.notifications.length > 0,
    unreadNotificationsCount: (state) => state.notifications.length
  },

  actions: {
    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen
    },

    setSidebar(open: boolean) {
      this.isSidebarOpen = open
    },

    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      // Persistance dans localStorage
      if (process.client) {
        localStorage.setItem('darkMode', this.isDarkMode.toString())
      }
    },

    setDarkMode(dark: boolean) {
      this.isDarkMode = dark
      if (process.client) {
        localStorage.setItem('darkMode', dark.toString())
      }
    },

    setCurrentPage(page: string) {
      this.currentPage = page
    },

    setBreadcrumbs(breadcrumbs: Array<{ label: string; to?: string }>) {
      this.breadcrumbs = breadcrumbs
    },

    addNotification(notification: {
      type: 'success' | 'error' | 'warning' | 'info'
      title: string
      message: string
      timeout?: number
    }) {
      const id = Date.now().toString()
      this.notifications.push({ id, ...notification })

      // Auto-remove après timeout
      if (notification.timeout !== 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, notification.timeout || 5000)
      }

      return id
    },

    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id)
      if (index > -1) {
        this.notifications.splice(index, 1)
      }
    },

    clearNotifications() {
      this.notifications = []
    },

    showSuccess(title: string, message: string, timeout?: number) {
      return this.addNotification({ type: 'success', title, message, timeout })
    },

    showError(title: string, message: string, timeout?: number) {
      return this.addNotification({ type: 'error', title, message, timeout })
    },

    showWarning(title: string, message: string, timeout?: number) {
      return this.addNotification({ type: 'warning', title, message, timeout })
    },

    showInfo(title: string, message: string, timeout?: number) {
      return this.addNotification({ type: 'info', title, message, timeout })
    },

    setTheme(themeName: 'light' | 'dark' | 'system') {
      this.theme = themeName
      if (process.client) {
        localStorage.setItem('theme', themeName)
      }
    },

    async initializeApp() {
      // Initialiser le mode sombre depuis localStorage
      if (process.client) {
        const savedDarkMode = localStorage.getItem('darkMode')
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
        
        if (savedTheme) {
          this.theme = savedTheme
        }
        
        if (savedDarkMode !== null) {
          this.isDarkMode = savedDarkMode === 'true'
        } else {
          // Détecter la préférence système
          this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
        }
      }
    }
  }
})
