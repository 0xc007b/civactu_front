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
          <h1 class="text-3xl font-bold text-slate-900 mb-2">Commencer</h1>
          <p class="text-slate-600">Créez un compte pour continuer</p>
        </div>

        <!-- Boutons de connexion sociale -->
        <!-- <div class="space-y-3 mb-6">
          <button 
            type="button"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span>S'inscrire avec Google</span>
          </button>
          
          <button 
            type="button"
            class="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-700 hover:bg-slate-50 transition-colors duration-200"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"/>
            </svg>
            <span>S'inscrire avec Apple ID</span>
          </button>
        </div>

        <div class="flex items-center my-6">
          <div class="flex-1 border-t border-slate-200"></div>
          <span class="px-4 text-sm text-slate-500">OU</span>
          <div class="flex-1 border-t border-slate-200"></div>
        </div> -->

        <!-- Registration Form Card -->
        <div class="space-y-6">
          <form @submit.prevent="handleSubmit" class="space-y-4"
            :class="{ 'pointer-events-none opacity-60': isLoading }"
          >
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
                  v-model="form.email" 
                  required 
                  :class="[
                    'w-full pl-10 pr-4 py-3 border rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
                    'border-slate-300'
                  ]"
                  placeholder="Votre Email"
                  autocomplete="email"
                />
              </div>
            </div>

            <!-- Prénom -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="firstName" 
                v-model="form.firstName" 
                required 
                class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Votre prénom"
                autocomplete="given-name"
              />
            </div>

            <!-- Nom -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <input 
                type="text" 
                id="lastName" 
                v-model="form.lastName" 
                required 
                class="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Votre nom de famille"
                autocomplete="family-name"
              />
            </div>

            <!-- Téléphone -->
            <div class="space-y-2">
              <label for="phone" class="block text-sm font-medium text-slate-700">
                Numéro de téléphone <span class="text-slate-400">(optionnel)</span>
              </label>
              <PhoneInput
                v-model="form.phone"
                :required="false"
              />
            </div>

            <!-- Password -->
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
                  v-model="form.password" 
                  required 
                  class="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Créer un mot de passe"
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

            <!-- Terms -->
            <div class="space-y-4">
              <label class="flex items-start space-x-3">
                <input 
                  v-model="acceptTerms"
                  type="checkbox" 
                  required
                  class="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                >
                <span class="text-sm text-slate-600">
                  J'accepte les <a href="#" class="text-blue-600 hover:text-blue-500 transition-colors">Conditions d'utilisation</a>
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="isLoading || !acceptTerms"
              class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span v-if="!isLoading">S'inscrire</span>
              <div v-else class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Inscription en cours...</span>
              </div>
            </button>
          </form>

          <!-- Login Link -->
          <div class="text-center mt-6">
            <p class="text-sm text-slate-600">
              Vous avez déjà un compte ?
              <router-link 
                to="/auth/login" 
                class="font-medium text-blue-600 hover:text-blue-500 transition-colors"
              >
                Se connecter
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RegisterData } from '~/types/auth';

const { createUser } = useUsers()
const { $swal } = useNuxtApp()
const swal = $swal as typeof import('sweetalert2').default

const form = reactive<RegisterData>({
  email: '',
  password: '',
  firstName: '',
  lastName: '',
  phone: '',
  role: 'CITIZEN',
})

const showPassword = ref(false)
const isLoading = ref(false)
const acceptTerms = ref(false)

// Computed properties
const passwordStrength = computed(() => {
  if (!form.password) return 0
  let strength = 0
  if (form.password.length >= 8) strength++
  if (/[A-Z]/.test(form.password)) strength++
  if (/[a-z]/.test(form.password)) strength++
  if (/[0-9]/.test(form.password)) strength++
  if (/[^A-Za-z0-9]/.test(form.password)) strength++
  return strength
})

// Handle registration submission
const handleSubmit = async () => {
  if (!acceptTerms.value) {
    swal.fire({
      title: 'Conditions requises',
      text: 'Vous devez accepter les conditions d\'utilisation pour continuer',
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
    return
  }
  
  if (!form.firstName.trim() || !form.lastName.trim()) {
    swal.fire({
      title: 'Champs requis',
      text: 'Le prénom et le nom sont obligatoires',
      icon: 'warning',
      confirmButtonText: 'OK',
      confirmButtonColor: '#3b82f6'
    })
    return
  }
  
  isLoading.value = true
  
  try {
    const registerData: RegisterData = {
      email: form.email,
      password: form.password,
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      phone: form.phone || undefined,
      role: form.role
    }
    
    await createUser(registerData)
    
    // Success notification
    await swal.fire({
      title: 'Inscription réussie !',
      text: 'Votre compte a été créé avec succès. Un email de vérification vous a été envoyé.',
      icon: 'success',
      confirmButtonText: 'Continuer',
      confirmButtonColor: '#3b82f6',
      timer: 5000,
      timerProgressBar: true
    })
    
    await navigateTo(`/auth/verify-email?from=register&email=${encodeURIComponent(form.email)}`)
  } catch (error: any) {
    console.error('Registration error:', error)
    
    swal.fire({
      title: 'Erreur d\'inscription',
      text: error.message || 'Une erreur est survenue lors de l\'inscription',
      icon: 'error',
      confirmButtonText: 'Réessayer',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    isLoading.value = false
  }
}
</script>