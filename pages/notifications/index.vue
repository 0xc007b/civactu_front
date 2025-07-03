<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Restez informé de toute l'activité qui vous concerne
        </p>
      </div>
      
      <div class="flex space-x-2">
        <UButton
          variant="outline"
          @click="markAllAsRead"
          :disabled="unreadCount === 0"
          icon="i-heroicons-check-circle"
        >
          Tout marquer comme lu
        </UButton>
        
        <UDropdown :items="filterMenuItems">
          <UButton variant="outline" icon="i-heroicons-funnel">
            Filtrer
          </UButton>
        </UDropdown>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Total"
        :value="totalNotifications"
        icon="i-heroicons-bell"
        color="blue"
      />
      <StatsCard
        title="Non lues"
        :value="unreadCount"
        icon="i-heroicons-exclamation-circle"
        color="orange"
      />
      <StatsCard
        title="Aujourd'hui"
        :value="todayCount"
        icon="i-heroicons-calendar-days"
        color="green"
      />
    </div>

    <!-- Filters -->
    <UCard v-if="hasActiveFilters">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filtres actifs:
          </span>
          <UBadge
            v-if="selectedStatus"
            :label="`Statut: ${getStatusLabel(selectedStatus)}`"
            color="blue"
            @close="selectedStatus = null"
          />
          <UBadge
            v-if="selectedType"
            :label="`Type: ${getTypeLabel(selectedType)}`"
            color="green"
            @close="selectedType = null"
          />
        </div>
        
        <UButton variant="ghost" size="sm" @click="clearFilters">
          Réinitialiser
        </UButton>
      </div>
    </UCard>

    <!-- Notifications by Date -->
    <div class="space-y-6">
      <div
        v-for="group in groupedNotifications"
        :key="group.date"
      >
        <div class="flex items-center space-x-4 mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ group.dateLabel }}
          </h2>
          <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
          <UBadge
            v-if="group.unreadCount > 0"
            :label="`${group.unreadCount} non lues`"
            color="orange"
            size="xs"
          />
        </div>

        <div class="space-y-3">
          <UCard
            v-for="notification in group.notifications"
            :key="notification.id"
            :class="[
              'transition-all cursor-pointer',
              notification.status === 'UNREAD' 
                ? 'ring-2 ring-blue-200 dark:ring-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                : 'hover:shadow-md'
            ]"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex items-start space-x-4">
              <!-- Notification Icon -->
              <div :class="[
                'flex-shrink-0 p-3 rounded-full',
                getNotificationIconBackground(notification.type)
              ]">
                <UIcon 
                  :name="getNotificationIcon(notification.type)" 
                  :class="[
                    'size-5',
                    getNotificationIconColor(notification.type)
                  ]"
                />
              </div>

              <!-- Notification Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 :class="[
                      'text-lg font-medium mb-2',
                      notification.status === 'UNREAD' 
                        ? 'text-gray-900 dark:text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    ]">
                      {{ notification.title }}
                    </h3>
                    
                    <p class="text-gray-600 dark:text-gray-400 mb-3">
                      {{ notification.content }}
                    </p>
                    
                    <div class="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div class="flex items-center space-x-1">
                        <UIcon name="i-heroicons-clock" class="size-4" />
                        <span>{{ formatTime(notification.createdAt) }}</span>
                      </div>
                      
                      <UBadge
                        :label="getTypeLabel(notification.type)"
                        size="xs"
                        :color="getTypeColor(notification.type)"
                      />
                    </div>
                  </div>
                  
                  <!-- Actions -->
                  <div class="flex-shrink-0 flex items-center space-x-2">
                    <UButton
                      v-if="notification.status === 'UNREAD'"
                      variant="ghost"
                      size="xs"
                      @click.stop="markAsRead(notification.id)"
                      icon="i-heroicons-check"
                    >
                      Marquer comme lu
                    </UButton>
                    
                    <UDropdown 
                      :items="getNotificationActions(notification)"
                      :popper="{ placement: 'bottom-end' }"
                    >
                      <UButton variant="ghost" size="xs" square>
                        <UIcon name="i-heroicons-ellipsis-vertical" class="size-4" />
                      </UButton>
                    </UDropdown>
                  </div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="notifications.length === 0" class="text-center py-12">
      <UIcon name="i-heroicons-bell-slash" class="size-16 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
        Aucune notification
      </h3>
      <p class="text-gray-500 dark:text-gray-400">
        Vous n'avez aucune notification pour le moment.
      </p>
    </div>

    <!-- Load More -->
    <div v-if="hasMore" class="text-center">
      <UButton
        variant="outline"
        @click="loadMore"
        :loading="loadingMore"
      >
        Charger plus
      </UButton>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'verified'],
  layout: 'dashboard'
})

