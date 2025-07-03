<template>
  <div class="space-y-3">
    <div v-if="notifications.length === 0" class="text-center py-6">
      <UIcon name="i-heroicons-bell-slash" class="size-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Aucune notification
      </p>
    </div>

    <div v-else class="space-y-2">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        :class="[
          'flex items-start space-x-3 p-3 rounded-lg transition-colors cursor-pointer',
          notification.status === 'UNREAD' 
            ? 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30' 
            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        ]"
        @click="handleNotificationClick(notification)"
      >
        <!-- Notification Icon -->
        <div :class="[
          'flex-shrink-0 p-2 rounded-full',
          getNotificationIconBackground(notification.type)
        ]">
          <UIcon 
            :name="getNotificationIcon(notification.type)" 
            :class="[
              'size-4',
              getNotificationIconColor(notification.type)
            ]"
          />
        </div>

        <!-- Notification Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <p :class="[
                'text-sm',
                notification.status === 'UNREAD' 
                  ? 'font-semibold text-gray-900 dark:text-white' 
                  : 'font-medium text-gray-700 dark:text-gray-300'
              ]">
                {{ notification.title }}
              </p>
              
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {{ notification.content }}
              </p>
              
              <time class="text-xs text-gray-500 dark:text-gray-400 mt-1 block">
                {{ formatRelativeTime(notification.createdAt) }}
              </time>
            </div>
            
            <!-- Unread indicator -->
            <div 
              v-if="notification.status === 'UNREAD'"
              class="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-1"
            ></div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex-shrink-0">
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
</template>

<script setup>
const props = defineProps({
  notifications: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['mark-as-read', 'mark-as-unread', 'delete'])

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

const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'À l\'instant'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}min`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}j`
  }
  
  return date.toLocaleDateString('fr-FR', { 
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
      click: () => emit('mark-as-read', notification.id)
    })
  } else {
    actions.push({
      label: 'Marquer comme non lu',
      icon: 'i-heroicons-minus-circle',
      click: () => emit('mark-as-unread', notification.id)
    })
  }
  
  actions.push({
    label: 'Supprimer',
    icon: 'i-heroicons-trash',
    click: () => emit('delete', notification.id)
  })
  
  return [actions]
}

const handleNotificationClick = (notification) => {
  // Marquer comme lu si non lu
  if (notification.status === 'UNREAD') {
    emit('mark-as-read', notification.id)
  }
  
  // Naviguer vers le lien associé si disponible
  if (notification.link) {
    navigateTo(notification.link)
  }
}
</script>
