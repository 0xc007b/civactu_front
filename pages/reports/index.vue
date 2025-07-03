<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          Signalements
        </h1>
        <p class="text-gray-600">
          Signalez les problèmes de votre commune et suivez leur résolution
        </p>
      </div>
      
      <UButton to="/reports/create" icon="i-heroicons-plus">
        Créer un signalement
      </UButton>
    </div>

    <!-- Filtres -->
    <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h2 class="text-lg font-medium text-blue-800">Filtres</h2>
      </div>
      
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <!-- Statut -->
          <div>
            <div class="flex items-center mb-2">
              <UIcon name="i-heroicons-tag" class="mr-2 text-blue-600 size-4" />
              <span class="text-sm font-medium text-gray-700">Statut</span>
            </div>
            <USelect
              v-model="filters.status"
              :options="statusOptions"
              placeholder="Tous les statuts"
              class="w-full"
              size="lg"
              color="blue"
            />
          </div>
          
          <!-- Catégorie -->
          <div>
            <div class="flex items-center mb-2">
              <UIcon name="i-heroicons-folder" class="mr-2 text-blue-600 size-4" />
              <span class="text-sm font-medium text-gray-700">Catégorie</span>
            </div>
            <USelect
              v-model="filters.category"
              :options="categoryOptions"
              placeholder="Toutes les catégories"
              class="w-full"
              size="lg"
              color="blue"
            />
          </div>
          
          <!-- Priorité -->
          <div>
            <div class="flex items-center mb-2">
              <UIcon name="i-heroicons-flag" class="mr-2 text-blue-600 size-4" />
              <span class="text-sm font-medium text-gray-700">Priorité</span>
            </div>
            <USelect
              v-model="filters.priority"
              :options="priorityOptions"
              placeholder="Toutes les priorités"
              class="w-full"
              size="lg"
              color="blue"
            />
          </div>
          
          <!-- Recherche -->
          <div>
            <div class="flex items-center mb-2">
              <UIcon name="i-heroicons-magnifying-glass" class="mr-2 text-blue-600 size-4" />
              <span class="text-sm font-medium text-gray-700">Recherche</span>
            </div>
            <div class="flex space-x-2">
              <UInput
                v-model="searchQuery"
                placeholder="Rechercher..."
                class="w-full"
                size="lg"
                color="blue"
                @keydown.enter="handleSearch"
              />
              <UButton 
                @click="handleSearch" 
                variant="solid" 
                color="blue"
                size="lg"
                icon="i-heroicons-magnifying-glass"
              />
            </div>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end mt-6">
          <UButton
            variant="ghost"
            color="gray"
            @click="resetFilters"
            :disabled="!hasActiveFilters"
            class="mr-2"
          >
            Réinitialiser les filtres
          </UButton>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
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

    <!-- Liens rapides -->
    <div class="flex flex-wrap gap-4 mt-2">
      <UButton
        variant="soft"
        color="blue"
        to="/reports/my"
        icon="i-heroicons-user"
        class="shadow-sm"
      >
        Mes signalements
      </UButton>
      
      <UButton
        v-if="isOfficial"
        variant="soft"
        color="blue"
        to="/reports/assigned"
        icon="i-heroicons-clipboard-document-list"
        class="shadow-sm"
      >
        Signalements assignés
      </UButton>
    </div>

    <!-- Liste des signalements -->
    <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h2 class="text-lg font-medium text-blue-800">Liste des signalements</h2>
      </div>
      
      <div class="p-4">
        <ReportList
          :reports="reports"
          :loading="pending"
          :show-quick-actions="isOfficial"
          @update-status="handleStatusUpdate"
        />
      </div>
    </div>

    <!-- Charger plus -->
    <div v-if="hasMore" class="text-center mt-6">
      <UButton
        variant="outline"
        color="blue"
        @click="loadMore"
        :loading="loadingMore"
        class="px-6"
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
