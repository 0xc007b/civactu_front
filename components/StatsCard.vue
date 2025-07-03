<template>
  <UCard 
    :to="to"
    :class="[
      'transition-all duration-200 hover:shadow-lg cursor-pointer group',
      colorClasses
    ]"
  >
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <p class="text-sm font-medium text-gray-600 dark:text-gray-400">
            {{ title }}
          </p>
          <UBadge 
            v-if="badge" 
            :label="badge" 
            size="xs"
            :color="color"
          />
        </div>
        <p class="text-3xl font-bold text-gray-900 dark:text-white group-hover:scale-105 transition-transform">
          {{ value }}
        </p>
      </div>
      
      <div :class="[
        'p-3 rounded-lg transition-colors',
        iconBackgroundClasses
      ]">
        <UIcon 
          :name="icon" 
          :class="[
            'size-6 transition-colors',
            iconClasses
          ]" 
        />
      </div>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary',
    validator: value => ['blue', 'green', 'orange', 'purple', 'red', 'primary'].includes(value)
  },
  to: {
    type: String,
    default: null
  },
  badge: {
    type: [String, Number],
    default: null
  }
})

const colorMap = {
  blue: {
    card: 'hover:border-blue-200 dark:hover:border-blue-800',
    iconBg: 'bg-blue-100 dark:bg-blue-900/50',
    icon: 'text-blue-600 dark:text-blue-400'
  },
  green: {
    card: 'hover:border-green-200 dark:hover:border-green-800',
    iconBg: 'bg-green-100 dark:bg-green-900/50',
    icon: 'text-green-600 dark:text-green-400'
  },
  orange: {
    card: 'hover:border-orange-200 dark:hover:border-orange-800',
    iconBg: 'bg-orange-100 dark:bg-orange-900/50',
    icon: 'text-orange-600 dark:text-orange-400'
  },
  purple: {
    card: 'hover:border-purple-200 dark:hover:border-purple-800',
    iconBg: 'bg-purple-100 dark:bg-purple-900/50',
    icon: 'text-purple-600 dark:text-purple-400'
  },
  red: {
    card: 'hover:border-red-200 dark:hover:border-red-800',
    iconBg: 'bg-red-100 dark:bg-red-900/50',
    icon: 'text-red-600 dark:text-red-400'
  },
  primary: {
    card: 'hover:border-primary-200 dark:hover:border-primary-800',
    iconBg: 'bg-primary-100 dark:bg-primary-900/50',
    icon: 'text-primary-600 dark:text-primary-400'
  }
}

const colorClasses = computed(() => colorMap[props.color]?.card || colorMap.primary.card)
const iconBackgroundClasses = computed(() => colorMap[props.color]?.iconBg || colorMap.primary.iconBg)
const iconClasses = computed(() => colorMap[props.color]?.icon || colorMap.primary.icon)
</script>
