<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          Messages
        </h1>
        <p class="text-gray-600">
          Communiquez avec les autres citoyens et les élus
        </p>
      </div>
      
      <UButton icon="i-heroicons-pencil-square" color="blue" variant="solid">
        Nouveau message
      </UButton>
    </div>



    <!-- Statistiques -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
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

    <!-- Liste des messages -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <!-- Liste des conversations -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden h-[600px] flex flex-col">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
            <h2 class="text-lg font-medium text-blue-800">Conversations</h2>
            <UBadge v-if="unreadCount > 0" :label="unreadCount" color="orange" variant="solid" />
          </div>
          
          <div class="p-4 space-y-2 overflow-y-auto flex-1">
            <div v-if="conversations.length === 0" class="text-center py-8">
              <UIcon name="i-heroicons-inbox" class="size-12 text-gray-400 mx-auto mb-4" />
              <p class="text-gray-500">
                Aucune conversation
              </p>
            </div>

            <div
              v-for="conversation in conversations"
              :key="conversation.id"
              :class="[
                'flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors',
                selectedConversationId === conversation.id 
                  ? 'bg-blue-100 shadow-sm' 
                  : 'hover:bg-gray-50',
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
                    conversation.hasUnread ? 'text-gray-900' : 'text-gray-700'
                  ]">
                    {{ getParticipantName(conversation.participant) }}
                  </p>
                  <time class="text-xs text-gray-500">
                    {{ formatRelativeTime(conversation.lastMessage?.createdAt) }}
                  </time>
                </div>
                
                <p :class="[
                  'text-sm truncate',
                  conversation.hasUnread ? 'font-medium text-gray-900' : 'text-gray-600'
                ]">
                  {{ conversation.lastMessage?.content || 'Aucun message' }}
                </p>
              </div>
              
              <div v-if="conversation.hasUnread" class="w-2 h-2 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Fil de discussion -->
      <div class="lg:col-span-2">
        <div v-if="selectedConversation" class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden h-[600px] flex flex-col">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <div class="flex items-center space-x-3">
              <UAvatar
                :src="selectedConversation.participant.avatar"
                :alt="getParticipantName(selectedConversation.participant)"
                size="md"
                class="ring-2 ring-blue-200"
              />
              <div>
                <h3 class="font-semibold text-blue-800">
                  {{ getParticipantName(selectedConversation.participant) }}
                </h3>
                <p class="text-sm text-gray-600">
                  {{ selectedConversation.participant.role === 'OFFICIAL' ? 'Élu' : 'Citoyen' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Fil de messages -->
          <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50" ref="messagesContainer">
            <div
              v-for="message in selectedConversation.messages"
              :key="message.id"
              :class="[
                'flex',
                message.isFromCurrentUser ? 'justify-end' : 'justify-start'
              ]"
            >
              <div :class="[
                'max-w-xs lg:max-w-md px-5 py-3 rounded-2xl shadow-sm',
                message.isFromCurrentUser 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-900'
              ]">
                <p class="text-sm leading-relaxed">{{ message.content }}</p>
                <time class="text-xs opacity-75 block mt-2 text-right">
                  {{ formatTime(message.createdAt) }}
                </time>
              </div>
            </div>
          </div>

          <!-- Saisie de message -->
          <div class="p-4 border-t border-gray-200 bg-white">
            <div class="flex space-x-2">
              <UTextarea
                v-model="newMessageContent"
                placeholder="Tapez votre message..."
                :rows="2"
                class="flex-1"
                color="blue"
                @keydown.enter.prevent="sendMessage"
              />
              <UButton
                @click="sendMessage"
                :disabled="!newMessageContent.trim()"
                :loading="sendingMessage"
                icon="i-heroicons-paper-airplane"
                color="blue"
                variant="solid"
                class="self-end"
              >
                Envoyer
              </UButton>
            </div>
          </div>
        </div>

        <!-- Aucune conversation sélectionnée -->
        <div v-else class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden h-[600px] flex items-center justify-center">
          <div class="text-center p-8">
            <div class="bg-blue-50 rounded-full p-6 w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="size-12 text-blue-500" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Sélectionnez une conversation
            </h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              Choisissez une conversation dans la liste ou créez un nouveau message pour commencer à discuter
            </p>
            <UButton 
              variant="soft"
              color="blue"
              icon="i-heroicons-pencil-square"
              class="shadow-sm"
            >
              Nouveau message
            </UButton>
          </div>
        </div>
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
const selectedConversationId = ref(null)
const newMessageContent = ref('')
const sendingMessage = ref(false)
const messagesContainer = ref(null)



// Data fetching
const { data: conversationsData, pending, refresh } = await useLazyAsyncData(
  'conversations',
  () => get('/api/v1/messages/conversations'),
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
// Suppression de la méthode handleSearch car le filtre a été retiré

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

// Suppression du watch pour les filtres qui ont été retirés


</script>
