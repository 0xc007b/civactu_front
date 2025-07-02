# Mise à jour des API endpoints pour CivActu Front-UI

## Résumé des modifications effectuées

Tous les endpoints ont été mis à jour pour correspondre à la documentation API officielle disponible sur `https://api.civactu.flrxnt.com/api/docs#/`. Le préfixe `/api/v1` a été ajouté à tous les endpoints.

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
- **`useAuth.ts`** - Endpoints d'authentification mis à jour avec `/api/v1` et ajout de `resendVerification`

### 2. Stores mis à jour

#### `stores/auth.ts` :
- ✅ `/api/v1/auth/login`
- ✅ `/api/v1/auth/register`
- ✅ `/api/v1/auth/refresh`
- ✅ `/api/v1/auth/forgot-password`
- ✅ `/api/v1/auth/reset-password`
- ✅ `/api/v1/auth/verify-email`
- ✅ `/api/v1/auth/resend-verification`
- ✅ `/api/v1/users/me` (pour initializeAuth)
- ✅ `/api/v1/users/profile` (pour updateProfile)

#### `stores/opinions.ts` :
- ✅ `/api/v1/opinions` (GET, POST)
- ✅ `/api/v1/opinions/{id}` (GET, PATCH, DELETE)
- ✅ `/api/v1/opinions/{id}/like` (POST)

#### `stores/reports.ts` :
- ✅ `/api/v1/reports` (GET, POST)
- ✅ `/api/v1/reports/{id}` (GET, PATCH, DELETE)
- ✅ `/api/v1/reports/{id}/assign` (POST) - Nouveau
- ✅ `/api/v1/reports/{id}/update` (POST) - Nouveau
- 🔧 Correction des méthodes HTTP incorrectes

#### `stores/tags.ts` :
- ✅ `/api/v1/tags` (GET, POST)
- ✅ `/api/v1/tags/{id}` (GET, PATCH, DELETE)
- 🔧 Suppression des endpoints inexistants (search, popular, suggest)
- 🔧 Correction des méthodes HTTP incorrectes

### 3. Nouveau store créé

#### `stores/regions.ts` :
- ✅ `/api/v1/locations/regions` (GET, POST)
- ✅ `/api/v1/locations/regions/{id}` (PUT, DELETE)
- ✅ `/api/v1/locations/municipalities` (GET, POST)
- ✅ `/api/v1/locations/municipalities/{id}` (GET, PUT, DELETE)

### 4. Endpoints API couverts selon la documentation

#### Authentication ✅
- [x] POST `/api/v1/auth/login`
- [x] POST `/api/v1/auth/register`
- [x] POST `/api/v1/auth/refresh`
- [x] POST `/api/v1/auth/forgot-password`
- [x] POST `/api/v1/auth/reset-password`
- [x] POST `/api/v1/auth/verify-email`
- [x] GET `/api/v1/auth/verify-email`
- [x] POST `/api/v1/auth/resend-verification`

#### Users ✅
- [x] POST `/api/v1/users`
- [x] GET `/api/v1/users`
- [x] GET `/api/v1/users/me`
- [x] GET `/api/v1/users/profile`
- [x] PUT `/api/v1/users/profile`
- [x] GET `/api/v1/users/{id}`
- [x] PATCH `/api/v1/users/{id}`
- [x] DELETE `/api/v1/users/{id}`

#### Opinions ✅
- [x] POST `/api/v1/opinions`
- [x] GET `/api/v1/opinions`
- [x] GET `/api/v1/opinions/{id}`
- [x] PATCH `/api/v1/opinions/{id}`
- [x] DELETE `/api/v1/opinions/{id}`
- [x] POST `/api/v1/opinions/{id}/like`

#### Reports ✅
- [x] POST `/api/v1/reports`
- [x] GET `/api/v1/reports`
- [x] GET `/api/v1/reports/{id}`
- [x] PATCH `/api/v1/reports/{id}`
- [x] DELETE `/api/v1/reports/{id}`
- [x] POST `/api/v1/reports/{id}/assign`
- [x] POST `/api/v1/reports/{id}/update`

#### Messages ✅
- [x] POST `/api/v1/messages`
- [x] GET `/api/v1/messages`
- [x] GET `/api/v1/messages/{id}`
- [x] DELETE `/api/v1/messages/{id}`
- [x] PUT `/api/v1/messages/{id}/read`
- [x] POST `/api/v1/messages/{id}/reply`

#### Locations ✅
- [x] GET `/api/v1/locations/regions`
- [x] POST `/api/v1/locations/regions`
- [x] PUT `/api/v1/locations/regions/{id}`
- [x] DELETE `/api/v1/locations/regions/{id}`
- [x] GET `/api/v1/locations/municipalities`
- [x] POST `/api/v1/locations/municipalities`
- [x] GET `/api/v1/locations/municipalities/{id}`
- [x] PUT `/api/v1/locations/municipalities/{id}`
- [x] DELETE `/api/v1/locations/municipalities/{id}`

#### Notifications ✅
- [x] GET `/api/v1/notifications`
- [x] PUT `/api/v1/notifications/{id}/read`
- [x] PUT `/api/v1/notifications/read-all`
- [x] POST `/api/v1/notifications/send/user`
- [x] POST `/api/v1/notifications/send/all`
- [x] POST `/api/v1/notifications/send/municipality`
- [x] POST `/api/v1/notifications/send/role`

#### Comments ✅
- [x] POST `/api/v1/comments`
- [x] GET `/api/v1/comments`
- [x] GET `/api/v1/comments/{id}`
- [x] PATCH `/api/v1/comments/{id}`
- [x] DELETE `/api/v1/comments/{id}`

#### Tags ✅
- [x] POST `/api/v1/tags`
- [x] GET `/api/v1/tags`
- [x] GET `/api/v1/tags/{id}`
- [x] PATCH `/api/v1/tags/{id}`
- [x] DELETE `/api/v1/tags/{id}`

#### Statistics & Search ✅
- [x] GET `/api/v1/search`
- [x] GET `/api/v1/stats/dashboard`
- [x] GET `/api/v1/stats/public`

#### Health ✅
- [x] GET `/api/v1/health`

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

- Tous les endpoints respectent maintenant la structure `/api/v1/` de l'API officielle
- Les composables sont prêts à être utilisés dans les pages et components
- Les stores Pinia ont été mis à jour pour une gestion d'état cohérente
- La gestion d'erreurs est unifiée à travers tout le projet
