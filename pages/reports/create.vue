<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900">
          Créer un signalement
        </h1>
        <p class="text-gray-600">
          Signalez un problème dans votre commune pour qu'il soit pris en charge
        </p>
      </div>
      
      <UButton to="/reports" icon="i-heroicons-arrow-left" color="gray" variant="ghost">
        Retour aux signalements
      </UButton>
    </div>

    <!-- Formulaire de création de signalement -->
    <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
      <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
        <h2 class="text-lg font-medium text-blue-800">Formulaire de signalement</h2>
      </div>
      
      <div class="p-6 space-y-6">
        <!-- Catégorie -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-folder" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Catégorie</label>
          </div>
          <USelect
            v-model="newReport.category"
            :options="categoryOptions"
            placeholder="Sélectionnez une catégorie"
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
            v-model="newReport.municipality"
            :options="municipalityOptions"
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
            v-model="newReport.title"
            placeholder="Titre du signalement"
            class="w-full"
            size="lg"
            color="blue"
          />
        </div>
        
        <!-- Description -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-chat-bubble-left-ellipsis" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Description</label>
          </div>
          <UTextarea
            v-model="newReport.description"
            placeholder="Décrivez le problème en détail..."
            :rows="6"
            class="w-full"
            color="blue"
          />
        </div>
        
        <!-- Localisation -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-map" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Adresse</label>
          </div>
          <UInput
            v-model="newReport.location"
            placeholder="Adresse ou lieu du problème"
            class="w-full"
            size="lg"
            color="blue"
          />
        </div>
        
        <!-- Photos -->
        <div>
          <div class="flex items-center mb-2">
            <UIcon name="i-heroicons-photo" class="mr-2 text-blue-600 size-4" />
            <label class="text-sm font-medium text-gray-700">Photos (optionnel)</label>
          </div>
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <UIcon name="i-heroicons-arrow-up-tray" class="mx-auto h-12 w-12 text-gray-400" />
            <div class="mt-2">
              <p class="text-sm text-gray-600">
                Glissez-déposez des photos ici ou
              </p>
              <p class="mt-1">
                <UButton size="sm" color="blue" variant="soft">
                  Parcourir
                </UButton>
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-2">
              PNG, JPG, GIF jusqu'à 10MB
            </p>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <UButton
            to="/reports"
            color="gray"
            variant="ghost"
          >
            Annuler
          </UButton>
          <UButton
            @click="submitReport"
            :disabled="!isReportValid || submittingReport"
            :loading="submittingReport"
            color="blue"
            variant="solid"
            icon="i-heroicons-paper-airplane"
          >
            Soumettre
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
  title: 'Créer un signalement - CivActu'
})

const { get, post } = useApi()
const router = useRouter()

// État du formulaire
const submittingReport = ref(false)
const newReport = reactive({
  category: null,
  municipality: null,
  title: '',
  description: '',
  location: '',
  photos: []
})

// Options pour les catégories
const categoryOptions = [
  { label: 'Voirie', value: 'ROAD' },
  { label: 'Éclairage public', value: 'LIGHTING' },
  { label: 'Propreté', value: 'CLEANLINESS' },
  { label: 'Espaces verts', value: 'GREEN_SPACE' },
  { label: 'Mobilier urbain', value: 'URBAN_FURNITURE' },
  { label: 'Sécurité', value: 'SECURITY' },
  { label: 'Autre', value: 'OTHER' }
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
const isReportValid = computed(() => {
  return newReport.category && 
         newReport.municipality && 
         newReport.title?.trim() && 
         newReport.description?.trim() &&
         newReport.location?.trim()
})

// Soumission du formulaire
const submitReport = async () => {
  if (!isReportValid.value) return
  
  submittingReport.value = true
  
  try {
    // Simulation d'envoi de signalement (remplacer par l'API réelle)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Notification de succès
    alert('Votre signalement a été soumis avec succès')
    
    // Redirection vers la liste des signalements
    router.push('/reports')
  } catch (error) {
    console.error('Erreur lors de la soumission du signalement:', error)
    alert('Erreur lors de la soumission du signalement')
  } finally {
    submittingReport.value = false
  }
}
</script>
