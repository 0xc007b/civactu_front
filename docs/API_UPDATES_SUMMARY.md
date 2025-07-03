# Mise à jour des API endpoints pour CivActu Front-UI

## Résumé des modifications effectuées

Tous les endpoints ont été mis à jour pour correspondre à la documentation API officielle disponible sur `https://api.civactu.flrxnt.com/api/docs#/`. Le préfixe `` a été ajouté à tous les endpoints.

### 1. Composables créés/mis à jour

#### Nouveaux composables créés :
- **`useUsers.ts`** - Gestion des utilisateurs
- **`useOpinions.ts`** - Gestion des opinions
- **`useReports.ts`** - Gestion des rapports/signalements
- **`useMessages.ts`** - Gestion des messages
- **`useLocations.ts`** - Gestion des régions et municipalités
- **`useComments.ts`** - Gestion des commentaires
- **`useTags.ts`** - Gestion des tags
- **`useStats.ts`** - Recherche globale et statistiques
- **`useApiNotifications.ts`** - Notifications API (distinctes des notifications toast)

#### Composables mis à jour :
- **`useAuth.ts`** - Endpoints d'authentification mis à jour avec `` et ajout de `resendVerification`

### 2. Stores mis à jour

#### `stores/auth.ts` :
- ✅ `/auth/login`
- ✅ `/auth/register`
- ✅ `/auth/refresh`
- ✅ `/auth/forgot-password`
- ✅ `/auth/reset-password`
- ✅ `/auth/verify-email`
- ✅ `/auth/resend-verification`
- ✅ `/users/me` (pour initializeAuth)
- ✅ `/users/profile` (pour updateProfile)

#### `stores/opinions.ts` :
- ✅ `/opinions` (GET, POST)
- ✅ `/opinions/{id}` (GET, PATCH, DELETE)
- ✅ `/opinions/{id}/like` (POST)

#### `stores/reports.ts` :
- ✅ `/reports` (GET, POST)
- ✅ `/reports/{id}` (GET, PATCH, DELETE)
- ✅ `/reports/{id}/assign` (POST) - Nouveau
- ✅ `/reports/{id}/update` (POST) - Nouveau
- 🔧 Correction des méthodes HTTP incorrectes

#### `stores/tags.ts` :
- ✅ `/tags` (GET, POST)
- ✅ `/tags/{id}` (GET, PATCH, DELETE)
- 🔧 Suppression des endpoints inexistants (search, popular, suggest)
- 🔧 Correction des méthodes HTTP incorrectes

### 3. Nouveau store créé

#### `stores/regions.ts` :
- ✅ `/locations/regions` (GET, POST)
- ✅ `/locations/regions/{id}` (PUT, DELETE)
- ✅ `/locations/municipalities` (GET, POST)
- ✅ `/locations/municipalities/{id}` (GET, PUT, DELETE)

### 4. Endpoints API couverts selon la documentation

#### Authentication ✅
- [x] POST `/auth/login`
- [x] POST `/auth/register`
- [x] POST `/auth/refresh`
- [x] POST `/auth/forgot-password`
- [x] POST `/auth/reset-password`
- [x] POST `/auth/verify-email`
- [x] GET `/auth/verify-email`
- [x] POST `/auth/resend-verification`

#### Users ✅
- [x] POST `/users`
- [x] GET `/users`
- [x] GET `/users/me`
- [x] GET `/users/profile`
- [x] PUT `/users/profile`
- [x] GET `/users/{id}`
- [x] PATCH `/users/{id}`
- [x] DELETE `/users/{id}`

#### Opinions ✅
- [x] POST `/opinions`
- [x] GET `/opinions`
- [x] GET `/opinions/{id}`
- [x] PATCH `/opinions/{id}`
- [x] DELETE `/opinions/{id}`
- [x] POST `/opinions/{id}/like`

#### Reports ✅
- [x] POST `/reports`
- [x] GET `/reports`
- [x] GET `/reports/{id}`
- [x] PATCH `/reports/{id}`
- [x] DELETE `/reports/{id}`
- [x] POST `/reports/{id}/assign`
- [x] POST `/reports/{id}/update`

#### Messages ✅
- [x] POST `/messages`
- [x] GET `/messages`
- [x] GET `/messages/{id}`
- [x] DELETE `/messages/{id}`
- [x] PUT `/messages/{id}/read`
- [x] POST `/messages/{id}/reply`

#### Locations ✅
- [x] GET `/locations/regions`
- [x] POST `/locations/regions`
- [x] PUT `/locations/regions/{id}`
- [x] DELETE `/locations/regions/{id}`
- [x] GET `/locations/municipalities`
- [x] POST `/locations/municipalities`
- [x] GET `/locations/municipalities/{id}`
- [x] PUT `/locations/municipalities/{id}`
- [x] DELETE `/locations/municipalities/{id}`

#### Notifications ✅
- [x] GET `/notifications`
- [x] PUT `/notifications/{id}/read`
- [x] PUT `/notifications/read-all`
- [x] POST `/notifications/send/user`
- [x] POST `/notifications/send/all`
- [x] POST `/notifications/send/municipality`
- [x] POST `/notifications/send/role`

#### Comments ✅
- [x] POST `/comments`
- [x] GET `/comments`
- [x] GET `/comments/{id}`
- [x] PATCH `/comments/{id}`
- [x] DELETE `/comments/{id}`

#### Tags ✅
- [x] POST `/tags`
- [x] GET `/tags`
- [x] GET `/tags/{id}`
- [x] PATCH `/tags/{id}`
- [x] DELETE `/tags/{id}`

#### Statistics & Search ✅
- [x] GET `/search`
- [x] GET `/stats/dashboard`
- [x] GET `/stats/public`

#### Health ✅
- [x] GET `/health`

### 5. Corrections techniques effectuées

1. **Méthodes HTTP corrigées** : Remplacement des usages incorrects de `$api.get` avec `method: 'POST'` par les bonnes méthodes `$api.post`, `$api.patch`, etc.

2. **Gestion des erreurs** : Harmonisation de la gestion d'erreurs dans tous les composables et stores

3. **Nom des méthodes** : Correction de `del` vers `delete: del` dans les destructurations

4. **Structure des réponses** : Adaptation aux structures de réponses attendues selon l'API

### 6. Actions à effectuer après ces modifications

1. **Tests** : Tester tous les endpoints mis à jour avec le serveur API
2. **Configuration** : Vérifier que `nuxt.config.ts` utilise la bonne URL de base pour l'API
3. **Types TypeScript** : Vérifier et mettre à jour les types si nécessaire selon les réponses API réelles
4. **Documentation** : Mettre à jour la documentation du projet avec les nouveaux composables

### 7. Notes importantes

- Tous les endpoints respectent maintenant la structure `/` de l'API officielle
- Les composables sont prêts à être utilisés dans les pages et components
- Les stores Pinia ont été mis à jour pour une gestion d'état cohérente
- La gestion d'erreurs est unifiée à travers tout le projet
