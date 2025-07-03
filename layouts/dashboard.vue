<template>
  <div class="relative flex w-full flex-col md:flex-row">
    <!-- This allows screen readers to skip the sidebar and go directly to the main content. -->
    <a class="sr-only" href="#main-content">skip to the main content</a>
    
    <!-- dark overlay for when the sidebar is open on smaller screens -->
    <div 
      v-show="sidebarIsOpen" 
      class="fixed inset-0 z-20 bg-neutral-950/10 backdrop-blur-xs md:hidden" 
      aria-hidden="true" 
      @click="sidebarIsOpen = false"
    ></div>

    <!-- Sidebar Navigation -->
    <nav 
      class="fixed left-0 z-30 flex h-svh w-60 shrink-0 flex-col border-r border-blue-100 bg-blue-600 p-4 transition-transform duration-300 md:w-64 md:translate-x-0 md:relative" 
      :class="sidebarIsOpen ? 'translate-x-0' : '-translate-x-60'" 
      aria-label="sidebar navigation"
    >
      <!-- Logo -->
      <NuxtLink to="/dashboard" class="ml-2 w-fit text-2xl font-bold text-white hover:text-blue-100 transition-colors">
        <span class="sr-only">CivActu</span>
        <div class="text-2xl font-bold flex items-center gap-2">
          <div class="bg-white text-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold">C</div>
          CivActu
        </div>
      </NuxtLink>

      <!-- Search -->
      <div class="relative my-4 flex w-full max-w-xs flex-col gap-1">
        <UIcon 
          name="i-heroicons-magnifying-glass" 
          class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-blue-300" 
          aria-hidden="true"
        />
        <input
          v-model="searchQuery"
          type="search"
          class="w-full pl-10 pr-4 py-2 bg-blue-500 border border-blue-400 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
          placeholder="Rechercher..."
          @keydown.enter="handleSearch"
        />
      </div>

      <!-- Sidebar Links -->
      <div class="flex flex-col gap-2 overflow-y-auto pb-6">
        <SidebarLink
          to="/dashboard"
          icon="i-heroicons-chart-bar"
          label="Dashboard"
        />

        <SidebarLink
          to="/opinions"
          icon="i-heroicons-chat-bubble-left-ellipsis"
          label="Avis"
          :badge="userStats.opinions"
        />

        <SidebarLink
          to="/reports"
          icon="i-heroicons-exclamation-triangle"
          label="Signalements"
          :badge="userStats.reports"
        />

        <SidebarLink
          to="/messages"
          icon="i-heroicons-envelope"
          label="Messages"
          :badge="userStats.unreadMessages > 0 ? userStats.unreadMessages : undefined"
        />

        <SidebarLink
          to="/notifications"
          icon="i-heroicons-bell"
          label="Notifications"
          :badge="unreadCount > 0 ? unreadCount : undefined"
        />

        <SidebarLink
          to="/search"
          icon="i-heroicons-magnifying-glass"
          label="Recherche"
        />

        <!-- Admin/Official specific links -->
        <template v-if="isOfficial || isAdmin">
          <div class="border-t border-blue-400 my-3 pt-3">
            <div class="text-xs font-semibold text-blue-200 mb-2 px-3 uppercase tracking-wide">
              {{ isAdmin ? 'Administration' : 'Élu' }}
            </div>
            
            <SidebarLink
              v-if="isOfficial"
              to="/reports/assigned"
              icon="i-heroicons-clipboard-document-list"
              label="Signalements assignés"
            />

            <SidebarLink
              v-if="isAdmin"
              to="/admin/users"
              icon="i-heroicons-users"
              label="Utilisateurs"
            />

            <SidebarLink
              v-if="isAdmin"
              to="/admin/stats"
              icon="i-heroicons-chart-pie"
              label="Statistiques"
            />
          </div>
        </template>

        <!-- Profile & Settings -->
        <div class="border-t border-neutral-200 dark:border-neutral-700 my-2 pt-2">
          <SidebarLink
            to="/profile"
            icon="i-heroicons-user"
            label="Profil"
          />

          <SidebarLink
            to="/profile/edit"
            icon="i-heroicons-cog-6-tooth"
            label="Paramètres"
          />
        </div>
      </div>
    </nav>

    <!-- Top navbar & main content -->
    <div class="h-svh w-full overflow-y-auto bg-white">
      <!-- Top navbar -->
      <nav 
        class="sticky top-0 z-10 flex items-center justify-between border-b border-blue-100 bg-white px-4 py-3 shadow-sm" 
        aria-label="top navigation bar"
      >
        <!-- Sidebar toggle button for small screens -->
        <UButton
          variant="ghost"
          size="sm"
          class="md:hidden"
          @click="sidebarIsOpen = true"
        >
          <UIcon name="i-heroicons-bars-3" class="size-5" />
          <span class="sr-only">Toggle sidebar</span>
        </UButton>

        <!-- Breadcrumbs -->
        <nav 
          class="hidden md:inline-block text-sm font-medium text-neutral-600 dark:text-neutral-300" 
          aria-label="breadcrumb"
        >
          <ol class="flex flex-wrap items-center gap-1">
            <li v-for="(crumb, index) in breadcrumbs" :key="index" class="flex items-center gap-1">
              <NuxtLink 
                v-if="index < breadcrumbs.length - 1"
                :to="crumb.to" 
                class="hover:text-neutral-900 dark:hover:text-white"
              >
                {{ crumb.label }}
              </NuxtLink>
              <span v-else class="font-bold text-neutral-900 dark:text-white" aria-current="page">
                {{ crumb.label }}
              </span>
              <UIcon 
                v-if="index < breadcrumbs.length - 1"
                name="i-heroicons-chevron-right" 
                class="size-4" 
                aria-hidden="true"
              />
            </li>
          </ol>
        </nav>

        <!-- Profile Menu -->
        <UDropdown :items="profileMenuItems" :popper="{ placement: 'bottom-end' }">
          <UButton variant="ghost" class="flex items-center gap-2">
            <UAvatar 
              :src="user?.avatar" 
              :alt="userFullName"
              size="sm"
              :ui="{ rounded: 'rounded-sm' }"
            />
            <div class="hidden md:flex flex-col text-left">
              <span class="text-sm font-bold text-neutral-900 dark:text-white">
                {{ userFullName }}
              </span>
              <span class="text-xs text-neutral-600 dark:text-neutral-300">
                @{{ user?.email?.split('@')[0] }}
              </span>
            </div>
            <UIcon name="i-heroicons-chevron-down" class="size-4" />
          </UButton>
        </UDropdown>
      </nav>

      <!-- Main content -->
      <main id="main-content" class="p-4">
        <div class="overflow-y-auto">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
