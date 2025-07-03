<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Messages
        </h1>
        <p class="text-gray-600 dark:text-gray-400">
          Communiquez avec les autres citoyens et les élus
        </p>
      </div>
      
      <UButton to="/messages/compose" icon="i-heroicons-pencil-square">
        Nouveau message
      </UButton>
    </div>

    <!-- Search and Filters -->
    <UCard>
      <div class="flex items-center space-x-4">
        <UInput
          v-model="searchQuery"
          placeholder="Rechercher dans les messages..."
          icon="i-heroicons-magnifying-glass"
          class="flex-1"
          @keydown.enter="handleSearch"
        />
        
        <USelect
          v-model="filterType"
          :options="filterOptions"
          placeholder="Filtrer"
          class="w-40"
        />
        
        <UButton @click="handleSearch" variant="outline">
          Rechercher
        </UButton>
      </div>
    </UCard>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard
        title="Messages reçus"
        :value="stats.received || 0"
        icon="i-heroicons-inbox"
        color="blue"
      />
      <StatsCard
        title="Messages envoyés"
        :value="stats.sent || 0"
        icon="i-heroicons-paper-airplane"
        color="green"
      />
      <StatsCard
        title="Non lus"
        :value="stats.unread || 0"
        icon="i-heroicons-envelope"
        color="orange"
        :badge="stats.unread > 0 ? stats.unread : undefined"
      />
    </div>

    <!-- Messages List -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Conversations List -->
      <div class="lg:col-span-1">
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-semibold">Conversations</h2>
              <UBadge v-if="unreadCount > 0" :label="unreadCount" color="orange" />
            </div>
          </template>
          
          <div class="space-y-2">
            <div v-if="conversations.length === 0" class="text-center py-8">
              <UIcon name="i-heroicons-inbox" class="size-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500 dark:text-gray-400">
                Aucune conversation
              </p>
            </div>

            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              :class="[
                'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
                selectedConversationId === conversation.id 
                  ? 'bg-blue-100 dark:bg-blue-900/50' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/50',
                conversation.hasUnread && 'border-l-4 border-blue-500'
              ]"
              @click="selectConversation(conversation.id)"
            >
              <UAvatar
                :src="conversation.participant.avatar"
                :alt="getParticipantName(conversation.participant)"
                size="sm"
              />
              
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p :class="[
                    'text-sm font-medium truncate',
                    conversation.hasUnread ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'
                  ]">
                    {{ getParticipantName(conversation.participant) }}
                  </p>
                  <time class="text-xs text-gray-500 dark:text-gray-400">
                    {{ formatRelativeTime(conversation.lastMessage?.createdAt) }}
                  </time>
                </div>
                
                <p :class="[
                  'text-sm truncate',
                  conversation.hasUnread ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                ]">
                  {{ conversation.lastMessage?.content || 'Aucun message' }}
                </p>
              </div>
              
              <div v-if="conversation.hasUnread" class="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Message Thread -->
      <div class="lg:col-span-2">
        <UCard v-if="selectedConversation" class="h-[600px] flex flex-col">
          <template #header>
            <div class="flex items-center space-x-3">
              <UAvatar
                :src="selectedConversation.participant.avatar"
                :alt="getParticipantName(selectedConversation.participant)"
                size="sm"
              />
              <div>
                <h3 class="font-semibold">
                  {{ getParticipantName(selectedConversation.participant) }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedConversation.participant.role === 'OFFICIAL' ? 'Élu' : 'Citoyen' }}
                </p>
              </div>
            </div>
          </template>

          <!-- Messages Thread -->
          <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
            <div
              v-for="message in selectedConversation.messages"
              :key="message.id"
              :class="[
                'flex',
                message.isFromCurrentUser ? 'justify-end' : 'justify-start'
              ]"
            >
              <div :class="[
                'max-w-xs lg:max-w-md px-4 py-2 rounded-lg',
                message.isFromCurrentUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              ]">
                <p class="text-sm">{{ message.content }}</p>
                <time class="text-xs opacity-75 block mt-1">
                  {{ formatTime(message.createdAt) }}
                </time>
              </div>
            </div>
          </div>

          <!-- Message Input -->
          <template #footer>
            <div class="flex space-x-2">
              <UTextarea
                v-model="newMessageContent"
                placeholder="Tapez votre message..."
                :rows="2"
                class="flex-1"
                @keydown.enter.prevent="sendMessage"
              />
              <UButton
                @click="sendMessage"
                :disabled="!newMessageContent.trim()"
                :loading="sendingMessage"
                icon="i-heroicons-paper-airplane"
              >
                Envoyer
              </UButton>
            </div>
          </template>
        </UCard>

        <!-- No conversation selected -->
        <UCard v-else class="h-[600px] flex items-center justify-center">
          <div class="text-center">
            <UIcon name="i-heroicons-chat-bubble-left-right" class="size-16 text-gray-400 mx-auto mb-4" />
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Sélectionnez une conversation
            </h3>
            <p class="text-gray-500 dark:text-gray-400 mb-4">
              Choisissez une conversation dans la liste pour commencer à discuter
            </p>
            <UButton to="/messages/compose" variant="outline">
              Nouveau message
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth', 'verified'],
  layout: 'dashboard'
})

