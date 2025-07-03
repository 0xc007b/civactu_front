export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useUsers()
  
  if (isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
