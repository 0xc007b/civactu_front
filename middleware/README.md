# Middlewares - Guide d'utilisation

Ce dossier contient tous les middlewares de navigation pour l'application CivActu. Voici comment les utiliser :

## Middlewares disponibles

### 1. `auth.ts` - Authentification requise
Vérifie que l'utilisateur est connecté. Redirige vers `/auth/login` si non connecté.

```vue
<!-- Usage dans une page -->
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

### 2. `guest.ts` - Invités uniquement
Autorise uniquement les utilisateurs non connectés. Redirige vers `/dashboard` si connecté.

```vue
<!-- Usage pour les pages de connexion/inscription -->
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>
```

### 3. `verified.ts` - Email vérifié requis
Vérifie que l'email de l'utilisateur est vérifié. Redirige vers `/auth/verify-email` si non vérifié.

```vue
<!-- Usage avec auth pour les pages sensibles -->
<script setup>
definePageMeta({
  middleware: ['auth', 'verified']
})
</script>
```

### 4. `admin.ts` - Administrateur requis
Vérifie que l'utilisateur a le rôle ADMIN. Retourne une erreur 403 si non autorisé.

```vue
<!-- Usage pour les pages d'administration -->
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'admin']
})
</script>
```

### 5. `official.ts` - Élu/Officiel requis
Vérifie que l'utilisateur a le rôle OFFICIAL ou ADMIN. Retourne une erreur 403 si non autorisé.

```vue
<!-- Usage pour les pages réservées aux élus -->
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'official']
})
</script>
```

### 6. `role.ts` - Rôles personnalisés
Middleware générique pour vérifier des rôles spécifiques via les meta de route.

```vue
<!-- Usage avec meta requiresRole -->
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'role'],
  requiresRole: 'ADMIN'
})
</script>

<!-- Usage avec meta requiresRoles (plusieurs rôles possibles) -->
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'role'],
  requiresRoles: ['ADMIN', 'OFFICIAL']
})
</script>
```

### 7. `init.global.ts` - Initialisation globale
Middleware global qui s'exécute automatiquement sur toutes les routes. Il initialise l'authentification si un token existe.

Ce middleware est automatique et n'a pas besoin d'être déclaré explicitement.

## Combinaisons communes

### Page publique (accueil)
```vue
<!-- Aucun middleware nécessaire -->
```

### Page de connexion
```vue
<script setup>
definePageMeta({
  middleware: 'guest'
})
</script>
```

### Page du dashboard utilisateur
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'verified']
})
</script>
```

### Page d'administration
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'admin']
})
</script>
```

### Page réservée aux élus
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'official']
})
</script>
```

### Page avec rôle spécifique
```vue
<script setup>
definePageMeta({
  middleware: ['auth', 'verified', 'role'],
  requiresRole: 'SPECIFIC_ROLE'
})
</script>
```

## Gestion des erreurs

Les middlewares utilisent `createError()` pour les erreurs d'autorisation :
- Status 403 : Accès interdit (rôle insuffisant)
- Redirection automatique pour l'authentification

## Notes importantes

1. **Ordre des middlewares** : L'ordre est important. Toujours mettre `auth` avant `verified`, et `verified` avant les middlewares de rôle.

2. **Middleware global** : `init.global.ts` s'exécute automatiquement et initialise l'authentification sur toutes les routes.

3. **Composable `useUsers`** : Tous les middlewares utilisent le composable `useUsers()` au lieu de `useAuth()` pour la cohérence avec l'architecture du projet.

4. **Réactivité** : Les middlewares sont réactifs et se mettent à jour automatiquement quand l'état d'authentification change.