const { user, userFullName, isAdmin, isOfficial, logout } = useUsers()
const { notifications, unreadCount } = useNotifications()
const toast = useToast()
const route = useRoute()

// State
const sidebarIsOpen = ref(false)
const searchQuery = ref('')

// Stats from composable
const { data: userStats } = await useLazyAsyncData('user-stats', () => {
  const { get } = useApi()
  return get('/api/v1/stats/user')
}, {
  default: () => ({
    opinions: 0,
    reports: 0,
    messages: 0,
    unreadMessages: 0
  })
})

// Breadcrumbs computation
const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const crumbs = []
  
  segments.forEach((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/')
    let label = segment.charAt(0).toUpperCase() + segment.slice(1)
    
    // Custom labels for specific routes
    const labelMap = {
      'dashboard': 'Dashboard',
      'opinions': 'Avis',
      'reports': 'Signalements',
      'messages': 'Messages',
      'notifications': 'Notifications',
      'profile': 'Profil',
      'search': 'Recherche',
      'create': 'Créer',
      'edit': 'Modifier',
      'my': 'Mes',
      'assigned': 'Assignés'
    }
    
    if (labelMap[segment]) {
      label = labelMap[segment]
    }
    
    crumbs.push({
      label,
      to: path
    })
  })
  
  return crumbs
})

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    searchQuery.value = ''
  }
}

const handleLogout = async () => {
  try {
    await logout()
    toast.add({
      title: 'Déconnexion réussie',
      description: 'À bientôt !',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: 'Erreur',
      description: 'Impossible de se déconnecter',
      color: 'red'
    })
  }
}

// Profile menu items
const profileMenuItems = [
  [{
    label: 'Profil',
    icon: 'i-heroicons-user',
    to: '/profile'
  }, {
    label: 'Paramètres',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/profile/edit'
  }], [{
    label: 'Déconnexion',
    icon: 'i-heroicons-arrow-right-on-rectangle',
    click: handleLogout
  }]
]

// Close sidebar when route changes
watch(() => route.path, () => {
  sidebarIsOpen.value = false
})

// Close sidebar on escape key
onMounted(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      sidebarIsOpen.value = false
    }
  }
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>
