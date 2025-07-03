<template>
  <div class="space-y-4">
    <div v-if="reports.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-clipboard-document-list" class="size-12 text-gray-400 mx-auto mb-4" />
      <p class="text-gray-500 dark:text-gray-400">
        {{ emptyMessage }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <UCard 
        v-for="report in reports" 
        :key="report.id"
        class="hover:shadow-md transition-shadow cursor-pointer"
        @click="navigateTo(`/reports/${report.id}`)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <!-- Report Header -->
            <div class="flex items-center space-x-3 mb-3">
              <UBadge 
                :label="report.category" 
                size="xs"
                :color="getCategoryColor(report.category)"
              />
              <UBadge 
                :label="getStatusLabel(report.status)" 
                size="xs"
                :color="getStatusColor(report.status)"
              />
              <UBadge 
                v-if="report.priority > 2"
                :label="`Priorité ${report.priority}`" 
                size="xs"
                color="red"
              />
            </div>

            <!-- Report Title & Description -->
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ report.title }}
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-3">
              {{ report.description }}
            </p>

            <!-- Report Metadata -->
            <div class="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-user" class="size-3" />
                <span>{{ report.isAnonymous ? 'Anonyme' : getReporterName(report.reporter) }}</span>
              </div>
              
              <div v-if="report.address" class="flex items-center space-x-1">
                <UIcon name="i-heroicons-map-pin" class="size-3" />
                <span>{{ truncateAddress(report.address) }}</span>
              </div>
              
              <div class="flex items-center space-x-1">
                <UIcon name="i-heroicons-clock" class="size-3" />
                <span>{{ formatRelativeTime(report.createdAt) }}</span>
              </div>
            </div>

            <!-- Assignment info -->
            <div v-if="showAssignment && report.assignedTo" class="mt-3 flex items-center space-x-2">
              <UIcon name="i-heroicons-user-circle" class="size-4 text-blue-500" />
              <span class="text-sm text-blue-600 dark:text-blue-400">
                Assigné à {{ getReporterName(report.assignedTo) }}
              </span>
            </div>
          </div>

          <!-- Report Images -->
          <div v-if="report.images && report.images.length > 0" class="flex-shrink-0 ml-4">
            <img 
              :src="report.images[0]" 
              :alt="report.title"
              class="w-16 h-16 object-cover rounded-lg"
            />
            <div 
              v-if="report.images.length > 1"
              class="text-xs text-center mt-1 text-gray-500"
            >
              +{{ report.images.length - 1 }}
            </div>
          </div>
        </div>

        <!-- Quick Actions (for officials) -->
        <template v-if="showQuickActions" #footer>
          <div class="flex space-x-2">
            <UButton
              size="xs"
              variant="outline"
              @click.stop="updateStatus(report.id, 'IN_PROGRESS')"
              :disabled="report.status === 'IN_PROGRESS'"
            >
              En cours
            </UButton>
            <UButton
              size="xs"
              variant="outline"
              color="green"
              @click.stop="updateStatus(report.id, 'RESOLVED')"
              :disabled="report.status === 'RESOLVED'"
            >
              Résolu
            </UButton>
            <UButton
              size="xs"
              variant="outline"
              color="red"
              @click.stop="updateStatus(report.id, 'REJECTED')"
              :disabled="report.status === 'REJECTED'"
            >
              Rejeter
            </UButton>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  reports: {
    type: Array,
    default: () => []
  },
  showAssignment: {
    type: Boolean,
    default: true
  },
  showQuickActions: {
    type: Boolean,
    default: true
  },
  emptyMessage: {
    type: String,
    default: 'Aucun signalement trouvé'
  }
})

const emit = defineEmits(['update-status'])

const getCategoryColor = (category) => {
  const colorMap = {
    'INFRASTRUCTURE': 'blue',
    'ENVIRONMENT': 'green',
    'SECURITY': 'red',
    'PUBLIC_SERVICE': 'purple',
    'TRANSPORTATION': 'orange',
    'HEALTH': 'pink',
    'EDUCATION': 'indigo',
    'OTHER': 'gray'
  }
  
  return colorMap[category] || 'gray'
}

const getStatusColor = (status) => {
  const colorMap = {
    'PENDING': 'orange',
    'IN_PROGRESS': 'blue',
    'RESOLVED': 'green',
    'REJECTED': 'red'
  }
  
  return colorMap[status] || 'gray'
}

const getStatusLabel = (status) => {
  const labelMap = {
    'PENDING': 'En attente',
    'IN_PROGRESS': 'En cours',
    'RESOLVED': 'Résolu',
    'REJECTED': 'Rejeté'
  }
  
  return labelMap[status] || status
}

const getReporterName = (user) => {
  if (!user) return 'Utilisateur inconnu'
  return `${user.firstName} ${user.lastName}`
}

const truncateAddress = (address) => {
  if (!address) return ''
  return address.length > 30 ? address.substring(0, 30) + '...' : address
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

const updateStatus = (reportId, status) => {
  emit('update-status', reportId, { status })
}
</script>
