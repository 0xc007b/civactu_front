<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Avis et Opinions
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Partagez votre point de vue sur les sujets qui vous concernent
        </p>
      </div>
      
      <UButton to="/opinions/create" icon="i-heroicons-plus">
        Créer un avis
      </UButton>
    </div>

    <!-- Filters -->
    <UCard>
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2">
          <USelect
            v-model="filters.type"
            :options="typeOptions"
            placeholder="Type d'avis"
            class="w-40"
          />
          <USelect
            v-model="filters.municipality"
            :options="municipalityOptions"
            placeholder="Commune"
            class="w-40"
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
        title="Total des avis"
        :value="stats.total || 0"
        icon="i-heroicons-chat-bubble-left-ellipsis"
        color="blue"
      />
      <StatsCard
        title="Soutiens"
        :value="stats.support || 0"
        icon="i-heroicons-hand-thumb-up"
        color="green"
      />
      <StatsCard
        title="Oppositions"
        :value="stats.oppose || 0"
        icon="i-heroicons-hand-thumb-down"
        color="red"
      />
      <StatsCard
        title="Suggestions"
        :value="stats.suggestions || 0"
        icon="i-heroicons-light-bulb"
        color="orange"
      />
    </div>

    <!-- Opinions List -->
    <OpinionList
      :opinions="opinions"
      :loading="pending"
      @like="handleLike"
      @unlike="handleUnlike"
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

const { get } = useApi()

// Head configuration
useHead({
  title: 'Avis et Opinions - CivActu'
})

// State
const searchQuery = ref('')
const loadingMore = ref(false)
const page = ref(1)
const limit = 20

const filters = reactive({
  type: null,
  municipality: null
})

// Options for filters
const typeOptions = [
  { label: 'Tous', value: null },
  { label: 'Soutien', value: 'SUPPORT' },
  { label: 'Opposition', value: 'OPPOSE' },
  { label: 'Neutre', value: 'NEUTRAL' },
  { label: 'Suggestion', value: 'SUGGESTION' }
]

const municipalityOptions = [
  { label: 'Toutes les communes', value: null },
  // Ces options seraient chargées dynamiquement depuis l'API
]

// Computed
const hasActiveFilters = computed(() => {
  return filters.type || filters.municipality || searchQuery.value
})

const queryParams = computed(() => {
  const params = {
    page: page.value,
    limit,
    search: searchQuery.value || undefined,
    type: filters.type || undefined,
    municipalityId: filters.municipality || undefined
  }
  
  // Remove undefined values
  return Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v !== undefined)
  )
})

// Data fetching
const { data: opinionsData, pending, refresh } = await useLazyAsyncData(
  'opinions',
  () => get('/api/v1/opinions', queryParams.value),
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
  'opinions-stats',
  () => get('/api/v1/opinions/stats'),
  {
    default: () => ({
      total: 0,
      support: 0,
      oppose: 0,
      suggestions: 0
    })
  }
)

// Computed properties from data
const opinions = computed(() => opinionsData.value?.data || [])
const hasMore = computed(() => opinionsData.value?.meta?.pagination?.hasMore || false)

// Methods
const handleSearch = () => {
  page.value = 1
  refresh()
}

const resetFilters = () => {
  filters.type = null
  filters.municipality = null
  searchQuery.value = ''
  page.value = 1
  refresh()
}

const loadMore = async () => {
  if (!hasMore.value || loadingMore.value) return
  
  loadingMore.value = true
  page.value += 1
  
  try {
    const newData = await get('/api/v1/opinions', queryParams.value)
    
    // Append new opinions to existing ones
    opinionsData.value.data.push(...newData.data)
    opinionsData.value.meta = newData.meta
  } catch (error) {
    // Error handled by useApi
    page.value -= 1 // Revert page increment on error
  } finally {
    loadingMore.value = false
  }
}

const handleLike = async (opinionId) => {
  try {
    await get(`/opinions/${opinionId}/like`, {}, { method: 'POST' })
    
    // Update the opinion in the list
    const opinion = opinions.value.find(o => o.id === opinionId)
    if (opinion) {
      opinion.likesCount += 1
      opinion.isLikedByUser = true
    }
  } catch (error) {
    // Error handled by useApi
  }
}

const handleUnlike = async (opinionId) => {
  try {
    await get(`/opinions/${opinionId}/like`, {}, { method: 'DELETE' })
    
    // Update the opinion in the list
    const opinion = opinions.value.find(o => o.id === opinionId)
    if (opinion) {
      opinion.likesCount -= 1
      opinion.isLikedByUser = false
    }
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
