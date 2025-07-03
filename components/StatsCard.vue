<template>
  <div 
    :to="to"
    :class="[
      'relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg cursor-pointer group',
      colorBorderClasses
    ]"
  >
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-base font-semibold text-gray-800">
              {{ title }}
            </h3>
            <UBadge 
              v-if="badge" 
              :label="badge" 
              size="sm"
              :color="color"
              class="ml-2"
            />
          </div>
          <p class="text-3xl font-bold group-hover:scale-105 transition-transform" :class="textColorClasses">
            {{ value }}
          </p>
        </div>
        
        <div :class="[
          'flex items-center justify-center w-12 h-12 rounded-full',
          iconBackgroundClasses
        ]">
          <UIcon 
            :name="icon" 
            :class="[
              'size-6',
              iconClasses
            ]" 
          />
        </div>
      </div>
    </div>
    <div :class="['h-1 w-full', stripColorClasses]"></div>
  </div>
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
    border: 'border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100',
    icon: 'text-blue-600',
    text: 'text-blue-700',
    strip: 'bg-blue-500'
  },
  green: {
    border: 'border-green-200 hover:border-green-400',
    iconBg: 'bg-green-100',
    icon: 'text-green-600',
    text: 'text-green-700',
    strip: 'bg-green-500'
  },
  orange: {
    border: 'border-orange-200 hover:border-orange-400',
    iconBg: 'bg-orange-100',
    icon: 'text-orange-600',
    text: 'text-orange-700',
    strip: 'bg-orange-500'
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-400',
    iconBg: 'bg-purple-100',
    icon: 'text-purple-600',
    text: 'text-purple-700',
    strip: 'bg-purple-500'
  },
  red: {
    border: 'border-red-200 hover:border-red-400',
    iconBg: 'bg-red-100',
    icon: 'text-red-600',
    text: 'text-red-700',
    strip: 'bg-red-500'
  },
  primary: {
    border: 'border-blue-200 hover:border-blue-400',
    iconBg: 'bg-blue-100',
    icon: 'text-blue-600',
    text: 'text-blue-700',
    strip: 'bg-blue-500'
  }
}

const colorBorderClasses = computed(() => colorMap[props.color]?.border || colorMap.primary.border)
const iconBackgroundClasses = computed(() => colorMap[props.color]?.iconBg || colorMap.primary.iconBg)
const iconClasses = computed(() => colorMap[props.color]?.icon || colorMap.primary.icon)
const textColorClasses = computed(() => colorMap[props.color]?.text || colorMap.primary.text)
const stripColorClasses = computed(() => colorMap[props.color]?.strip || colorMap.primary.strip)
</script>
