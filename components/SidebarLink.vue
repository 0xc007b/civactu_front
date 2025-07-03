<template>
  <NuxtLink
    :to="to"
    class="flex items-center rounded-lg gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
    :class="isActive ? 'bg-blue-500 text-white shadow-sm' : 'text-blue-100 hover:text-white'"
  >
    <UIcon :name="icon" class="size-5 shrink-0" aria-hidden="true" />
    <span>{{ label }}</span>
    <span 
      v-if="badge" 
      class="ml-auto bg-white text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full min-w-[20px] text-center"
    >
      {{ badge }}
    </span>
    <span v-if="isActive" class="sr-only">active</span>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  to: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  badge: {
    type: [String, Number],
    default: null
  }
})

const route = useRoute()

const isActive = computed(() => {
  // Exact match for dashboard
  if (props.to === '/dashboard') {
    return route.path === '/dashboard'
  }
  
  // Check if current route starts with the link's path
  return route.path.startsWith(props.to)
})
</script>
