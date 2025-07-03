<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-extrabold text-gray-900">
        Mon profil
      </h1>
      <p class="text-gray-600">
        Gérez vos informations personnelles et vos préférences
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Colonne de gauche: Photo et infos principales -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 class="text-lg font-medium text-blue-800">Informations de base</h2>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Photo de profil -->
            <div class="flex flex-col items-center">
              <div class="relative">
                <img 
                  src="https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff&size=128" 
                  alt="Photo de profil" 
                  class="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                />
                <button class="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-md hover:bg-blue-700">
                  <UIcon name="i-heroicons-camera" class="size-5" />
                </button>
              </div>
              <h3 class="mt-4 text-xl font-semibold">John Doe</h3>
              <p class="text-gray-500">Citoyen</p>
            </div>
            
            <!-- Statut du compte -->
            <div>
              <div class="flex items-center mb-2">
                <UIcon name="i-heroicons-check-badge" class="mr-2 text-green-600 size-5" />
                <span class="text-sm font-medium text-gray-700">Compte vérifié</span>
              </div>
              <div class="flex items-center">
                <UIcon name="i-heroicons-calendar" class="mr-2 text-blue-600 size-5" />
                <span class="text-sm text-gray-600">Membre depuis le 15 juin 2023</span>
              </div>
            </div>
            
            <!-- Actions rapides -->
            <div class="pt-4 border-t border-gray-100">
              <UButton
                block
                color="red"
                variant="ghost"
                icon="i-heroicons-arrow-right-on-rectangle"
              >
                Se déconnecter
              </UButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Colonne de droite: Formulaires -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Informations personnelles -->
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h2 class="text-lg font-medium text-blue-800">Informations personnelles</h2>
            <UButton color="blue" variant="ghost" size="sm" icon="i-heroicons-pencil-square">
              Modifier
            </UButton>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Prénom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                <UInput
                  value="John"
                  disabled
                  class="w-full"
                />
              </div>
              
              <!-- Nom -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                <UInput
                  value="Doe"
                  disabled
                  class="w-full"
                />
              </div>
              
              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <UInput
                  value="john.doe@example.com"
                  disabled
                  class="w-full"
                />
              </div>
              
              <!-- Téléphone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <UInput
                  value="+33 6 12 34 56 78"
                  disabled
                  class="w-full"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Adresse -->
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <h2 class="text-lg font-medium text-blue-800">Adresse</h2>
            <UButton color="blue" variant="ghost" size="sm" icon="i-heroicons-pencil-square">
              Modifier
            </UButton>
          </div>
          
          <div class="p-6">
            <div class="grid grid-cols-1 gap-6">
              <!-- Adresse -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <UInput
                  value="123 Rue de la République"
                  disabled
                  class="w-full"
                />
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- Code postal -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Code postal</label>
                  <UInput
                    value="75001"
                    disabled
                    class="w-full"
                  />
                </div>
                
                <!-- Ville -->
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <UInput
                    value="Paris"
                    disabled
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Sécurité -->
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 class="text-lg font-medium text-blue-800">Sécurité</h2>
          </div>
          
          <div class="p-6 space-y-6">
            <!-- Mot de passe -->
            <div>
              <div class="flex justify-between items-center mb-2">
                <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
                <UButton color="blue" variant="ghost" size="sm">
                  Changer le mot de passe
                </UButton>
              </div>
              <UInput
                value="••••••••••••"
                type="password"
                disabled
                class="w-full"
              />
            </div>
            
            <!-- Authentification à deux facteurs -->
            <div class="pt-4 border-t border-gray-100">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-sm font-medium text-gray-700">Authentification à deux facteurs</h3>
                  <p class="text-xs text-gray-500 mt-1">
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                  </p>
                </div>
                <USwitch color="blue" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Préférences de notification -->
        <div class="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          <div class="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 class="text-lg font-medium text-blue-800">Préférences de notification</h2>
          </div>
          
          <div class="p-6 space-y-4">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-sm font-medium text-gray-700">Notifications par email</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Recevoir des notifications par email
                </p>
              </div>
              <USwitch color="blue" :model-value="true" />
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <div>
                <h3 class="text-sm font-medium text-gray-700">Notifications push</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Recevoir des notifications sur votre appareil
                </p>
              </div>
              <USwitch color="blue" :model-value="true" />
            </div>
            
            <div class="flex justify-between items-center pt-4 border-t border-gray-100">
              <div>
                <h3 class="text-sm font-medium text-gray-700">Newsletter</h3>
                <p class="text-xs text-gray-500 mt-1">
                  Recevoir notre newsletter mensuelle
                </p>
              </div>
              <USwitch color="blue" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
  layout: 'dashboard'
})

// Head configuration
useHead({
  title: 'Mon profil - CivActu'
})

// Ici, vous pourriez ajouter la logique pour récupérer les données de l'utilisateur
// et gérer les mises à jour du profil
</script>
