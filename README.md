# CivActu Frontend Structure

## 📁 Structure du projet

```
civactu_front_ui/
├── 📁 types/           # Types TypeScript
├── 📁 utils/           # Utilitaires et helpers
├── 📁 composables/     # Composables Nuxt/Vue
├── 📁 stores/          # Stores Pinia
├── 📁 pages/           # Pages et routes
├── 📁 components/      # Composants Vue
├── 📁 layouts/         # Layouts Nuxt
├── 📁 plugins/         # Plugins Nuxt
├── 📁 middleware/      # Middleware de route
├── 📁 assets/          # Assets statiques
├── 📁 public/          # Fichiers publics
├── 📁 server/          # API routes (optionnel)
└── 📁 docs/            # Documentation
```

## 🏗️ Architecture actuelle

### ✅ Complété

#### Types TypeScript (`/types/`)
- `auth.ts` - Types d'authentification et utilisateur
- `user.ts` - Types utilisateur complets
- `opinion.ts` - Types pour les avis/opinions
- `report.ts` - Types pour les signalements
- `message.ts` - Types pour la messagerie
- `notification.ts` - Types pour les notifications
- `location.ts` - Types pour les localisations
- `comment.ts` - Types pour les commentaires
- `tag.ts` - Types pour les tags
- `stats.ts` - Types pour les statistiques
- `api.ts` - Types génériques pour l'API

#### Utilitaires (`/utils/`)
- `api.ts` - Client API générique avec gestion d'erreurs
- `auth.ts` - Helpers d'authentification et de gestion des tokens
- `validation.ts` - Schémas Zod et helpers de validation
- `formatting.ts` - Formatage de dates, nombres, chaînes, etc.
- `constants.ts` - Configuration, routes, couleurs, permissions
- `permissions.ts` - Helpers de gestion des permissions
- `geo.ts` - Géolocalisation et calculs géographiques

#### Composables (`/composables/`)
- `useApi.ts` - Wrapper API avec gestion d'état
- `useAuth.ts` - Authentification et état utilisateur
- `useGeolocation.ts` - Géolocalisation réactive
- `useNotifications.ts` - Système de notifications toast
- `useUpload.ts` - Upload de fichiers avec progress
- `useMap.ts` - Intégration cartes (Leaflet/Mapbox)
- `useSearch.ts` - Recherche avancée avec historique
- `useTheme.ts` - Gestion des thèmes (clair/sombre/système)
- `useRealtime.ts` - WebSocket et mises à jour temps réel
- `index.ts` - Exports centralisés

#### Stores Pinia (`/stores/`)
- `auth.ts` - État d'authentification et utilisateur
- `opinions.ts` - CRUD avis/opinions avec cache et pagination
- `app.ts` - État global de l'application
- `reports.ts` - Gestion des signalements
- `messages.ts` - Messagerie et conversations
- `notifications.ts` - Notifications système
- `tags.ts` - Gestion des tags avec suggestions
- `stats.ts` - Statistiques et tableaux de bord
- `locations.ts` - Lieux et géolocalisation

#### Configuration
- `package.json` - Dépendances Nuxt, Pinia, Zod, Leaflet, etc.
- `nuxt.config.ts` - Configuration Nuxt avec modules et PWA
- `tsconfig.json` - Configuration TypeScript

## 🛠️ Technologies utilisées

### Core
- **Nuxt 3** - Framework full-stack Vue.js
- **Vue 3** - Framework UI réactif
- **TypeScript** - Typage statique
- **Pinia** - Gestionnaire d'état

### UI & Styling
- **Nuxt UI** - Composants UI prêts à l'emploi
- **Tailwind CSS** - Framework CSS utility-first
- **Nuxt Icon** - Icônes vectorielles
- **Nuxt Fonts** - Optimisation des polices

### Fonctionnalités
- **VueUse** - Composables utilitaires
- **Zod** - Validation de schémas
- **Leaflet** - Cartes interactives
- **PWA** - Application web progressive

### Développement
- **ESLint** - Linting du code
- **Vite** - Build tool rapide
- **TypeScript strict** - Typage rigoureux

## 🚀 Utilisation

### Installation
```bash
cd civactu_front_ui
npm install
```

### Développement
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Type checking
```bash
npm run type-check
```

## 🔌 Intégration API

Le frontend est conçu pour s'intégrer parfaitement avec l'API backend CivActu :

- **Base URL** : Configurable via `API_BASE_URL`
- **WebSocket** : Configurable via `WS_URL`
- **Authentification** : JWT avec refresh automatique
- **Gestion d'erreurs** : Centralisée avec notifications
- **Cache intelligent** : Optimisation des requêtes

## 📱 PWA Features

- Installation sur mobile/desktop
- Fonctionnement hors-ligne
- Notifications push
- Mise à jour automatique
- Icônes et splash screens

## 🎨 Thèmes

Support complet des thèmes :
- Clair / Sombre / Système
- Couleurs personnalisables
- Accessibilité optimisée
- Persistance des préférences

## 🔔 Notifications

Système de notifications multi-canal :
- Toast notifications (succès, erreur, info, warning)
- Notifications push PWA
- Notifications temps réel via WebSocket
- Historique et gestion des notifications

## 🗺️ Géolocalisation

Fonctionnalités géographiques :
- Géolocalisation utilisateur
- Cartes interactives (Leaflet)
- Recherche de lieux
- Calculs de distance
- Filtrage géographique

## 📊 État de développement

- ✅ **Types** : 100% - Tous les types essentiels définis
- ✅ **Utils** : 100% - Helpers et utilitaires complets  
- ✅ **Composables** : 100% - Composables principaux créés
- ✅ **Stores** : 100% - Stores Pinia pour toutes les entités
- 🔄 **Pages** : 0% - À créer selon les besoins
- 🔄 **Composants** : 0% - À créer selon les besoins
- 🔄 **Tests** : 0% - À implémenter
- ⚠️ **Config** : 90% - Configuration PWA à finaliser

## 📝 Notes importantes

1. **Erreurs TypeScript** : Certaines erreurs de typage sont normales en phase de développement sans les modules installés
2. **Configuration PWA** : À ajuster selon la version du module `@vite-pwa/nuxt`
3. **API Integration** : Prêt pour l'intégration avec le backend
4. **Responsive Design** : À implémenter avec Tailwind CSS
5. **Tests** : Infrastructure prête pour Jest/Vitest

## 🔗 Liens utiles

- [Documentation Nuxt 3](https://nuxt.com)
- [Pinia Store](https://pinia.vuejs.org)
- [Nuxt UI](https://ui.nuxt.com)
- [VueUse](https://vueuse.org)
- [Zod Validation](https://zod.dev)

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
