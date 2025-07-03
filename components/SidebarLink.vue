<template>
  <NuxtLink
    :to="to"
    class="flex items-center rounded-sm gap-2 px-2 py-1.5 text-sm font-medium underline-offset-2 hover:bg-black/5 hover:text-neutral-900 focus-visible:underline focus:outline-hidden dark:hover:bg-white/5 dark:hover:text-white transition-colors"
    :class="isActive ? 'bg-black/10 text-neutral-900 dark:bg-white/10 dark:text-white' : 'text-neutral-600 dark:text-neutral-300'"
  >
    <UIcon :name="icon" class="size-5 shrink-0" aria-hidden="true" />
    <span>{{ label }}</span>
    <UBadge 
      v-if="badge" 
      :label="badge" 
      size="xs" 
      color="primary"
      class="ml-auto"
    />
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
