<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Signalements
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Signalez les problèmes de votre commune et suivez leur résolution
        </p>
      </div>
      
      <UButton to="/reports/create" icon="i-heroicons-plus">
        Créer un signalement
      </UButton>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2">
          <USelect
            v-model="filters.status"
            :options="statusOptions"
            placeholder="Statut"
            class="w-40"
          />
          <USelect
            v-model="filters.category"
            :options="categoryOptions"
            placeholder="Catégorie"
            class="w-40"
          />
          <USelect
            v-model="filters.priority"
            :options="priorityOptions"
            placeholder="Priorité"
            class="w-32"
          />
          <UButton
            variant="outline"
            @click="resetFilters"
            :disabled="!hasActiveFilters"
          >
            Réinitialiser
          </UButton>
        </div>
        
        <div class="flex items-center space-x-2 ml-auto">
          <UInput
            v-model="searchQuery"
            placeholder="Rechercher..."
            icon="i-heroicons-magnifying-glass"
            @keydown.enter="handleSearch"
          />
          <UButton @click="handleSearch" variant="outline">
            Rechercher
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <StatsCard
        title="Total"
        :value="stats.total || 0"
        icon="i-heroicons-exclamation-triangle"
        color="blue"
      />
      <StatsCard
        title="En attente"
        :value="stats.pending || 0"
        icon="i-heroicons-clock"
        color="orange"
      />
      <StatsCard
        title="En cours"
        :value="stats.inProgress || 0"
        icon="i-heroicons-arrow-path"
        color="blue"
      />
      <StatsCard
        title="Résolus"
        :value="stats.resolved || 0"
        icon="i-heroicons-check-circle"
        color="green"
      />
    </div>

    <!-- Quick Links -->
    <div class="flex space-x-4">
      <UButton
        variant="outline"
        to="/reports/my"
        icon="i-heroicons-user"
      >
        Mes signalements
      </UButton>
      
      <UButton
        v-if="isOfficial"
        variant="outline"
        to="/reports/assigned"
        icon="i-heroicons-clipboard-document-list"
      >
        Signalements assignés
      </UButton>
    </div>

    <!-- Reports List -->
    <ReportList
      :reports="reports"
      :loading="pending"
      :show-quick-actions="isOfficial"
      @update-status="handleStatusUpdate"
    />

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

const { get, post } = useApi()
const { isOfficial } = useUsers()
const toast = useToast()

// Head configuration
useHead({
  title: 'Signalements - CivActu'
})

// State
const searchQuery = ref('')
const loadingMore = ref(false)
const page = ref(1)
const limit = 20

const filters = reactive({
  status: null,
  category: null,
  priority: null
})

// Options for filters
const statusOptions = [
  { label: 'Tous', value: null },
  { label: 'En attente', value: 'PENDING' },
  { label: 'En cours', value: 'IN_PROGRESS' },
  { label: 'Résolu', value: 'RESOLVED' },
  { label: 'Rejeté', value: 'REJECTED' }
]

const categoryOptions = [
  { label: 'Toutes', value: null },
  { label: 'Infrastructure', value: 'INFRASTRUCTURE' },
  { label: 'Environnement', value: 'ENVIRONMENT' },
  { label: 'Sécurité', value: 'SECURITY' },
  { label: 'Service Public', value: 'PUBLIC_SERVICE' },
  { label: 'Transport', value: 'TRANSPORTATION' },
  { label: 'Santé', value: 'HEALTH' },
  { label: 'Éducation', value: 'EDUCATION' },
  { label: 'Autre', value: 'OTHER' }
]

const priorityOptions = [
  { label: 'Toutes', value: null },
  { label: 'Faible', value: 1 },
  { label: 'Moyenne', value: 2 },
  { label: 'Élevée', value: 3 },
  { label: 'Critique', value: 4 }
]

// Computed
const hasActiveFilters = computed(() => {
  return filters.status || filters.category || filters.priority || searchQuery.value
})

const queryParams = computed(() => {
  const params = {
    page: page.value,
    limit,
    search: searchQuery.value || undefined,
    status: filters.status || undefined,
    category: filters.category || undefined,
    priority: filters.priority || undefined
  }
  
  // Remove undefined values
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  )
})

// Data fetching
const { data: reportsData, pending, refresh } = await useLazyAsyncData(
  'reports',
  () => get('/api/v1/reports', queryParams.value),
  {
    default: () => ({
      data: [],
      meta: {
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          hasMore: false
        }
      }
    }),
    watch: [queryParams]
  }
)

const { data: stats } = await useLazyAsyncData(
  'reports-stats',
  () => get('/api/v1/reports/stats'),
  {
    default: () => ({
      total: 0,
      pending: 0,
      inProgress: 0,
      resolved: 0
    })
  }
)

// Computed properties from data
const reports = computed(() => reportsData.value?.data || [])
const hasMore = computed(() => reportsData.value?.meta?.pagination?.hasMore || false)

// Methods
const handleSearch = () => {
  page.value = 1
  refresh()
}

const resetFilters = () => {
  filters.status = null
  filters.category = null
  filters.priority = null
  searchQuery.value = ''
  page.value = 1
  refresh()
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return
  
  loadingMore.value = true
  page.value += 1
  
  try {
    const newData = await get('/api/v1/reports', queryParams.value)
    
    // Append new reports to existing ones
    reportsData.value.data.push(...newData.data)
    reportsData.value.meta = newData.meta
  } catch (error) {
    // Error handled by useApi
    page.value -= 1 // Revert page increment on error
  } finally {
    loadingMore.value = false
  }
}

const handleStatusUpdate = async (reportId, updateData) => {
  try {
    await post(`/reports/${reportId}/update`, updateData)
    
    // Update the report in the list
    const report = reports.value.find(r => r.id === reportId)
    if (report) {
      report.status = updateData.status
      report.updatedAt = new Date().toISOString()
    }
    
    toast.add({
      title: 'Signalement mis à jour',
      description: 'Le statut du signalement a été modifié avec succès',
      color: 'green'
    })
    
    // Refresh stats
    await refreshCookie('reports-stats')
  } catch (error) {
    // Error handled by useApi
  }
}

// Watch for filter changes
watch([filters], () => {
  page.value = 1
  refresh()
}, { deep: true })
</script>
