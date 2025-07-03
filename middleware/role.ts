export default defineNuxtRouteMiddleware((to, from) => {
  const { userRole, hasRole, hasAnyRole } = useUsers()
  const requiredRole = to.meta.requiresRole as string | undefined
  const requiredRoles = to.meta.requiresRoles as string[] | undefined
  
  // Vérifier un rôle spécifique
  if (requiredRole && !hasRole(requiredRole)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit - Rôle insuffisant'
    })
  }
  
  // Vérifier plusieurs rôles possibles
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit - Rôle insuffisant'
    })
  }
})
