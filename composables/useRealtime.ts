interface RealtimeOptions {
  autoConnect?: boolean
  reconnectAttempts?: number
  reconnectDelay?: number
  heartbeatInterval?: number
}

interface RealtimeMessage {
  type: string
  data: any
  timestamp: string
  userId?: string
}

type RealtimeEventHandler = (data: any) => void

export const useRealtime = (options: RealtimeOptions = {}) => {
  const {
    autoConnect = true,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
    heartbeatInterval: heartbeatDelay = 30000
  } = options

  const socket = ref<WebSocket | null>(null)
  const connected = ref(false)
  const connecting = ref(false)
  const error = ref<string | null>(null)
  const lastMessage = ref<RealtimeMessage | null>(null)
  const connectionAttempts = ref(0)

  const eventHandlers = new Map<string, Set<RealtimeEventHandler>>()
  const authStore = useAuthStore()
  const { $config } = useNuxtApp()

  // Get WebSocket URL from config
  const getWebSocketUrl = (): string => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const baseUrl = $config.public.apiBase || window.location.host
    return `${wsProtocol}//${baseUrl}/ws`
  }

  // Connect to WebSocket
  const connect = async () => {
    if (connecting.value || connected.value) return

    try {
      connecting.value = true
      error.value = null

      const wsUrl = getWebSocketUrl()
      const token = authStore.token

      // Add auth token to URL if available
      const url = token ? `${wsUrl}?token=${token}` : wsUrl
      
      socket.value = new WebSocket(url)

      socket.value.onopen = () => {
        connected.value = true
        connecting.value = false
        connectionAttempts.value = 0
        error.value = null
        
        console.log('WebSocket connected')
        emit('connected', {})
        
        // Start heartbeat
        startHeartbeat()
      }

      socket.value.onmessage = (event) => {
        try {
          const message: RealtimeMessage = JSON.parse(event.data)
          lastMessage.value = message
          
          // Handle special message types
          if (message.type === 'heartbeat') {
            return // Ignore heartbeat messages
          }
          
          // Emit to event handlers
          emit(message.type, message.data)
          
        } catch (err) {
          console.error('Error parsing WebSocket message:', err)
        }
      }

      socket.value.onclose = (event) => {
        connected.value = false
        connecting.value = false
        
        console.log('WebSocket disconnected:', event.code, event.reason)
        emit('disconnected', { code: event.code, reason: event.reason })
        
        stopHeartbeat()
        
        // Attempt to reconnect if not manually closed
        if (event.code !== 1000 && connectionAttempts.value < reconnectAttempts) {
          scheduleReconnect()
        }
      }

      socket.value.onerror = (event) => {
        error.value = 'Erreur de connexion WebSocket'
        console.error('WebSocket error:', event)
        emit('error', { error: error.value })
      }

    } catch (err: any) {
      error.value = err.message || 'Erreur lors de la connexion'
      connecting.value = false
      console.error('WebSocket connection error:', err)
    }
  }

  // Disconnect from WebSocket
  const disconnect = () => {
    if (socket.value) {
      socket.value.close(1000, 'Manual disconnect')
      socket.value = null
    }
    connected.value = false
    connecting.value = false
    stopHeartbeat()
  }

  // Send message
  const send = (type: string, data: any = {}) => {
    if (!connected.value || !socket.value) {
      console.warn('WebSocket not connected, cannot send message')
      return false
    }

    try {
      const message: RealtimeMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
        userId: authStore.user?.id
      }

      socket.value.send(JSON.stringify(message))
      return true
    } catch (err) {
      console.error('Error sending WebSocket message:', err)
      return false
    }
  }

  // Event handling
  const on = (eventType: string, handler: RealtimeEventHandler) => {
    if (!eventHandlers.has(eventType)) {
      eventHandlers.set(eventType, new Set())
    }
    eventHandlers.get(eventType)!.add(handler)
  }

  const off = (eventType: string, handler?: RealtimeEventHandler) => {
    if (!eventHandlers.has(eventType)) return

    if (handler) {
      eventHandlers.get(eventType)!.delete(handler)
    } else {
      eventHandlers.get(eventType)!.clear()
    }
  }

  const emit = (eventType: string, data: any) => {
    const handlers = eventHandlers.get(eventType)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data)
        } catch (err) {
          console.error(`Error in event handler for ${eventType}:`, err)
        }
      })
    }
  }

  // Heartbeat management
  let heartbeatInterval: NodeJS.Timeout | null = null

  const startHeartbeat = () => {
    stopHeartbeat()
    heartbeatInterval = setInterval(() => {
      if (connected.value) {
        send('heartbeat', { timestamp: Date.now() })
      }
    }, heartbeatDelay)
  }

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval)
      heartbeatInterval = null
    }
  }

  // Reconnection logic
  const scheduleReconnect = () => {
    connectionAttempts.value++
    
    const delay = reconnectDelay * Math.pow(2, connectionAttempts.value - 1) // Exponential backoff
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${connectionAttempts.value}/${reconnectAttempts})`)
    
    setTimeout(() => {
      if (!connected.value && connectionAttempts.value <= reconnectAttempts) {
        connect()
      }
    }, delay)
  }

  // Presence tracking
  const joinRoom = (roomId: string) => {
    send('join_room', { roomId })
  }

  const leaveRoom = (roomId: string) => {
    send('leave_room', { roomId })
  }

  const updatePresence = (status: 'online' | 'away' | 'busy' | 'offline') => {
    send('presence_update', { status })
  }

  // Typing indicators
  const startTyping = (targetType: 'opinion' | 'message', targetId: string) => {
    send('typing_start', { targetType, targetId })
  }

  const stopTyping = (targetType: 'opinion' | 'message', targetId: string) => {
    send('typing_stop', { targetType, targetId })
  }

  // Live updates for specific entities
  const subscribeToOpinion = (opinionId: string) => {
    send('subscribe_opinion', { opinionId })
  }

  const unsubscribeFromOpinion = (opinionId: string) => {
    send('unsubscribe_opinion', { opinionId })
  }

  const subscribeToLocation = (locationId: string) => {
    send('subscribe_location', { locationId })
  }

  const unsubscribeFromLocation = (locationId: string) => {
    send('unsubscribe_location', { locationId })
  }

  // Store integration helpers
  const setupStoreUpdates = () => {
    // Opinion updates
    on('opinion_updated', (data) => {
      const opinionsStore = useOpinionsStore()
      opinionsStore.updateOpinionFromRealtime(data.opinion)
    })

    on('opinion_liked', (data) => {
      const opinionsStore = useOpinionsStore()
      opinionsStore.updateOpinionLikes(data.opinionId, data.likesCount)
    })

    // Comment updates
    on('comment_added', (data) => {
      const opinionsStore = useOpinionsStore()
      opinionsStore.addCommentFromRealtime(data.comment)
    })

    // Message updates
    on('message_received', (data) => {
      const messagesStore = useMessagesStore()
      messagesStore.addMessageFromRealtime(data.message)
    })

    // Notification updates
    on('notification_received', (data) => {
      const notificationsStore = useNotificationsStore()
      notificationsStore.addRealtimeNotification(data.notification)
    })

    // User status updates
    on('user_status_changed', (data) => {
      const authStore = useAuthStore()
      if (data.userId === authStore.user?.id) {
        authStore.updateUserStatus(data.status)
      }
    })
  }

  // Auto-connect and setup
  onMounted(() => {
    if (autoConnect && authStore.isAuthenticated) {
      connect()
    }
    setupStoreUpdates()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    disconnect()
    eventHandlers.clear()
  })

  // Watch auth state
  watch(() => authStore.isAuthenticated, (isAuth) => {
    if (isAuth && autoConnect && !connected.value) {
      connect()
    } else if (!isAuth && connected.value) {
      disconnect()
    }
  })

  return {
    // State
    connected: readonly(connected),
    connecting: readonly(connecting),
    error: readonly(error),
    lastMessage: readonly(lastMessage),
    connectionAttempts: readonly(connectionAttempts),

    // Connection methods
    connect,
    disconnect,
    send,

    // Event handling
    on,
    off,
    emit,

    // Room management
    joinRoom,
    leaveRoom,
    updatePresence,

    // Typing indicators
    startTyping,
    stopTyping,

    // Subscriptions
    subscribeToOpinion,
    unsubscribeFromOpinion,
    subscribeToLocation,
    unsubscribeFromLocation
  }
}
