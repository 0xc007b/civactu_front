export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, isEmailVerified } = useUsers()
  
  if (isAuthenticated && !isEmailVerified) {
    return navigateTo('/auth/verify-email')
  }
})