const { notifications: notificationsComposable, markAsRead: markNotificationAsRead, markAllAsRead: markAllNotificationsAsRead } = useNotifications()
const { get, del } = useApi()
const toast = useToast()

// Head configuration
useHead({
  title: 'Notifications - CivActu'
})

// State
const selectedStatus = ref(null)
const selectedType = ref(null)
const loadingMore = ref(false)
const page = ref(1)
const limit = 20

// Data fetching
const { data: notificationsData, pending, refresh } = await useLazyAsyncData(
  'all-notifications',
  () => get('/api/v1/notifications', {
    page: page.value,
    limit,
    status: selectedStatus.value || undefined,
    type: selectedType.value || undefined
  }),
  {
    default: () => ({
      data: [],
      meta: {
        pagination: {
          total: 0,
          hasMore: false
        },
        stats: {
          unread: 0,
          today: 0
        }
      }
    })
  }
)

// Computed
const notifications = computed(() => notificationsData.value?.data || [])
const hasMore = computed(() => notificationsData.value?.meta?.pagination?.hasMore || false)
const totalNotifications = computed(() => notificationsData.value?.meta?.pagination?.total || 0)
const unreadCount = computed(() => notificationsData.value?.meta?.stats?.unread || 0)
const todayCount = computed(() => notificationsData.value?.meta?.stats?.today || 0)

const hasActiveFilters = computed(() => selectedStatus.value || selectedType.value)

const groupedNotifications = computed(() => {
  const groups = {}
  
  notifications.value.forEach(notification => {
    const date = new Date(notification.createdAt)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    let dateKey
    let dateLabel
    
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'today'
      dateLabel = 'Aujourd\'hui'
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'yesterday'
      dateLabel = 'Hier'
    } else {
      dateKey = date.toDateString()
      dateLabel = date.toLocaleDateString('fr-FR', { 
        weekday: 'long',
        day: 'numeric', 
        month: 'long' 
      })
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = {
        date: dateKey,
        dateLabel,
        notifications: [],
        unreadCount: 0
      }
    }
    
    groups[dateKey].notifications.push(notification)
    if (notification.status === 'UNREAD') {
      groups[dateKey].unreadCount++
    }
  })
  
  // Sort groups by date (most recent first)
  return Object.values(groups).sort((a, b) => {
    if (a.date === 'today') return -1
    if (b.date === 'today') return 1
    if (a.date === 'yesterday') return -1
    if (b.date === 'yesterday') return 1
    return new Date(b.date) - new Date(a.date)
  })
})

// Filter menu items
const filterMenuItems = [
  [{
    label: 'Par statut',
    disabled: true
  }, {
    label: 'Toutes',
    click: () => selectedStatus.value = null
  }, {
    label: 'Non lues',
    click: () => selectedStatus.value = 'UNREAD'
  }, {
    label: 'Lues',
    click: () => selectedStatus.value = 'READ'
  }], [{
    label: 'Par type',
    disabled: true
  }, {
    label: 'Tous les types',
    click: () => selectedType.value = null
  }, {
    label: 'Avis',
    click: () => selectedType.value = 'opinion'
  }, {
    label: 'Signalements',
    click: () => selectedType.value = 'report'
  }, {
    label: 'Messages',
    click: () => selectedType.value = 'message'
  }]
]

// Methods
const getNotificationIcon = (type) => {
  const iconMap = {
    'opinion_like': 'i-heroicons-heart',
    'opinion_comment': 'i-heroicons-chat-bubble-left',
    'report_update': 'i-heroicons-arrow-path',
    'report_assigned': 'i-heroicons-clipboard-document-list',
    'report_resolved': 'i-heroicons-check-circle',
    'message_received': 'i-heroicons-envelope',
    'system_announcement': 'i-heroicons-megaphone',
    'default': 'i-heroicons-bell'
  }
  
  return iconMap[type] || iconMap.default
}

