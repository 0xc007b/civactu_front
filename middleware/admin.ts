export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin } = useUsers()
  
  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Accès interdit - Droits administrateur requis'
    })
  }
})
