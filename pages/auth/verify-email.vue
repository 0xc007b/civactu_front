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
        
        <!-- Verification en cours -->
        <div v-if="isVerifying" class="text-center">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Vérification en cours...</h1>
          <p class="text-slate-600">Nous vérifions votre adresse email.</p>
        </div>

        <!-- Vérification réussie -->
        <div v-else-if="verificationSuccess" class="text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Email vérifié !</h1>
          <p class="text-slate-600 mb-6">Votre adresse email a été vérifiée avec succès.</p>
          
          <button 
            @click="goToDashboard"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continuer vers le tableau de bord
          </button>
        </div>

        <!-- Vérification échouée -->
        <div v-else-if="verificationError" class="text-center">
          <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Vérification échouée</h1>
          <p class="text-slate-600 mb-6">{{ verificationError }}</p>
          
          <div class="space-y-3">
            <button 
              @click="resendEmail"
              :disabled="isResending"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span v-if="!isResending">Renvoyer l'email de vérification</span>
              <div v-else class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi en cours...</span>
              </div>
            </button>
            
            <router-link 
              to="/auth/login" 
              class="block w-full py-3 px-4 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors text-center"
            >
              Retour à la connexion
            </router-link>
          </div>
        </div>

        <!-- Page par défaut (depuis inscription) -->
        <div v-else class="text-center">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900 mb-2">Vérifiez votre email</h1>
          <p class="text-slate-600 mb-2">Nous avons envoyé un lien à votre adresse email :</p>
          <p class="text-blue-600 font-medium mb-6">{{ userEmail || 'votre adresse email' }}</p>
          
          <button 
            @click="skipVerification"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-4"
          >
            Ignorer pour le moment
          </button>
          
          <div class="text-center">
            <p class="text-sm text-slate-600">
              Vous n'avez pas reçu d'email ?
              <button 
                @click="resendEmail"
                :disabled="isResending"
                class="text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isResending ? 'Envoi...' : 'Renvoyer' }}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VerifyEmailData } from '~/types/auth'

const route = useRoute()
const { verifyEmail, resendVerificationEmail, user } = useUsers()
const { $swal } = useNuxtApp()
const swal = $swal as typeof import('sweetalert2').default

const isVerifying = ref(false)
const verificationSuccess = ref(false)
const verificationError = ref('')
const isResending = ref(false)
const userEmail = ref('')

// Récupérer l'email de l'utilisateur s'il est connecté ou depuis l'URL
onMounted(async () => {
  // Priorité 1: Email depuis l'URL (depuis l'inscription)
  const emailFromUrl = route.query.email as string
  if (emailFromUrl) {
    userEmail.value = emailFromUrl
  }
  // Priorité 2: Email de l'utilisateur connecté
  else if (user.value?.email) {
    userEmail.value = user.value.email
  }

  // Si nous avons un token dans l'URL, vérifier automatiquement
  const token = route.query.token as string
  if (token) {
    await verifyEmailWithToken(token)
  }
})

const verifyEmailWithToken = async (token: string) => {
  isVerifying.value = true
  verificationError.value = ''
  
  try {
    await verifyEmail(token)
    verificationSuccess.value = true
    
    swal.fire({
      title: 'Email vérifié !',
      text: 'Votre adresse email a été vérifiée avec succès',
      icon: 'success',
      confirmButtonText: 'Continuer',
      confirmButtonColor: '#3b82f6'
    })
  } catch (error: any) {
    console.error('Email verification error:', error)
    verificationError.value = error.message || 'Lien de vérification invalide ou expiré'
  } finally {
    isVerifying.value = false
  }
}

const resendEmail = async () => {
  isResending.value = true
  
  try {
    await resendVerificationEmail()
    
    swal.fire({
      title: 'Email envoyé !',
      text: 'Un nouvel email de vérification vous a été envoyé',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
  } catch (error: any) {
    console.error('Resend email error:', error)
    
    swal.fire({
      title: 'Erreur',
      text: error.message || 'Une erreur est survenue lors de l\'envoi de l\'email',
      icon: 'error',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    isResending.value = false
  }
}

const goToDashboard = async () => {
  await navigateTo('/dashboard')
}

const skipVerification = async () => {
  await navigateTo('/dashboard')
}
</script>