const getNotificationIconBackground = (type) => {
  const backgroundMap = {
    'opinion_like': 'bg-red-100 dark:bg-red-900/50',
    'opinion_comment': 'bg-blue-100 dark:bg-blue-900/50',
    'report_update': 'bg-yellow-100 dark:bg-yellow-900/50',
    'report_assigned': 'bg-purple-100 dark:bg-purple-900/50',
    'report_resolved': 'bg-green-100 dark:bg-green-900/50',
    'message_received': 'bg-indigo-100 dark:bg-indigo-900/50',
    'system_announcement': 'bg-orange-100 dark:bg-orange-900/50',
    'default': 'bg-gray-100 dark:bg-gray-900/50'
  }
  
  return backgroundMap[type] || backgroundMap.default
}

const getNotificationIconColor = (type) => {
  const colorMap = {
    'opinion_like': 'text-red-600 dark:text-red-400',
    'opinion_comment': 'text-blue-600 dark:text-blue-400',
    'report_update': 'text-yellow-600 dark:text-yellow-400',
    'report_assigned': 'text-purple-600 dark:text-purple-400',
    'report_resolved': 'text-green-600 dark:text-green-400',
    'message_received': 'text-indigo-600 dark:text-indigo-400',
    'system_announcement': 'text-orange-600 dark:text-orange-400',
    'default': 'text-gray-600 dark:text-gray-400'
  }
  
  return colorMap[type] || colorMap.default
}

const getTypeLabel = (type) => {
  const labelMap = {
    'opinion_like': 'J\'aime sur avis',
    'opinion_comment': 'Commentaire d\'avis',
    'report_update': 'Mise à jour signalement',
    'report_assigned': 'Signalement assigné',
    'report_resolved': 'Signalement résolu',
    'message_received': 'Nouveau message',
    'system_announcement': 'Annonce système'
  }
  
  return labelMap[type] || 'Notification'
}

const getTypeColor = (type) => {
  const colorMap = {
    'opinion_like': 'red',
    'opinion_comment': 'blue',
    'report_update': 'yellow',
    'report_assigned': 'purple',
    'report_resolved': 'green',
    'message_received': 'indigo',
    'system_announcement': 'orange'
  }
  
  return colorMap[type] || 'gray'
}

const getStatusLabel = (status) => {
  return status === 'UNREAD' ? 'Non lues' : 'Lues'
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
}

const getNotificationActions = (notification) => {
  const actions = []
  
  if (notification.status === 'UNREAD') {
    actions.push({
      label: 'Marquer comme lu',
      icon: 'i-heroicons-check',
      click: () => markAsRead(notification.id)
    })
  }
  
  actions.push({
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: () => deleteNotification(notification.id)
  })
  
  return [actions]
}

const handleNotificationClick = (notification) => {
  // Mark as read if unread
  if (notification.status === 'UNREAD') {
    markAsRead(notification.id)
  }
  
  // Navigate to related content if available
  if (notification.link) {
    navigateTo(notification.link)
  }
}

const markAsRead = async (notificationId) => {
  try {
    await markNotificationAsRead(notificationId)
    
    // Update local state
    const notification = notifications.value.find(n => n.id === notificationId)
    if (notification) {
      notification.status = 'READ'
    }
    
    await refresh()
  } catch (error) {
    // Error handled by composable
  }
}

const markAllAsRead = async () => {
  try {
    await markAllNotificationsAsRead()
    await refresh()
    
    toast.add({
      title: 'Succès',
      description: 'Toutes les notifications ont été marquées comme lues',
      color: 'green'
    })
  } catch (error) {
    // Error handled by composable
  }
}

const deleteNotification = async (notificationId) => {
  try {
    await del(`/notifications/${notificationId}`)
    
    // Remove from local state
    notificationsData.value.data = notifications.value.filter(n => n.id !== notificationId)
    
    toast.add({
      title: 'Notification supprimée',
      description: 'La notification a été supprimée avec succès',
      color: 'green'
    })
  } catch (error) {
    // Error handled by useApi
  }
}

const clearFilters = () => {
  selectedStatus.value = null
  selectedType.value = null
  page.value = 1
  refresh()
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return
  
  loadingMore.value = true
  page.value += 1
  
  try {
    const newData = await get('/api/v1/notifications', {
      page: page.value,
      limit,
      status: selectedStatus.value || undefined,
      type: selectedType.value || undefined
    })
    
    // Append new notifications
    notificationsData.value.data.push(...newData.data)
    notificationsData.value.meta = newData.meta
  } catch (error) {
    page.value -= 1
  } finally {
    loadingMore.value = false
  }
}

// Watch for filter changes
watch([selectedStatus, selectedType], () => {
  page.value = 1
  refresh()
})
</script>
