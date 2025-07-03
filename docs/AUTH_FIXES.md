# Correction des problèmes d'authentification

## 🚨 Problèmes identifiés et corrigés

### 1. **Token non initialisé au démarrage**
**Problème :** L'ApiClient ne récupérait pas le token depuis les cookies au démarrage de l'application.

**Solution :** Modification du plugin `api.client.ts` pour initialiser automatiquement le token :
```typescript
// plugins/api.client.ts
if (process.client) {
  const tokenCookie = useCookie('auth-token')
  if (tokenCookie.value) {
    apiClient.setAuthToken(tokenCookie.value)
  }
}
```

### 2. **Middleware d'initialisation incorrect**
**Problème :** Le middleware global utilisait `useUsers()` au lieu du store auth directement.

**Solution :** Utilisation directe du store auth dans `init.global.ts` :
```typescript
const authStore = useAuthStore()
await authStore.initializeAuth()
```

### 3. **Configuration des cookies trop restrictive**
**Problème :** Les cookies étaient configurés avec `secure: true` et `sameSite: 'strict'` en développement.

**Solution :** Configuration adaptative selon l'environnement :
```typescript
const tokenCookie = useCookie('auth-token', {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 7 jours
})
```

### 4. **Endpoints API incorrects**
**Problème :** Les endpoints utilisaient des préfixes `/api/v1/` qui n'existent pas dans l'API NestJS.

**Solution :** Correction de tous les endpoints :
- ❌ `/api/v1/auth/login` → ✅ `/auth/login`
- ❌ `/api/v1/users/me` → ✅ `/users/me`
- ❌ `/api/v1/tags` → ✅ `/tags`

### 5. **Réponse API mal typée**
**Problème :** L'endpoint `/users/me` retourne `{ success: boolean, data: User }` mais le code attendait `{ user: User }`.

**Solution :** Correction du typage dans `initializeAuth()` :
```typescript
const response = await $api.get<{ success: boolean, data: User }>('/users/me')
if (response.success && response.data) {
  this.setAuth(response.data, token)
}
```

## ✅ Résultats attendus

Après ces corrections :

1. **Le token est automatiquement chargé** au démarrage de l'application
2. **L'utilisateur reste connecté** après un rafraîchissement de page
3. **Le token est envoyé dans toutes les requêtes** suivantes
4. **Les informations utilisateur sont disponibles** dans le dashboard
5. **L'authentification fonctionne de bout en bout**

## 🧪 Test de vérification

Pour vérifier que tout fonctionne :

1. **Se connecter** via `/auth/login`
2. **Vérifier dans les DevTools** :
   - Cookie `auth-token` présent
   - Header `Authorization: Bearer ...` dans les requêtes suivantes
3. **Rafraîchir la page** : l'utilisateur doit rester connecté
4. **Aller au dashboard** : les informations utilisateur doivent s'afficher

## 🔧 Points d'attention

- **Sécurité des cookies** : En production, `secure: true` sera activé automatiquement
- **Expiration du token** : Le token expire au bout de 7 jours (configurable)
- **Gestion des erreurs** : En cas d'erreur d'authentification, l'utilisateur est automatiquement déconnecté
- **Compatibilité** : Toutes les méthodes existantes continuent de fonctionner

## 📝 Fichiers modifiés

- `plugins/api.client.ts` - Initialisation du token
- `middleware/init.global.ts` - Utilisation du store auth
- `stores/auth.ts` - Correction des endpoints et cookies
- `stores/tags.ts` - Correction des endpoints
- `composables/useUsers.ts` - Correction des endpoints
- `utils/api.ts` - Récupération automatique du token
- `composables/useApi.ts` - Unification avec ApiClient

Tous les changements sont **rétrocompatibles** et ne cassent pas le code existant.