const { get, post } = useApi()
const { user } = useUsers()
const toast = useToast()
const route = useRoute()

// Head configuration
useHead({
  title: 'Messages - CivActu'
})

// State
const searchQuery = ref('')
const filterType = ref(null)
const selectedConversationId = ref(null)
const newMessageContent = ref('')
const sendingMessage = ref(false)
const messagesContainer = ref(null)

// Filter options
const filterOptions = [
  { label: 'Tous', value: null },
  { label: 'Non lus', value: 'unread' },
  { label: 'Reçus', value: 'received' },
  { label: 'Envoyés', value: 'sent' }
]

// Data fetching
const { data: conversationsData, pending, refresh } = await useLazyAsyncData(
  'conversations',
  () => get('/api/v1/messages/conversations', {
    search: searchQuery.value || undefined,
    filter: filterType.value || undefined
  }),
  {
    default: () => ({
      data: [],
      stats: { received: 0, sent: 0, unread: 0 }
    })
  }
)

// Computed
const conversations = computed(() => conversationsData.value?.data || [])
const stats = computed(() => conversationsData.value?.stats || {})
const unreadCount = computed(() => stats.value.unread || 0)

const selectedConversation = computed(() => {
  if (!selectedConversationId.value) return null
  return conversations.value.find(c => c.id === selectedConversationId.value)
})

// Methods
const handleSearch = () => {
  refresh()
}

const selectConversation = async (conversationId) => {
  selectedConversationId.value = conversationId
  
  // Load messages for this conversation
  try {
    const { data } = await get(`/messages/conversations/${conversationId}`)
    
    // Update the conversation with messages
    const conversation = conversations.value.find(c => c.id === conversationId)
    if (conversation) {
      conversation.messages = data.messages.map(message => ({
        ...message,
        isFromCurrentUser: message.sender.id === user.value.id
      }))
      conversation.hasUnread = false
    }
    
    // Mark messages as read
    await post(`/messages/conversations/${conversationId}/mark-read`)
    
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch (error) {
    // Error handled by useApi
  }
}

const sendMessage = async () => {
  if (!newMessageContent.value.trim() || !selectedConversationId.value) return
  
  sendingMessage.value = true
  
  try {
    const { data } = await post(`/messages/conversations/${selectedConversationId.value}/messages`, {
      content: newMessageContent.value.trim()
    })
    
    // Add message to current conversation
    const conversation = conversations.value.find(c => c.id === selectedConversationId.value)
    if (conversation) {
      if (!conversation.messages) conversation.messages = []
      conversation.messages.push({
        ...data,
        isFromCurrentUser: true
      })
      conversation.lastMessage = data
    }
    
    newMessageContent.value = ''
    
    // Scroll to bottom
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    })
  } catch (error) {
    // Error handled by useApi
  } finally {
    sendingMessage.value = false
  }
}

const getParticipantName = (participant) => {
  return `${participant.firstName} ${participant.lastName}`
}

const formatRelativeTime = (dateString) => {
  if (!dateString) return ''
  
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

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

// Watch for route changes to select conversation
watchEffect(() => {
  const conversationId = route.query.conversation
  if (conversationId && conversationId !== selectedConversationId.value) {
    selectConversation(conversationId)
  }
})

// Watch for filter changes
watch([searchQuery, filterType], () => {
  refresh()
})
</script>
