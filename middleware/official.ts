export default defineNuxtRouteMiddleware((to, from) => {
  const { isOfficial, isAdmin } = useUsers()
  
  if (!isOfficial && !isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit - Droits d\'élu requis'
    })
  }
})
