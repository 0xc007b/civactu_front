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
        
        <!-- Token invalide -->
        <div v-if="invalidToken" class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Lien invalide</h1>
          <p class="text-slate-600 mb-6">Ce lien de réinitialisation est invalide ou a expiré.</p>
          
          <div class="space-y-3">
            <router-link 
              to="/auth/forgot-password"
              class="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
            >
              Demander un nouveau lien
            </router-link>
            
            <router-link 
              to="/auth/login" 
              class="block w-full py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
            >
              Retour à la connexion
            </router-link>
          </div>
        </div>

        <!-- Réinitialisation réussie -->
        <div v-else-if="resetSuccess" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Mot de passe modifié !</h1>
          <p class="text-slate-600 mb-6">Votre mot de passe a été modifié avec succès.</p>
          
          <router-link 
            to="/auth/login"
            class="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
          >
            Se connecter
          </router-link>
        </div>

        <!-- Formulaire de réinitialisation -->
        <div v-else class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Nouveau mot de passe</h1>
          <p class="text-slate-600 mb-6">Choisissez un nouveau mot de passe sécurisé pour votre compte</p>

          <!-- Error message -->
          <div v-if="errorMessage" class="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
            <p class="text-sm text-red-800">{{ errorMessage }}</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- New Password -->
            <div class="space-y-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model="password" 
                  required 
                  minlength="8"
                  class="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Nouveau mot de passe"
                  autocomplete="new-password"
                />
                <button 
                  type="button" 
                  @click="showPassword = !showPassword" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Afficher/masquer le mot de passe"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                </button>
              </div>
              <!-- Password strength indicator -->
              <div class="grid grid-cols-5 gap-1">
                <div v-for="i in 5" :key="i" :class="[
                  'h-1 rounded-full transition-colors',
                  passwordStrength >= i ? 'bg-green-500' : 'bg-gray-200'
                ]"></div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="space-y-2">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model="confirmPassword" 
                  required 
                  :class="[
                    'w-full pl-10 pr-12 py-3 border rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 transition-colors',
                    passwordsMatch ? 'border-slate-300 focus:ring-blue-500 focus:border-blue-500' : 'border-red-300 focus:ring-red-500 focus:border-red-500'
                  ]"
                  placeholder="Confirmer le mot de passe"
                  autocomplete="new-password"
                />
                <button 
                  type="button" 
                  @click="showConfirmPassword = !showConfirmPassword" 
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="Afficher/masquer le mot de passe"
                >
                  <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                </button>
              </div>
              <p v-if="confirmPassword && !passwordsMatch" class="text-sm text-red-600">
                Les mots de passe ne correspondent pas
              </p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading || !passwordsMatch || !password || !confirmPassword"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span v-if="!isLoading">Modifier le mot de passe</span>
              <div v-else class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Modification en cours...</span>
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
import type { ResetPasswordData } from '~/types/auth'

const route = useRoute()
const { resetPassword } = useUsers()
const { $swal } = useNuxtApp()
const swal = $swal as typeof import('sweetalert2').default

const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isLoading = ref(false)
const resetSuccess = ref(false)
const invalidToken = ref(false)
const errorMessage = ref('')

// Computed properties
const passwordStrength = computed(() => {
  if (!password.value) return 0
  let strength = 0
  if (password.value.length >= 8) strength++
  if (/[A-Z]/.test(password.value)) strength++
  if (/[a-z]/.test(password.value)) strength++
  if (/[0-9]/.test(password.value)) strength++
  if (/[^A-Za-z0-9]/.test(password.value)) strength++
  return strength
})

const passwordsMatch = computed(() => {
  return password.value === confirmPassword.value
})

// Vérifier le token au montage
onMounted(() => {
  const token = route.query.token as string
  if (!token) {
    invalidToken.value = true
    swal.fire({
      title: 'Token manquant',
      text: 'Aucun token de réinitialisation trouvé dans l\'URL',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
  }
})

const handleSubmit = async () => {
  const token = route.query.token as string
  
  if (!token) {
    invalidToken.value = true
    return
  }

  if (!passwordsMatch.value) {
    swal.fire({
      title: 'Mots de passe différents',
      text: 'Les mots de passe ne correspondent pas',
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  try {
    await resetPassword(token, password.value)
    resetSuccess.value = true
    
    swal.fire({
      title: 'Mot de passe modifié !',
      text: 'Votre mot de passe a été modifié avec succès',
      icon: 'success',
      confirmButtonText: 'Se connecter',
      confirmButtonColor: '#3b82f6'
    }).then(() => {
      navigateTo('/auth/login')
    })
  } catch (error: any) {
    console.error('Password reset error:', error)
    
    if (error.message?.includes('token')) {
      invalidToken.value = true
      swal.fire({
        title: 'Token invalide',
        text: 'Ce lien de réinitialisation est invalide ou a expiré',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      })
    } else {
      swal.fire({
        title: 'Erreur de réinitialisation',
        text: error.message || 'Une erreur est survenue lors de la réinitialisation',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6'
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>
