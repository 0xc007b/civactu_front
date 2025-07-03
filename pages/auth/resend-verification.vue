<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <!-- Header avec logo -->
    <div class="flex items-center justify-between p-6">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded-lg flex items-center justify-center">
          <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </div>
        <span class="text-xl font-semibold text-slate-900">CivActu</span>
      </div>
      <div class="flex items-center space-x-2 text-sm text-slate-600">
        <span>Français (FR)</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
    </div>

    <div class="min-h-screen flex items-center justify-center px-4 -mt-20">
      <div class="w-full max-w-md">
        
        <!-- Email envoyé avec succès -->
        <div v-if="emailSent" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Email envoyé !</h1>
          <p class="text-slate-600 mb-2">Un nouvel email de vérification a été envoyé à :</p>
          <p class="text-blue-600 font-medium mb-6">{{ email || userEmail }}</p>
          
          <div class="space-y-3">
            <router-link 
              to="/auth/verify-email"
              class="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
            >
              Vérifier l'email
            </router-link>
            
            <router-link 
              to="/auth/login" 
              class="block w-full py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
            >
              Retour à la connexion
            </router-link>
          </div>
        </div>

        <!-- Formulaire de renvoi -->
        <div v-else class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Renvoyer l'email de vérification</h1>
          <p class="text-slate-600 mb-6">Entrez votre adresse email pour recevoir un nouveau lien de vérification</p>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Email -->
            <div class="space-y-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input 
                  type="email" 
                  id="email" 
                  v-model="email" 
                  required 
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Votre adresse email"
                  autocomplete="email"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span v-if="!isLoading">Renvoyer l'email</span>
              <div v-else class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi en cours...</span>
              </div>
            </button>
          </form>

          <!-- Back to login -->
          <div class="mt-6 text-center">
            <router-link 
              to="/auth/login" 
              class="inline-flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              <span>Retour à la connexion</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { resendVerificationEmail, user } = useUsers()
const { $swal } = useNuxtApp()
const swal = $swal as typeof import('sweetalert2').default

const email = ref('')
const isLoading = ref(false)
const emailSent = ref(false)
const userEmail = ref('')

// Si l'utilisateur est connecté, utiliser son email
onMounted(() => {
  if (user.value?.email) {
    userEmail.value = user.value.email
    email.value = user.value.email
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    await resendVerificationEmail()
    emailSent.value = true
    
    swal.fire({
      title: 'Email envoyé !',
      text: 'Un nouvel email de vérification vous a été envoyé',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
  } catch (error: any) {
    console.error('Resend verification error:', error)
    
    swal.fire({
      title: 'Erreur',
      text: error.message || 'Une erreur est survenue lors de l\'envoi de l\'email',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    isLoading.value = false
  }
}
</script>
