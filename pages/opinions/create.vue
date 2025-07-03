<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          Créer un nouvel avis
        </h1>
        <p class="text-gray-600">
          Partagez votre point de vue sur les sujets qui vous concernent
        </p>
      </div>
      
      <UButton to="/opinions" icon="i-heroicons-arrow-left" color="gray" variant="ghost">
        Retour aux avis
      </UButton>
    </div>

    <!-- Formulaire de création d'avis -->
    <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h2 class="text-lg font-medium text-blue-800">Formulaire d'avis</h2>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Type d'avis -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-funnel" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Type d'avis</label>
          </div>
          <USelect
            v-model="newOpinion.type"
            :options="typeOptions.filter(option => option.value !== null)"
            placeholder="Sélectionnez un type d'avis"
            class="w-full"
            size="lg"
            color="blue"
          />
        </div>
        
        <!-- Commune -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-map-pin" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Commune</label>
          </div>
          <USelect
            v-model="newOpinion.municipality"
            :options="municipalityOptions.filter(option => option.value !== null)"
            placeholder="Sélectionnez une commune"
            class="w-full"
            size="lg"
            color="blue"
          />
        </div>
        
        <!-- Titre -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-document-text" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Titre</label>
          </div>
          <UInput
            v-model="newOpinion.title"
            placeholder="Titre de votre avis"
            class="w-full"
            size="lg"
            color="blue"
          />
        </div>
        
        <!-- Contenu -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Contenu</label>
          </div>
          <UTextarea
            v-model="newOpinion.content"
            placeholder="Détaillez votre avis ici..."
            :rows="6"
            class="w-full"
            color="blue"
          />
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <UButton
            to="/opinions"
            color="gray"
            variant="ghost"
          >
            Annuler
          </UButton>
          <UButton
            @click="submitOpinion"
            :disabled="!isOpinionValid || submittingOpinion"
            :loading="submittingOpinion"
            color="blue"
            variant="solid"
            icon="i-heroicons-paper-airplane"
          >
            Publier
          </UButton>
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

// Head configuration
useHead({
  title: 'Créer un avis - CivActu'
})

const { get } = useApi()
const router = useRouter()

// État du formulaire
const submittingOpinion = ref(false)
const newOpinion = reactive({
  type: null,
  municipality: null,
  title: '',
  content: ''
})

// Options pour les sélecteurs
const typeOptions = [
  { label: 'Soutien', value: 'SUPPORT' },
  { label: 'Opposition', value: 'OPPOSE' },
  { label: 'Neutre', value: 'NEUTRAL' },
  { label: 'Suggestion', value: 'SUGGESTION' }
]

// Récupération des communes depuis l'API
const { data: municipalitiesData } = await useLazyAsyncData(
  'municipalities',
  () => get('/api/v1/municipalities'),
  {
    default: () => ({ data: [] })
  }
)

// Formatage des options de communes
const municipalityOptions = computed(() => {
  const municipalities = municipalitiesData.value?.data || []
  return municipalities.map(m => ({
    label: m.name,
    value: m.id
  }))
})

// Validation du formulaire
const isOpinionValid = computed(() => {
  return newOpinion.type && 
         newOpinion.municipality && 
         newOpinion.title?.trim() && 
         newOpinion.content?.trim()
})

// Soumission du formulaire
const submitOpinion = async () => {
  if (!isOpinionValid.value) return
  
  submittingOpinion.value = true
  
  try {
    // Simulation d'envoi d'avis (remplacer par l'API réelle)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Notification de succès
    alert('Votre avis a été publié avec succès')
    
    // Redirection vers la liste des avis
    router.push('/opinions')
  } catch (error) {
    console.error('Erreur lors de la publication de l\'avis:', error)
    alert('Erreur lors de la publication de l\'avis')
  } finally {
    submittingOpinion.value = false
  }
}
</script>
