<template>
  <div class="space-y-6">
    <!-- En-tête du dashboard -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Bonjour {{ userFullName }} 👋
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Voici un aperçu de votre activité
        </p>
      </div>
      <UAvatar 
        :src="user?.avatar" 
        :alt="userFullName"
        size="lg"
      />
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard 
        title="Mes Avis" 
        :value="userStats.opinions || 0" 
        icon="i-heroicons-chat-bubble-left-ellipsis"
        color="blue"
        to="/opinions/my"
      />
      <StatsCard 
        title="Mes Signalements" 
        :value="userStats.reports || 0" 
        icon="i-heroicons-exclamation-triangle"
        color="orange"
        to="/reports/my"
      />
      <StatsCard 
        title="Messages" 
        :value="userStats.messages || 0" 
        icon="i-heroicons-envelope"
        color="green"
        :badge="userStats.unreadMessages > 0 ? userStats.unreadMessages : undefined"
        to="/messages"
      />
      <StatsCard 
        title="Notifications" 
        :value="unreadCount" 
        icon="i-heroicons-bell"
        color="purple"
        to="/notifications"
      />
    </div>

    <!-- Contenu principal -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activité récente -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Activité récente</h2>
              <UButton 
                variant="ghost" 
                size="sm"
                to="/dashboard/activity"
              >
                Voir tout
              </UButton>
            </div>
          </template>
          
          <ActivityFeed :activities="recentActivities" />
        </UCard>
      </div>
      
      <!-- Notifications -->
      <div>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">Notifications</h2>
              <UBadge v-if="unreadCount > 0" :label="unreadCount" />
            </div>
          </template>
          
          <NotificationList 
            :notifications="(notifications || []).slice(0, 5)" 
            @mark-as-read="markAsRead"
          />
          
          <template #footer v-if="(notifications || []).length > 5">
            <UButton 
              variant="ghost" 
              block 
              to="/notifications"
            >
              Voir toutes les notifications
            </UButton>
          </template>
        </UCard>
      </div>
    </div>

    <!-- Signalements assignés (pour les élus) -->
    <div v-if="isOfficial" class="space-y-4">
      <h2 class="text-2xl font-bold">Signalements assignés</h2>
      <ReportList 
        :reports="assignedReports" 
        :show-assignment="false"
        @update-status="handleReportUpdate"
      />
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'verified'],
  layout: 'dashboard'
})

const { user, userFullName, isOfficial } = useUsers()
const { notifications, unreadCount, markAsRead, fetchNotifications } = useNotifications()
const { get } = useApi()

// Head configuration
useHead({
  title: 'Dashboard - CivActu'
})

// Récupération des données du dashboard
const { data: dashboardData } = await useLazyAsyncData('dashboard', () =>
  get('/api/v1/stats/dashboard'), {
  default: () => ({
    userStats: {
      opinions: 0,
      reports: 0,
      messages: 0,
      unreadMessages: 0
    },
    recentActivities: [],
    assignedReports: []
  })
})

const userStats = computed(() => dashboardData.value?.userStats || {})
const recentActivities = computed(() => dashboardData.value?.recentActivities || [])
const assignedReports = computed(() => dashboardData.value?.assignedReports || [])

// Mise à jour des notifications en temps réel
onMounted(async () => {
  try {
    await fetchNotifications({ limit: 10, page: 0})
  } catch (error) {
    // Géré par le composable useApi
  }
})

const handleReportUpdate = async (reportId, update) => {
  try {
    await get(`/reports/${reportId}/update`, update)
    await refreshCookie('dashboard')
  } catch (error) {
    // Géré par le composable useApi
  }
}
</script>
