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
        <!-- Logo/Brand Section -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Mot de passe oublié ?</h1>
          <p class="text-slate-600">Entrez vos informations pour recevoir un lien de réinitialisation</p>
        </div>

        <!-- Success message -->
        <div v-if="emailSent" class="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
          <div class="flex items-center space-x-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <div class="text-sm text-green-800">
              <p class="font-medium">Email envoyé avec succès!</p>
              <p>Vérifiez votre boîte de réception pour le lien de réinitialisation.</p>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="space-y-6">
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
                  :disabled="emailSent"
                  class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-slate-100 disabled:cursor-not-allowed"
                  placeholder="hello@unisense.agency"
                  autocomplete="email"
                />
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading || emailSent"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span v-if="!isLoading && !emailSent">Envoyer le lien</span>
              <span v-else-if="emailSent">Email envoyé</span>
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
          <div class="text-center">
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
import type { ForgotPasswordData } from '~/types/auth'

const { forgotPassword } = useUsers()
const { $swal } = useNuxtApp()
const swal = $swal as typeof import('sweetalert2').default

const email = ref('')
const isLoading = ref(false)
const emailSent = ref(false)

const handleSubmit = async () => {
  isLoading.value = true
  
  try {
    await forgotPassword(email.value)
    emailSent.value = true
    
    swal.fire({
      title: 'Email envoyé !',
      text: 'Vérifiez votre boîte de réception pour le lien de réinitialisation',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    
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
