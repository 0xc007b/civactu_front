# Architecture Composables ↔ Stores

## Nouvelle Architecture Adoptée

Nous avons refactorisé l'architecture pour éliminer la duplication entre les composables et les stores. Voici les principes adoptés :

### 🎯 Principe Central : Composables utilisent les Stores

**Les composables ne font plus d'appels API directs** mais utilisent les stores Pinia comme couche d'abstraction.

```typescript
// ❌ Ancien pattern (duplication)
export const useReports = () => {
  const { get, post } = useApi()
  
  const getAllReports = async () => {
    return await get('/api/v1/reports') // Appel API direct
  }
}

// ✅ Nouveau pattern (utilise le store)
export const useReports = () => {
  const reportsStore = useReportsStore()
  
  const getAllReports = async () => {
    await reportsStore.fetchReports() // Utilise le store
    return {
      success: true,
      data: reportsStore.reports,
      meta: { pagination: reportsStore.pagination }
    }
  }
}
```

## 🏗️ Architecture en Couches

```
📱 COMPONENTS
    ↓ utilisent
🔧 COMPOSABLES
    ↓ utilisent
🗄️ STORES (Pinia)
    ↓ utilisent
🌐 API CLIENT (useApi)
    ↓ appelle
🔌 API BACKEND
```

### Avantages de cette architecture :

1. **Single Source of Truth** - L'état est centralisé dans les stores
2. **Cache automatique** - Les stores gèrent le cache de données
3. **Réactivité** - Toute modification est automatiquement propagée
4. **Élimination de la duplication** - Une seule logique API par fonctionnalité
5. **Meilleure testabilité** - Plus facile de mocker les stores
6. **Gestion d'état unifiée** - Loading states, erreurs, pagination centralisés

## 📋 Composables Refactorisés

### ✅ useReports
- Utilise `useReportsStore()`
- Expose l'état réactif : `reports`, `loading`, `error`, `pagination`
- Expose les getters : `filteredReports`, `reportsByStatus`, `reportsByType`
- Actions wrapper : `createReport()`, `getAllReports()`, etc.

### ✅ useOpinions
- Utilise `useOpinionsStore()`
- Expose l'état réactif : `opinions`, `currentOpinion`, `isLoading`
- Expose les getters : `filteredOpinions`, `hasMorePages`
- Actions wrapper : `createOpinion()`, `toggleLikeOpinion()`, etc.

### ✅ useUsers
- Utilise `useAuthStore()` pour les données utilisateur
- Garde certains appels API directs pour les fonctions admin
- Expose l'état d'authentification : `user`, `isAuthenticated`, etc.

### ✅ useTags
- Utilise `useTagsStore()`
- Expose l'état réactif : `tags`, `popularTags`, `loading`
- Expose les getters : `tagsByCategory`, `searchSuggestions`

## 🎨 Pattern d'Usage dans les Components

```vue
<script setup>
// ✅ Utiliser le composable qui wrap le store
const { 
  reports, 
  loading, 
  getAllReports, 
  createReport 
} = useReports()

// Les données sont automatiquement réactives
await getAllReports()

// ✅ Alternative : utiliser directement le store si besoin
const reportsStore = useReportsStore()
</script>

<template>
  <div v-if="loading">Chargement...</div>
  <div v-for="report in reports" :key="report.id">
    {{ report.title }}
  </div>
</template>
```

## 🔄 Migration des Composants Existants

Pour migrer un composant existant :

1. **Remplacer les appels de composables** par la nouvelle version
2. **Vérifier la réactivité** - Les données sont maintenant automatiquement réactives
3. **Utiliser les getters** du store via le composable
4. **Simplifier la gestion d'état** - Plus besoin de gérer loading/error localement

## 📦 Stores comme Source de Vérité

Les stores Pinia restent la source de vérité pour :
- **État des données** (`reports`, `opinions`, `tags`, etc.)
- **États de chargement** (`loading`, `isCreating`, `isUpdating`)
- **Gestion d'erreurs** (`error`)
- **Pagination** (`pagination`)
- **Cache** (`cache`)
- **Filtres** (`filters`)

## 🎯 Recommandations

### Quand utiliser les Composables :
- Dans les **components Vue** pour une API simplifiée
- Quand vous avez besoin de **wrapper/transformer** les données du store
- Pour **combiner plusieurs stores** dans une seule interface

### Quand utiliser directement les Stores :
- Pour des **opérations complexes** nécessitant plusieurs actions
- Dans les **plugins** ou **middleware**
- Quand vous avez besoin d'un **contrôle fin** sur l'état

## 🚀 Prochaines Étapes

1. **Tester** tous les composables refactorisés
2. **Migrer** les composants existants
3. **Ajouter des tests** pour les nouvelles interfaces
4. **Documenter** les patterns spécifiques à chaque domaine
5. **Créer** des stores pour les fonctionnalités manquantes (Messages, Comments, etc.)

Cette architecture offre une base solide, maintenable et performante pour l'application CivActu ! 🎉
