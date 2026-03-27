export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie('bellaterra_admin')

  if (to.path === '/admin/login') {
    if (cookie.value === 'authenticated') return navigateTo('/admin')
    return
  }

  if (to.path.startsWith('/admin')) {
    if (cookie.value !== 'authenticated') {
      return navigateTo('/admin/login')
    }
  }
})
