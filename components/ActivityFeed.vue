<template>
  <div class="space-y-4">
    <div v-if="activities.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-clock" class="size-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">
        Aucune activité récente
      </p>
    </div>

    <div v-else class="space-y-3">
      <div 
        v-for="activity in activities" 
        :key="activity.id"
        class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
      >
        <!-- Activity Icon -->
        <div :class="[
          'flex-shrink-0 p-2 rounded-full',
          getActivityIconBackground(activity.type)
        ]">
          <UIcon 
            :name="getActivityIcon(activity.type)" 
            :class="[
              'size-4',
              getActivityIconColor(activity.type)
            ]"
          />
        </div>

        <!-- Activity Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-gray-900 dark:text-white">
              {{ activity.title }}
            </p>
            <time class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRelativeTime(activity.createdAt) }}
            </time>
          </div>
          
          <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {{ activity.description }}
          </p>

          <!-- Activity metadata -->
          <div v-if="activity.metadata" class="flex items-center space-x-4 mt-2">
            <UBadge 
              v-if="activity.metadata.status"
              :label="activity.metadata.status"
              size="xs"
              :color="getStatusColor(activity.metadata.status)"
            />
            
            <NuxtLink 
              v-if="activity.metadata.link"
              :to="activity.metadata.link"
              class="text-xs text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200"
            >
              Voir plus →
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  activities: {
    type: Array,
    default: () => []
  }
})

const getActivityIcon = (type) => {
  const iconMap = {
    'opinion_created': 'i-heroicons-chat-bubble-left-ellipsis',
    'opinion_liked': 'i-heroicons-heart',
    'report_created': 'i-heroicons-exclamation-triangle',
    'report_updated': 'i-heroicons-arrow-path',
    'report_resolved': 'i-heroicons-check-circle',
    'message_received': 'i-heroicons-envelope',
    'comment_added': 'i-heroicons-chat-bubble-left',
    'profile_updated': 'i-heroicons-user',
    'default': 'i-heroicons-bell'
  }
  
  return iconMap[type] || iconMap.default
}

const getActivityIconBackground = (type) => {
  const backgroundMap = {
    'opinion_created': 'bg-blue-100 dark:bg-blue-900/50',
    'opinion_liked': 'bg-red-100 dark:bg-red-900/50',
    'report_created': 'bg-orange-100 dark:bg-orange-900/50',
    'report_updated': 'bg-yellow-100 dark:bg-yellow-900/50',
    'report_resolved': 'bg-green-100 dark:bg-green-900/50',
    'message_received': 'bg-purple-100 dark:bg-purple-900/50',
    'comment_added': 'bg-indigo-100 dark:bg-indigo-900/50',
    'profile_updated': 'bg-gray-100 dark:bg-gray-900/50',
    'default': 'bg-gray-100 dark:bg-gray-900/50'
  }
  
  return backgroundMap[type] || backgroundMap.default
}

const getActivityIconColor = (type) => {
  const colorMap = {
    'opinion_created': 'text-blue-600 dark:text-blue-400',
    'opinion_liked': 'text-red-600 dark:text-red-400',
    'report_created': 'text-orange-600 dark:text-orange-400',
    'report_updated': 'text-yellow-600 dark:text-yellow-400',
    'report_resolved': 'text-green-600 dark:text-green-400',
    'message_received': 'text-purple-600 dark:text-purple-400',
    'comment_added': 'text-indigo-600 dark:text-indigo-400',
    'profile_updated': 'text-gray-600 dark:text-gray-400',
    'default': 'text-gray-600 dark:text-gray-400'
  }
  
  return colorMap[type] || colorMap.default
}

const getStatusColor = (status) => {
  const statusColors = {
    'PENDING': 'orange',
    'IN_PROGRESS': 'blue',
    'RESOLVED': 'green',
    'REJECTED': 'red',
    'ACTIVE': 'green',
    'INACTIVE': 'gray'
  }
  
  return statusColors[status] || 'gray'
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
</script>
